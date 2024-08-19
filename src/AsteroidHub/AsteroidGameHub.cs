using AsteroidHub.Models;
using Microsoft.AspNetCore.SignalR;

namespace AsteroidHub;
public class AsteroidGameHub : Hub
{
    public async Task BroadcastPlayer(Player player)
        => await Clients.All.SendAsync("playerMoved", player);

    public async Task BroadcastPlayerDead(PlayerId playerId)
        => await Clients.All.SendAsync("playerDead", playerId.Id);
}
