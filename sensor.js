class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5; // Number of rays
    this.rayLength = 250; // Length of each ray
    this.raySpread = Math.PI / 4; // Angle between each ray (45 degrees)

    this.rays = []; // Array to store the rays
    this.readings = []; // Array to tell the car how far away the walls are
  }

  update(roadBoarders) {
    this.#castRays(); // Cast the rays
    this.readings = []; // Reset the readings array
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBoarders));
    }
  }

  #getReading(ray, roadBoarders) {
    let touches = [];

    for (let i = 0; i < roadBoarders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBoarders[i][0],
        roadBoarders[i][1]
      ); // Get the intersection point of the ray
      if (touch) touches.push(touch); // Add the intersection point to the touches array
    }

    if (touches.length == 0) return null; // If there are no intersections, return the ray length

    const offsets = touches.map((e) => e.offsets); // Get the offsets of the touches, which is the distance from the start of the ray to the intersection point
    const minOffset = Math.min(...offsets); // Get the minimum offset
    return touches.find((e) => e.offsets == minOffset); // Return the touch with the minimum offset
  }

  #castRays() {
    this.rays = []; // Reset the rays array
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle; // Calculate the angle of the ray

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
      try {
        let end = this.rays[i][1];
        if (this.readings[i]) end = this.readings[i]; // If there is an intersection, draw the ray to the intersection point

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); // Move to the start of the ray
        ctx.lineTo(end.x, end.y); // Draw the ray
        ctx.stroke();
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
}
