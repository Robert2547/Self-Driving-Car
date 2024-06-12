function showPopup() {
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";
  overlay.style.display = "none";
}

function checkCarPosition() {
  if (bestCar.y <= -1700) {
    cancelAnimationFrame(animationId); // Stop the animation loop
    showPopup();
  }
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function resetGame() {
  // Logic to reset the game
  location.reload();
}
