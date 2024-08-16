using AsteroidHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace AsteroidHub
{
    public class AsteroidGameHub : Hub
    {
        public async Task BroadcastPlayer(
            Player player)
        {
            Console.WriteLine("playerMoved: ", player);

            await Clients.All.SendAsync(
                "playerMoved",
                player);
        }

        public async Task PlayerDead(
            Guid playerId) => 
                await Clients.All.SendAsync(
                    "playerDead",
                    playerId);
    }
}
