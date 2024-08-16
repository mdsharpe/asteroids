using AsteroidHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace AsteroidHub
{
    public class AsteroidGameHub : Hub
    {
        //public async Task BroadcastNewAsteroid(
        //    Asteroid asteroid) =>
        //    await Clients.All.SendAsync(
        //        "newAsteroid", 
        //        asteroid.Width, 
        //        asteroid.Height, 
        //        asteroid.VerticalPos, 
        //        asteroid.HorizontalPos, 
        //        asteroid.VelocityX, 
        //        asteroid.VelocityY);

        public async Task BroadcastPlayer(
            Player player) =>
                await Clients.All.SendAsync(
                    "playerMoved",
                    player);
    }
}
