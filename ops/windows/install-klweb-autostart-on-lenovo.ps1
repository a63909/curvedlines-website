param(
  [int]$Port = 3100,
  [switch]$StartNow
)

$ErrorActionPreference = "Stop"

$root = "$env:USERPROFILE\KL_WEB"
$release = "$root\release"
$node = "$root\runtime\node\node.exe"
$runner = "$root\run-klweb-standalone.ps1"
$taskName = "KL_WEB_STANDALONE"
$outLog = "$root\logs\next.out.log"
$errLog = "$root\logs\next.err.log"
$supervisorLog = "$root\logs\supervisor.log"

if (!(Test-Path $node)) { throw "node.exe not found: $node" }
if (!(Test-Path (Join-Path $release "server.js"))) { throw "server.js not found in $release" }
New-Item -ItemType Directory -Force -Path "$root\logs" | Out-Null

$runnerContent = @'
param([int]$Port = 3100)

$ErrorActionPreference = "Continue"
$root = "$env:USERPROFILE\KL_WEB"
$release = "$root\release"
$node = "$root\runtime\node\node.exe"
$outLog = "$root\logs\next.out.log"
$errLog = "$root\logs\next.err.log"
$supervisorLog = "$root\logs\supervisor.log"

Set-Location $release
while ($true) {
  Add-Content $supervisorLog "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting KL_WEB standalone on 127.0.0.1:$Port"
  $env:PORT = "$Port"
  $env:HOSTNAME = "127.0.0.1"
  & $node "server.js" 1>>$outLog 2>>$errLog
  $code = $LASTEXITCODE
  Add-Content $supervisorLog "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] KL_WEB exited with code $code. Restarting in 5 seconds."
  Start-Sleep -Seconds 5
}
'@

Set-Content -Path $runner -Value $runnerContent -Encoding UTF8

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`" -Port $Port"
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null

if ($StartNow) {
  $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) {
    Write-Host "Port $Port is already listening on PID $($listener.OwningProcess); task registered but not started now." -ForegroundColor Yellow
  } else {
    Start-ScheduledTask -TaskName $taskName
  }
}

Write-Host "KL_WEB autostart task installed: $taskName" -ForegroundColor Green
Write-Host "It will start KL_WEB on 127.0.0.1:$Port after Lenovo reboots." -ForegroundColor Green