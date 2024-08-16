
using System;
using AsteroidHub.Models;

namespace AsteroidHub.Services
{
    public class AsteroidGenerator(
        AsteroidHub hub) : IHostedService
    {
        private readonly Random _random = new Random();

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                var randFactor = _random.NextDouble();
                if (randFactor < 0.5d)
                {
                    await GenerateAsteroids(randFactor);
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        private async Task GenerateAsteroids(double randFactor)
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
                await hub.BroadcastNewAsteroid(asteroid);
            }
        }
    }
}
