const canvas = document.getElementById("myCanvas");

// Set the canvas size to be like a road
canvas.width = 200;

const ctx = canvas.getContext("2d"); // 2D rendering context
const road = new Road(canvas.width / 2, canvas.width * 0.9); // Create a new road object with x=100, width=200
const car = new Car(road.getLaneCenter(1), 100, 30, 50); // Create a new car object with x=100, y=100, width=30, height=50
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7); // Translate the canvas to the car's position

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate); // Call the animate function 60 times per second, give the illusion of movement
}
