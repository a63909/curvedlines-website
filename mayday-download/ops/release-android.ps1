[CmdletBinding(DefaultParameterSetName = 'ExistingApk')]
param(
    [Parameter(Mandatory)][ValidateRange(1, 2147483647)][int] $ReleaseNumber,
    [Parameter(Mandatory, ParameterSetName = 'ExistingApk')][string] $Apk,
    [Parameter(Mandatory, ParameterSetName = 'Build')][ValidateRange(1, 2147483647)][int] $VersionCode,
    [string] $BuildTools = 'D:/Android_SDK/build-tools/35.0.0',
    [string] $SshTarget = 'root@153.76.172.25',
    [string] $SshKey
)

$ErrorActionPreference = 'Stop'
$showcase = Split-Path $PSScriptRoot -Parent
$repo = (Resolve-Path (Join-Path $showcase '../..')).Path

if ($PSCmdlet.ParameterSetName -eq 'Build') {
    $walletProfile = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'android-release.properties') | ConvertFrom-StringData
    $walletHeight = $walletProfile['colorchain.walletActivationHeight1']
    $walletNodes = $walletProfile['colorchain.lightWalletNodes']
    $expectedRoster = '^wss://[^|;]+\|[a-f0-9]{182}(?:;wss://[^|;]+\|[a-f0-9]{182}){1,4}$'
    if ($walletHeight -notmatch '^[1-9][0-9]*$' -or $walletNodes -notmatch $expectedRoster) {
        throw 'Профиль рабочего кошелька для публичной сборки отсутствует или повреждён.'
    }
    $java = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin/java.exe' } else { (Get-Command java.exe).Source }
    Push-Location $repo
    try {
        # Pass the wallet roster as one argument through Java. The batch wrapper treats pipes as operators.
        & $java -cp 'gradle/wrapper/gradle-wrapper.jar' org.gradle.wrapper.GradleWrapperMain ':app:assembleStdRelease' `
            "-Pcolorchain.versionCode=$VersionCode" "-Pcolorchain.walletActivationHeight1=$walletHeight" "-Pcolorchain.lightWalletNodes=$walletNodes"
        if ($LASTEXITCODE -ne 0) { throw 'Сборка публичного STD не удалась.' }
    } finally {
        Pop-Location
    }
    $Apk = Join-Path $repo 'app/build/outputs/apk/std/release/app-std-release.apk'
}

$file = Get-Item -LiteralPath $Apk
$badging = & (Join-Path $BuildTools 'aapt.exe') dump badging $file.FullName
if ($LASTEXITCODE -ne 0) { throw 'Не удалось прочитать сведения APK.' }
$package = $badging | Where-Object { $_ -like 'package: *' } | Select-Object -First 1
if ($package -notmatch "^package: name='com\.example\.tamarashadow\.std' versionCode='[1-9][0-9]*' versionName='([0-9]+(?:\.[0-9]+)*)'" -or
    ($badging | Where-Object { $_ -eq 'application-debuggable' })) {
    throw 'Для сайта подходит только публичная сборка STD.'
}
$version = $Matches[1]
$signature = & (Join-Path $BuildTools 'apksigner.bat') verify --print-certs $file.FullName
$expectedCert = 'aab2be8006944ca511692445d79ada56f5c734452004916aef6fdf9e2282c11c'
$signers = @($signature | Where-Object { $_ -match '^Signer #[0-9]+ certificate SHA-256 digest: ' })
if ($LASTEXITCODE -ne 0 -or $signers.Count -ne 1 -or $signers[0] -ne "Signer #1 certificate SHA-256 digest: $expectedCert") {
    throw 'Подпись APK отличается от подписи действующей версии Mayday.'
}
$digest = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()

$ssh = [System.Diagnostics.ProcessStartInfo]::new((Get-Command ssh.exe).Source)
$ssh.UseShellExecute = $false
$ssh.RedirectStandardInput = $true
$ssh.RedirectStandardOutput = $true
$ssh.RedirectStandardError = $true
$arguments = @('-T', '-o', 'BatchMode=yes')
if ($SshKey) { $arguments += @('-o', 'IdentitiesOnly=yes', '-i', (Resolve-Path -LiteralPath $SshKey).Path) }
$arguments += @('--', $SshTarget, '/usr/local/sbin/mayday-publish-website-apk',
                '--publish', $ReleaseNumber, $version, $file.Length, $digest)
foreach ($argument in $arguments) { $ssh.ArgumentList.Add([string] $argument) }

$apkStream = $file.OpenRead()
try {
    $process = [System.Diagnostics.Process]::Start($ssh)
    try {
        $result = $process.StandardOutput.ReadToEndAsync()
        $diagnostic = $process.StandardError.ReadToEndAsync()
        try {
            $apkStream.CopyTo($process.StandardInput.BaseStream)
        } catch [System.Management.Automation.MethodInvocationException] {
            if ($_.Exception.InnerException -isnot [System.IO.IOException]) { throw }
        } finally {
            $process.StandardInput.Close()
        }
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) { throw "Сайт не принял APK. $($diagnostic.Result.Trim())" }
        $reply = $result.Result.Trim()
        $published = ConvertFrom-Json -InputObject $reply
        if ($published.sha256 -ne $digest -or $published.filename -ne "mayday-$ReleaseNumber.apk") {
            throw 'Подтверждение сайта не совпало с отправленным APK.'
        }
    } finally {
        $process.Dispose()
    }
} finally {
    $apkStream.Dispose()
}

$releaseFile = Join-Path $showcase 'dist/release.mjs'
$source = Get-Content -Raw -LiteralPath $releaseFile
$source = $source -replace '(?m)^export const androidRelease = .*;$', "export const androidRelease = $reply;"
[System.IO.File]::WriteAllText($releaseFile, $source)
& node (Join-Path $showcase 'build.mjs')
if ($LASTEXITCODE -ne 0) { throw 'APK опубликован, но локальная витрина не пересобралась.' }
Write-Output "Готово. https://mayday.colorchain.ru/releases/mayday.apk (mayday-$ReleaseNumber.apk)"
