class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 3; // Number of rays
    this.rayLength = 100; // Length of each ray
    this.raySpread = Math.PI / 4; // Angle between each ray (45 degrees)

    this.rays = []; // Array to store the rays
  }

  update() {
    this.rays = []; // Reset the rays array
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        i / (this.rayCount - 1)
      ); // Calculate the angle of the ray

      const start = { x: this.car.x, y: this.car.y }; // Start the ray at the car's position
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }; // Calculate the end of the ray

      this.rays.push([start, end]); // Add the ray to the array, to form a line segment
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); // Move to the start of the ray
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y); // Draw the ray
      ctx.stroke();
    }
  }
}