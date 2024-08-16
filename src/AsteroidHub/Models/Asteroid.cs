namespace AsteroidHub.Models
{
    public class Asteroid(
        int verticalPos, 
        int horizontalPos, 
        int velocityx, 
        int velocityy)
    {
        /// <summary>
        /// Starting y-axis position.
        /// </summary>
        public int VerticalPos { get; set; } = verticalPos;

        /// <summary>
        /// Starting x-axis position.
        /// </summary>
        public int HorizontalPos { get; set; } = horizontalPos;

        /// <summary>
        /// Y-Axis velocity of asteroid.
        /// </summary>
        public decimal VelocityX { get; set; } = velocityx;

        /// <summary>
        /// X-Axis velocity of asteroid.
        /// </summary>
        public decimal VelocityY { get; set; } = velocityy;
    }
}
