const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d"); // 2D rendering context
const networkCtx = networkCanvas.getContext("2d"); // 2D rendering context

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9); // Create a new road object with x=100, width=200
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); // Create a new car object with x=100, y=100, width=30, height=50
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];

animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // Update the traffic car's position
  }

  car.update(road.borders, traffic); // Update the car's position

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7); // Translate the canvas to the car's position

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green");
  }
  car.draw(carCtx, "blue");

  carCtx.restore();

  try {
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, car.brain);
  } catch (error) {
    console.error(error);
  }
  requestAnimationFrame(animate); // Call the animate function 60 times per second, give the illusion of movement
}
