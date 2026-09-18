param(
  [string]$ArchivePath = "$env:USERPROFILE\kl-web-standalone-release.zip",
  [string]$ReleaseRoot = "$env:USERPROFILE\KL_WEB\release",
  [string]$NodeHome = "$env:USERPROFILE\KL_WEB\runtime\node",
  [Parameter(Mandatory = $true)]
  [int]$Port
)

$ErrorActionPreference = "Stop"

$node = Join-Path $NodeHome "node.exe"
if (!(Test-Path $node)) { throw "node.exe not found: $node" }
if (!(Test-Path $ArchivePath)) { throw "Release archive not found: $ArchivePath" }

$parent = Split-Path $ReleaseRoot -Parent
$stage = Join-Path $parent "release.next"
$pidFile = Join-Path $parent ".kl-web.pid"
$logDir = Join-Path $parent "logs"
$stdout = Join-Path $logDir "server.out.log"
$stderr = Join-Path $logDir "server.err.log"

New-Item -ItemType Directory -Force -Path $parent | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Expand-Archive -Path $ArchivePath -DestinationPath $stage -Force
if (!(Test-Path (Join-Path $stage "server.js"))) {
  throw "Release validation failed: server.js is missing."
}

$sharedDir = Join-Path $parent "shared"
New-Item -ItemType Directory -Force -Path $sharedDir | Out-Null
$existingApp = Join-Path $parent "app"

foreach ($name in @(".env.production.local", ".env.local", ".env.production", ".env")) {
  $sharedFile = Join-Path $sharedDir $name
  $legacyFile = Join-Path $existingApp $name

  if (!(Test-Path $sharedFile) -and (Test-Path $legacyFile)) {
    Copy-Item $legacyFile $sharedFile -Force
  }

  if (Test-Path $sharedFile) {
    Copy-Item $sharedFile (Join-Path $stage $name) -Force
  }
}

$oldPid = $null
if (Test-Path $pidFile) {
  $pidText = (Get-Content $pidFile -Raw).Trim()
  if ($pidText -match '^\d+$') {
    $oldPid = [int]$pidText
  }
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener -and (!$oldPid -or $listener.OwningProcess -ne $oldPid)) {
  $owner = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  $ownerName = if ($owner) { $owner.ProcessName } else { "unknown" }
  throw "Port $Port is already used by PID $($listener.OwningProcess) ($ownerName). Refusing to stop an unmanaged process."
}

if ($oldPid) {
  $oldProcess = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
  if ($oldProcess) {
    Stop-Process -Id $oldPid -Force
    Start-Sleep -Milliseconds 750
  }
}

if (Test-Path $ReleaseRoot) {
  Remove-Item $ReleaseRoot -Recurse -Force
}
Move-Item $stage $ReleaseRoot

$oldPort = $env:PORT
$oldHostname = $env:HOSTNAME

try {
  $env:PORT = "$Port"
  $env:HOSTNAME = "127.0.0.1"

  $startParams = @{
    FilePath = $node
    ArgumentList = @("server.js")
    WorkingDirectory = $ReleaseRoot
    RedirectStandardOutput = $stdout
    RedirectStandardError = $stderr
    WindowStyle = "Hidden"
    PassThru = $true
  }
  $process = Start-Process @startParams
}
finally {
  $env:PORT = $oldPort
  $env:HOSTNAME = $oldHostname
}

Set-Content -Path $pidFile -Value $process.Id -NoNewline

$healthy = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  if ($process.HasExited) { break }

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/" -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      $healthy = $true
      break
    }
  }
  catch {
  }
}

if (!$healthy) {
  Write-Host "KL_WEB failed to become healthy on port $Port." -ForegroundColor Red
  if (Test-Path $stdout) { Get-Content $stdout -Tail 40 }
  if (Test-Path $stderr) { Get-Content $stderr -Tail 40 }
  exit 1
}

Remove-Item $ArchivePath -Force -ErrorAction SilentlyContinue
Write-Host "KL_WEB standalone is healthy on http://127.0.0.1:$Port (PID $($process.Id))" -ForegroundColor Green
