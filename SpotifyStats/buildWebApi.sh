rm -r site site.zip spotify-stats-deploy.zip
dotnet publish -o site
zip -j site.zip site/*
zip spotify-stats-deploy.zip site.zip aws-windows-deployment-manifest.json
zip -ur spotify-stats-deploy.zip .ebextensions