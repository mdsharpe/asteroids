Push-Location ./src/AsteroidHub

try {
    dotnet watch run
} finally {
    Pop-Location
}
