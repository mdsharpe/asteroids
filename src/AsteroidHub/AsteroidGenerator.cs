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
            var generateAsteroid = GenerateAsteroid(stoppingToken);
            var broadcastScores = BroadcastScores(stoppingToken);

            try
            {
                await Task.WhenAll(generateAsteroid, broadcastScores, delay);
            }
            catch (TaskCanceledException)
            {
            }
        }
    }


    private async Task GenerateAsteroid(CancellationToken stoppingToken)
    {
        var asteroid = new Asteroid(
            _rng.NextDouble() * 100,
            150,
            _rng.NextDouble() * -1 - 1,
            _rng.NextDouble() - 0.5D,
            _rng.Next(0, 6));

        await hub.Clients.All.SendAsync("newAsteroid", asteroid, stoppingToken);
    }

    private async Task BroadcastScores(CancellationToken stoppingToken)
    {
        var scores = Scoreboard.Scores.Select(o => o.Value).ToArray();
        await hub.Clients.All.SendAsync("scores", scores, stoppingToken);
    }
}
