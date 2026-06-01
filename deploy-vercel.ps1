$nodePath = 'C:\Program Files\nodejs'
$env:PATH = "$nodePath;" + $env:PATH
Write-Host "PATH=$env:PATH"
Write-Host "Node version: $(& "$nodePath\node.exe" --version)"
Write-Host "Npm version: $(& "$nodePath\npm.cmd" --version)"
Write-Host "Checking Vercel auth..."
& "$nodePath\npm.cmd" exec -- vercel whoami
Write-Host "Deploying to Vercel project 'balanzai'..."
& "$nodePath\npm.cmd" exec -- vercel --prod --name balanzai --confirm
