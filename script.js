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

const difficultyModes = {
  easy: { duration: 30, spawnInterval: 1200, fallDuration: 5, targetScore: 15 },
  normal: { duration: 30, spawnInterval: 1000, fallDuration: 4, targetScore: 20 },
  hard: { duration: 20, spawnInterval: 700, fallDuration: 3, targetScore: 25 }
};

const difficultySelect = document.getElementById('difficulty');
let activeDifficulty = difficultyModes[difficultySelect.value];

function updateDifficultyPreview() {
  activeDifficulty = difficultyModes[difficultySelect.value];
  displayedTimer.textContent = activeDifficulty.duration;
  tagline.textContent = `Catch ${activeDifficulty.targetScore} drops in ${activeDifficulty.duration} seconds on ${difficultySelect.options[difficultySelect.selectedIndex].text} mode.`;
}

difficultySelect.addEventListener('change', updateDifficultyPreview);
updateDifficultyPreview();

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  difficultySelect.disabled = true;
  activeDifficulty = difficultyModes[difficultySelect.value];
  gameScreen.querySelectorAll('.water-drop').forEach(drop => drop.remove());

  // Create drops using the pace configured for the selected difficulty
  dropMaker = setInterval(createDrop, activeDifficulty.spawnInterval);

  // Reset the game state before starting a new game
  score = 0;
  displayedScore.textContent = score;
  displayedTimer.textContent = activeDifficulty.duration;
  tagline.textContent = `Catch ${activeDifficulty.targetScore} drops before time runs out!`;

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

  // Make drops fall faster at higher difficulties
  drop.style.animationDuration = `${activeDifficulty.fallDuration}s`;

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

  if (score >= activeDifficulty.targetScore){
    tagline.textContent = `${winning_messages[randomString]} Target: ${activeDifficulty.targetScore}.`;
  } else {
    tagline.textContent = `${losing_messages[randomString]} You needed ${activeDifficulty.targetScore} drops.`;
  }

  gameScreen.querySelectorAll('.water-drop').forEach(drop => drop.remove());
  gameRunning = false;
  difficultySelect.disabled = false;
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

