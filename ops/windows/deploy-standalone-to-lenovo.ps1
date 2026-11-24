param(
  [Parameter(Mandatory = $true)]
  [string]$ServerHost,

  [Parameter(Mandatory = $true)]
  [int]$ServerPort,

  [string]$ServerUser = "LenovoC440",
  [string]$RepoRoot = "",
  [string]$IdentityFile = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

$ssh = Get-Command ssh.exe -ErrorAction SilentlyContinue
$scp = Get-Command scp.exe -ErrorAction SilentlyContinue
if (!$ssh -or !$scp) {
  throw "OpenSSH client (ssh.exe/scp.exe) is required on Thunderobot."
}

& (Join-Path $PSScriptRoot "build-standalone-on-thunderobot.ps1") -RepoRoot $RepoRoot

$archive = Join-Path $RepoRoot "kl-web-standalone-release.zip"
$activator = Join-Path $PSScriptRoot "activate-standalone-release.ps1"
$target = "$ServerUser@$ServerHost"

$common = @()
if (![string]::IsNullOrWhiteSpace($IdentityFile)) {
  $common += @("-i", $IdentityFile)
}

Write-Host "Uploading KL_WEB release to Lenovo..." -ForegroundColor Cyan
& $scp.Source @common $archive ($target + ":kl-web-standalone-release.zip")
if ($LASTEXITCODE -ne 0) {
  throw "SCP release upload failed with exit code $LASTEXITCODE"
}

& $scp.Source @common $activator ($target + ":kl-web-activate.ps1")
if ($LASTEXITCODE -ne 0) {
  throw "SCP activator upload failed with exit code $LASTEXITCODE"
}

Write-Host "Activating KL_WEB on Lenovo..." -ForegroundColor Cyan
$remoteCommand = 'powershell -NoProfile -ExecutionPolicy Bypass -File "%USERPROFILE%\kl-web-activate.ps1" -Port ' + $ServerPort
& $ssh.Source @common $target $remoteCommand
if ($LASTEXITCODE -ne 0) {
  throw "Remote activation failed with exit code $LASTEXITCODE"
}

Write-Host "KL_WEB deploy complete. Build ran on Thunderobot; Lenovo only unpacked and started the release." -ForegroundColor Green
