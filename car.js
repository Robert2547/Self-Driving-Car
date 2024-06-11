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

    this.sensor = new Sensor(this); // Create a new sensor object
    this.controls = new Controls();

  }

  update() {
    this.#move(); // Controls the car's movement
    this.sensor.update(); // Update the sensor
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

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore(); // Restore the canvas to the last save point

    this.sensor.draw(ctx); // Draw the sensor
  }
}
