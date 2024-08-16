using AsteroidHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace AsteroidHub.Services
{
    public class AsteroidGenerator(IHubContext<AsteroidGameHub> hub) : BackgroundService
    {
        private readonly Random _random = new Random();

        private static readonly TimeSpan Interval = TimeSpan.FromMilliseconds(2000);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var randFactor = _random.NextDouble();

                var delay = Task.Delay(Interval, stoppingToken);
                var processing = GenerateAsteroids(randFactor, stoppingToken);

                try
                {
                    await Task.WhenAll(processing, delay);
                }
                catch (TaskCanceledException)
                {
                }
            }
        }

        private async Task GenerateAsteroids(double randFactor, CancellationToken stoppingToken)
        {
            var asteroids = new List<Asteroid>();
            for (int i = 1; i <= 3; i++)
            {
                var width = randFactor * 10;
                var height = randFactor * 10;
                var verticalPos = i * randFactor * 100;
                var horizontalPos = 110;
                var velocityx = _random.Next(1, 10);
                var velocityy = _random.Next(1, 10);

                asteroids.Add(
                    new Asteroid(
                        (int)width,
                        (int)height,
                        (int)verticalPos,
                        horizontalPos,
                        velocityx,
                        velocityy));
            }

            foreach (var asteroid in asteroids)
            {
                await hub.Clients.All.SendAsync("newAsteroid", asteroid.Width, asteroid.Height, asteroid.VerticalPos, asteroid.HorizontalPos, asteroid.VelocityX, asteroid.VelocityY, stoppingToken);
                Console.WriteLine($"Asteroid = W:{asteroid.Width}, H:{asteroid.Height}, VPos:{asteroid.VerticalPos}, HPos:{asteroid.HorizontalPos}, VX:{asteroid.VelocityX}, VY:{asteroid.VelocityY}");
            }
        }
    }
}
