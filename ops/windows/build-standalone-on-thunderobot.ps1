param(
  [string]$RepoRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (!$npm) {
  throw "npm.cmd was not found on Thunderobot."
}

function Assert-ExitCode {
  param([string]$Step)
  if ($LASTEXITCODE -ne 0) {
    throw "$Step failed with exit code $LASTEXITCODE"
  }
}

Set-Location $RepoRoot

$nodeModules = Join-Path $RepoRoot "node_modules"
$marker = Join-Path $nodeModules ".kl-web-deps.sha256"
$packageHash = (Get-FileHash (Join-Path $RepoRoot "package.json") -Algorithm SHA256).Hash
$lockHash = (Get-FileHash (Join-Path $RepoRoot "package-lock.json") -Algorithm SHA256).Hash
$currentHash = "$packageHash-$lockHash"
$installedHash = if (Test-Path $marker) { (Get-Content $marker -Raw).Trim() } else { "" }

Write-Host "[1/5] Dependencies..." -ForegroundColor Cyan
if (!(Test-Path $nodeModules) -or $installedHash -ne $currentHash) {
  & $npm.Source ci --no-audit --no-fund
  Assert-ExitCode "npm ci"
  Set-Content -Path $marker -Value $currentHash -NoNewline
} else {
  Write-Host "Dependencies are current; skipping npm ci." -ForegroundColor DarkGray
}

Write-Host "[2/5] Lint..." -ForegroundColor Cyan
& $npm.Source run lint
Assert-ExitCode "npm run lint"

Write-Host "[3/5] Build standalone on Thunderobot..." -ForegroundColor Cyan
& $npm.Source run build
Assert-ExitCode "npm run build"

$standalone = Join-Path $RepoRoot ".next\standalone"
if (!(Test-Path (Join-Path $standalone "server.js"))) {
  throw "Standalone server.js was not produced: $standalone"
}

Write-Host "[4/5] Add public and static assets..." -ForegroundColor Cyan
$standalonePublic = Join-Path $standalone "public"
if (Test-Path $standalonePublic) {
  Remove-Item $standalonePublic -Recurse -Force
}
Copy-Item (Join-Path $RepoRoot "public") $standalonePublic -Recurse -Force

$standaloneStatic = Join-Path $standalone ".next\static"
New-Item -ItemType Directory -Force -Path $standaloneStatic | Out-Null
Copy-Item (Join-Path $RepoRoot ".next\static\*") $standaloneStatic -Recurse -Force

Write-Host "[5/5] Pack release..." -ForegroundColor Cyan
$archive = Join-Path $RepoRoot "kl-web-standalone-release.zip"
if (Test-Path $archive) {
  Remove-Item $archive -Force
}
Compress-Archive -Path (Join-Path $standalone "*") -DestinationPath $archive -CompressionLevel Optimal

Write-Host "KL_WEB release ready: $archive" -ForegroundColor Green
