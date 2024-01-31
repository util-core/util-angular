Write-Host "install npm..."
yarn

Write-Host "ng build..."
ng build util-angular

Write-Host "npm start..."
npm start