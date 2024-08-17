using AsteroidHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace AsteroidHub;
public class AsteroidGenerator(IHubContext<AsteroidGameHub> hub) : BackgroundService
{
    private readonly Random _rng = new();

    private static readonly TimeSpan Interval = TimeSpan.FromMilliseconds(500);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = Task.Delay(Interval, stoppingToken);
            var processing = GenerateAsteroid(stoppingToken);

            try
            {
                await Task.WhenAll(processing, delay);
            }
            catch (TaskCanceledException)
            {
            }
        }
    }

    private async Task GenerateAsteroid(CancellationToken stoppingToken)
    {
        var verticalPos = _rng.NextDouble() * 100;
        var horizontalPos = 150;
        var velocityx = _rng.NextDouble() * -1 - 1;
        var velocityy = _rng.NextDouble() - 0.5D;

        var asteroid = new Asteroid(
            verticalPos,
            horizontalPos,
            velocityx,
            velocityy,
            _rng.Next(0, 6));

        await hub.Clients.All.SendAsync("newAsteroid", asteroid, stoppingToken);
    }
}
