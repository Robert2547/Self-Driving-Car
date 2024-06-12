const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d"); // 2D rendering context
const networkCtx = networkCanvas.getContext("2d"); // 2D rendering context

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9); // Create a new road object with x=100, width=200

const N = 100; // Number of cars
const cars = generateCars(N); // Generate 10 cars
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    // Load the best brain into all cars
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1); // Mutate the brain of all cars except the first one (the best one)
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // Update the traffic car's position
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic); // Update the car's position
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y))); // Find the car with the lowest y value (highest position)

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // Translate the canvas to the car's position

  road.draw(carCtx); // Draw the road
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green");
  }

  carCtx.globalAlpha = 0.2; // Set the transparency of the car to 0.2

  // Draw the car
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "red", true);

  carCtx.restore();

  try {
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
  } catch (error) {
    console.error(error);
  }
  requestAnimationFrame(animate); // Call the animate function 60 times per second, give the illusion of movement
}
