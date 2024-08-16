// See https://aka.ms/new-console-template for more information
using Microsoft.AspNetCore.SignalR.Client;

Console.WriteLine("Hello, World!");

HubConnection connection;
connection = new HubConnectionBuilder()
                .WithUrl("https://localhost:7243/hub")
                .Build();

connection.Closed += async (error) =>
{
    await Task.Delay(new Random().Next(0, 5) * 1000);
    await connection.StartAsync();
};

connection.On<int, int, int, int, int, int>("newAsteroid", (
                int width,
                int height,
                int verticalPos,
                int horizontalPos,
                int velocityX,
                int velocityY) =>
{
    Console.WriteLine($"Asteroid = W:{width}, H:{height}, VPos:{verticalPos}, HPos:{horizontalPos}, VX:{velocityX}, VY:{velocityY}");
});