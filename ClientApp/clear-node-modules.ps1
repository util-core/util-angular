try{
    rimraf 2>$null
}
catch{
    Write-Host "install rimraf..."
    npm install -g rimraf 
}
Write-Host "remove node_modules..."
rimraf node_modules
Write-Host "remove completed."