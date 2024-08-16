namespace AsteroidHub.Models
{
    public class Asteroid(
        int width,
        int height,
        int verticalPos, 
        int horizontalPos, 
        int velocityx, 
        int velocityy)
    {
        /// <summary>
        /// Asteroid width.
        /// </summary>
        public int Width { get; set; } = width;

        /// <summary>
        /// Asteroid Height.
        /// </summary>
        public int Height { get; set; } = height;

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
