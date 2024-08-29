using System.Collections.Concurrent;
using AsteroidHub.Models;

namespace AsteroidHub;
internal static class Scoreboard
{
    public static readonly ConcurrentDictionary<Guid, PlayerScore> Scores = new();
}
