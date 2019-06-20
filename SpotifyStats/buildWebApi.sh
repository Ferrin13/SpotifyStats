dotnet publish -o site
zip site.zip site/*
zip spotify-stats.zip site.zip aws-windows-deployment-manifest.json