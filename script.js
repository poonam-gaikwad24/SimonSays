
const colors = ["green", "red", "yellow", "blue"];

const gamePattern = [];
const userPattern = [];

let level = 0;
let started = false;
let acceptingInput = false;
let sequenceToken = 0;

let bestScore = Number(localStorage.getItem("simonBestScore")) || 0;

const levelTitle = document.getElementById("level-title");
const levelDisplay = document.getElementById("level");
const bestScoreDisplay = document.getElementById("best-score");
const message = document.getElementById("message");
const startButton = document.getElementById("start-btn");

bestScoreDisplay.textContent = bestScore;

function startGame() {
    sequenceToken++;

    gamePattern.length = 0;
    userPattern.length = 0;

    level = 0;
    started = true;
    acceptingInput = false;

    levelDisplay.textContent = level;
    levelTitle.textContent = "Watch the sequence!";
    message.textContent = "Remember the color pattern.";
    startButton.textContent = "Restart Game";

    nextLevel();
}

function nextLevel() {
    userPattern.length = 0;
    level++;
    levelDisplay.textContent = level;
    levelTitle.textContent = `Level ${level}`;

    acceptingInput = false;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gamePattern.push(randomColor);

    const token = sequenceToken;
    playSequence(token);
}

async function playSequence(token) {
    for (const color of gamePattern) {
        if (token !== sequenceToken) return;

        await delay(450);

        if (token !== sequenceToken) return;

        flashButton(color);
    }

    if (token !== sequenceToken) return;

    acceptingInput = true;
    message.textContent = "Your turn! Repeat the sequence.";
}

function flashButton(color) {
    const button = document.getElementById(color);

    button.classList.add("flash");

    setTimeout(() => {
        button.classList.remove("flash");
    }, 250);
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function checkAnswer(selectedColor) {
    if (!started || !acceptingInput) return;

    userPattern.push(selectedColor);

    const currentIndex = userPattern.length - 1;

    if (userPattern[currentIndex] !== gamePattern[currentIndex]) {
        gameOver();
        return;
    }

    flashButton(selectedColor);

    if (userPattern.length === gamePattern.length) {
        acceptingInput = false;
        message.textContent = "Correct! Get ready for the next level.";

        const token = sequenceToken;

        setTimeout(() => {
            if (token === sequenceToken && started) {
                nextLevel();
            }
        }, 800);
    }
}

function gameOver() {
    started = false;
    acceptingInput = false;
    sequenceToken++;

    levelTitle.textContent = "Game Over!";
    message.textContent = `You reached level ${level}. Try again!`;

    document.body.style.background = "#7f1d1d";

    setTimeout(() => {
        document.body.style.background =
            "linear-gradient(135deg, #141e30, #243b55)";
    }, 300);

    if (level > bestScore) {
        bestScore = level;
        localStorage.setItem("simonBestScore", bestScore);
        bestScoreDisplay.textContent = bestScore;
    }
}

colors.forEach(color => {
    document.getElementById(color).addEventListener("click", () => {
        checkAnswer(color);
    });
});

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", event => {
    if (!started && event.key !== "Tab") {
        startGame();
    }
});

