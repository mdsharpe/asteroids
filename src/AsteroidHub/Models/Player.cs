namespace AsteroidHub.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public decimal YPos { get; set; }
        public decimal? VelocityY { get; set; }
        public decimal? VelocityX { get; set; }
    }
}
