namespace AsteroidHub.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public int YPos { get; set; }
        public int VelocityY { get; set; }
        public int VelocityX { get; set; }
    }
}
