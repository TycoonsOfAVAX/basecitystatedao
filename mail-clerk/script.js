let day = 1;
let letters = [];
let timeLeft = 60;
let totalLetters = 5;
let currentLetters = 0;
let timerInterval;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 3;
let gameOver = false;

document.addEventListener('DOMContentLoaded', () => {
    startDay();
    document.getElementById('restart-button').addEventListener('click', restartGame);
});

function startDay() {
    gameOver = false;
    updateDayInfo();
    generateLetters();
    startTimer();
    displayLives();
}

function generateLetters() {
    letters = [];
    for (let i = 0; i < totalLetters; i++) {
        letters.push(Math.random() < 0.25 ? 'unsafe' : 'safe');
    }
    currentLetters = letters.length;
    displayLetters();
}

function displayLetters() {
    const mailArea = document.getElementById('mail-area');
    mailArea.innerHTML = '';
    letters.forEach((type, index) => {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.draggable = true;
        letter.dataset.type = type;
        letter.dataset.index = index;
        letter.addEventListener('dragstart', handleDragStart);
        mailArea.appendChild(letter);
    });
    setupDropZones();
}

function handleDragStart(event) {
    if (gameOver) return; // Prevent dragging if game is over
    event.dataTransfer.setData('text/plain', event.target.dataset.type);
    event.dataTransfer.setData('text/html', event.target.outerHTML);
    event.dataTransfer.setData('index', event.target.dataset.index);
}

function setupDropZones() {
    const scanner = document.getElementById('scanner');
    const safeBin = document.getElementById('safe-bin');
    const unsafeBin = document.getElementById('unsafe-bin');

    [scanner, safeBin, unsafeBin].forEach(zone => {
        zone.addEventListener('dragover', event => event.preventDefault());
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDrop(event) {
    if (gameOver) return; // Prevent dropping if game is over
    event.preventDefault();
    const letterType = event.dataTransfer.getData('text/plain');
    const letterElementHTML = event.dataTransfer.getData('text/html');
    const letterElement = new DOMParser().parseFromString(letterElementHTML, 'text/html').body.firstChild;
    const letterIndex = event.dataTransfer.getData('index');
    
    if (event.target.id === 'scanner') {
        alert(`Scanning... ${letterType === 'unsafe' ? 'Dangerous material detected!' : 'Safe.'}`);
    } else if (event.target.id === 'safe-bin' && letterType === 'safe') {
        processLetter(true, letterIndex);
    } else if (event.target.id === 'unsafe-bin' && letterType === 'unsafe') {
        processLetter(true, letterIndex);
    } else {
        processLetter(false, letterIndex);
    }
}

function processLetter(correct, letterIndex) {
    if (correct) {
        score++;
        updateScoreInfo();
    } else {
        if (letters[letterIndex] === 'unsafe') {
            lives--;
            displayLives();
            if (lives === 0) {
                endGame("Your last missed sorting has resulted in Mayor Jesse getting a glitter bomb from a grifter which exploded all over his desk. You no longer have a job at the post office. Have fun staying poor!");
                return;
            }
        } else {
            score -= 5;
            updateScoreInfo();
            if (score < 0) {
                lives--;
                score = 0; // Ensure score doesn't go below zero
                displayLives();
                if (lives === 0) {
                    endGame("Your last missed sorting has resulted in Mayor Jesse getting a glitter bomb from a grifter which exploded all over his desk. You no longer have a job at the post office. Have fun staying poor!");
                    return;
                }
            }
        }
    }
    currentLetters--;
    removeLetterElement(letterIndex);
    if (currentLetters === 0) {
        endDay();
    }
}

function removeLetterElement(letterIndex) {
    const mailArea = document.getElementById('mail-area');
    const letterElement = mailArea.querySelector(`.letter[data-index="${letterIndex}"]`);
    if (letterElement) {
        letterElement.remove();
    }
}

function startTimer() {
    timeLeft = 60 + (day - 1) * 15; // Add 15 seconds each day
    updateTime();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTime();
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            endGame("Because you work too slow, the post office decided to fire you. Have fun staying poor!");
        }
    }, 1000);
}

function updateTime() {
    document.getElementById('time').innerText = timeLeft;
}

function updateDayInfo() {
    document.getElementById('day').innerText = day;
}

function updateScoreInfo() {
    document.getElementById('score').innerText = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').innerText = highScore;
    }
}

function displayLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('div');
        life.className = 'life';
        livesContainer.appendChild(life);
    }
}

function endDay() {
    day++;
    totalLetters += 5;
    clearInterval(timerInterval);
    startDay();
}

function endGame(message) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('message').innerText = message;
    document.getElementById('popup').classList.remove('hidden');
}

function restartGame() {
    day = 1;
    totalLetters = 5;
    score = 0;
    lives = 3;
    gameOver = false;
    document.getElementById('popup').classList.add('hidden');
    updateScoreInfo();
    startDay();
}
