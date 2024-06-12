class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.accleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    this.sensor = new Sensor(this); // Create a new sensor object
    this.controls = new Controls();
  }

  update(roadBoarders) {
    if (this.damaged) return; // If the car is damaged, stop updating it
    this.#move(); // Controls the car's movement
    this.polygon = this.#createPolygon(); // Create the car's polygon
    this.damaged = this.#assessDamage(roadBoarders); // Assess the damage
    this.sensor.update(roadBoarders); // Update the sensor
  }

  #move() {
    // Controls forward and reverse
    if (this.controls.forward) this.speed += this.accleration;
    if (this.controls.reverse) this.speed -= this.accleration;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed; // Max speed
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2; // Reverse speed

    if (this.speed > 0) this.speed -= this.friction; // Friction
    if (this.speed < 0) this.speed += this.friction; // Friction

    if (Math.abs(this.speed) < this.friction) this.speed = 0; // Stop the car if the speed is less than the friction

    // Controls left and right
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += 0.03 * flip;
      if (this.controls.right) this.angle -= 0.03 * flip;
    }

    // Update the car's position (left or right rotation)
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2; // Hypotenuse of the car's width and height
    const alpha = Math.atan(this.width / this.height); // Angle of the car's front
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #assessDamage(roadBoarders) {
    for (let i = 0; i < roadBoarders.length; i++) {
      if (polysIntersect(this.polygon, roadBoarders[i])) return true; // If the car intersects with the road, return true
    }

    return false;
  }

  draw(ctx) {
    try {
      if (this.damaged) ctx.fillStyle = "red"; // If the car is damaged, fill it with red
      ctx.beginPath();
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y); // Move to the first point of the polygon
      for (let i = 1; i < this.polygon.length; i++) {
        ctx.lineTo(this.polygon[i].x, this.polygon[i].y); // Draw a line to the next point
      }
      ctx.fill(); // Fill the polygon
      this.sensor.draw(ctx); // Draw the sensor
    } catch (error) {
      console.error(error);
    }
  }
}
