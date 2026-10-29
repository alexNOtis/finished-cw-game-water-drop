// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

// Variables for the game elements in the DOM
const tagline = document.querySelector('.game-tagline');
const gameScreen = document.getElementById('game-container');
const displayedTimer = document.getElementById('time');
const displayedScore = document.getElementById('score');

// Global variables for game messages and score
let winning_messages = ["Congrats! You got a great score!", "WOW! Look at that score! Great job.", "Amazing score! Good work!"];
let losing_messages = ["Ooof, try again!", "Try again...", "Don't give up now! Try again!"];
let score = 0;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Reset the game state before starting a new game
  score = 0;
  displayedScore.textContent = score;
  displayedTimer.textContent = 30; // Reset the timer to 30 seconds

// Loop for the timer, and controls when timer is "up" (game over)
  let timerLoop = setInterval(() => {
    displayedTimer.textContent = displayedTimer.textContent - 1;

    if (displayedTimer.textContent == 0){
      clearInterval(timerLoop);
      clearInterval(dropMaker);
      ended_game();
    }

  }, 1000);



}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

// Function to handle the end of the game, including messages that are randomized
function ended_game(){
  const randomString = Math.floor(Math.random() * winning_messages.length);

  if (score >= 20){
    tagline.textContent = winning_messages[randomString];
  } else {
    tagline.textContent = losing_messages[randomString];
  }

  gameRunning = false;
}

// Function to update the score when a water drop is clicked
function update_score(){
    score += 1;
    displayedScore.textContent = score;
}

// Background click event for the game screen
  gameScreen.addEventListener('click', function(event) {
    if (event.target.classList.contains('water-drop')) {
      event.target.remove();

      update_score();
  }
});

