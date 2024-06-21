let score = 0;
let round = 1;
let lives = 3;
let time = 60;
let timerInterval;
let passportCount = 10;
let unsafePassports = [];
const unsafePercentage = 0.25;
const messages = [
    "The last dangerous person you allowed into the city turned out to be a jeeter where he dumped glitter all over Mayor Jesse. You no longer have a job at border control. Have fun staying poor!",
    "The last dangerous person you allowed into the city turned out to be a grifter. Many people got scammed and Decentralized Intelligence Agency traced it back to you. You no longer have a job at border control. Have fun staying poor!",
    "The last dangerous person you allowed into the city turned out to be a FIAT radical preacher. He did a firebrand message at the public square about how FIAT is superior and pursuaded many to start a coup against crypto. You no longer have a job at border control. Have fun staying poor!"
];

const passports = ["assets/images/game/passport1.png", "assets/images/game/passport2.png", "assets/images/game/passport3.png"];

function startGame() {
    document.getElementById('game-rules').classList.add('hidden');
    setupRound();
    startTimer();
}

function setupRound() {
    document.getElementById('round').textContent = round;
    const passportContainer = document.getElementById('passport-container');
    passportContainer.innerHTML = '';
    passportCount = round * 10;
    unsafePassports = generateUnsafePassports(passportCount, unsafePercentage);

    for (let i = 0; i < passportCount; i++) {
        const passport = document.createElement('img');
        passport.src = passports[Math.floor(Math.random() * passports.length)];
        passport.className = 'passport';
        passport.draggable = true;
        passport.id = i;
        passport.addEventListener('dragstart', dragStart);
        passportContainer.appendChild(passport);
    }

    setupBins();
}

function generateUnsafePassports(count, percentage) {
    const unsafeCount = Math.floor(count * percentage);
    const unsafeIndexes = [];
    while (unsafeIndexes.length < unsafeCount) {
        const index = Math.floor(Math.random() * count);
        if (!unsafeIndexes.includes(index)) {
            unsafeIndexes.push(index);
        }
    }
    return unsafeIndexes;
}

function setupBins() {
    const safeBin = document.getElementById('safe-bin');
    const denyBin = document.getElementById('deny-bin');
    const scanner = document.getElementById('scanner');

    safeBin.addEventListener('dragover', allowDrop);
    safeBin.addEventListener('drop', dropSafe);

    denyBin.addEventListener('dragover', allowDrop);
    denyBin.addEventListener('drop', dropDeny);

    scanner.addEventListener('dragover', allowDrop);
    scanner.addEventListener('drop', dropScanner);
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dropSafe(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const passport = document.getElementById(id);

    if (unsafePassports.includes(parseInt(id))) {
        lives--;
        updateLives();
        if (lives === 0) {
            gameOver("lives");
        }
    } else {
        score++;
        document.getElementById('score').textContent = score;
    }

    passport.remove();
    checkRoundCompletion();
}

function dropDeny(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const passport = document.getElementById(id);

    if (unsafePassports.includes(parseInt(id))) {
        score++;
        document.getElementById('score').textContent = score;
    } else {
        score = Math.max(0, score - 5);
        document.getElementById('score').textContent = score;

        if (score < 5) {
            lives--;
            updateLives();
            if (lives === 0) {
                gameOver("lives");
            }
        }
    }

    passport.remove();
    checkRoundCompletion();
}

function dropScanner(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const passport = document.getElementById(id);
    
    const isUnsafe = unsafePassports.includes(parseInt(id));
    const message = document.createElement('div');
    message.className = 'scanner-message';
    message.textContent = isUnsafe ? ' - DO NOT ADMIT' : ' - SAFE';
    document.getElementById('scanner').appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 1000);
}

function checkRoundCompletion() {
    if (document.getElementById('passport-container').children.length === 0) {
        nextRound();
    }
}

function nextRound() {
    round++;
    time += 30;
    document.getElementById('timer').textContent = time;
    setupRound();
}

function startTimer() {
    timerInterval = setInterval(() => {
        time--;
        document.getElementById('timer').textContent = time;
        if (time === 0) {
            gameOver("time");
        }
    }, 1000);
}

function updateLives() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`life${i}`).style.visibility = i <= lives ? 'visible' : 'hidden';
    }
}

function gameOver(reason) {
    clearInterval(timerInterval);
    const overlay = document.getElementById('game-over');
    const message = document.getElementById('game-over-message');
    overlay.classList.remove('hidden');

    if (reason === "time") {
        message.textContent = "Because you work too slow, the Bureau of Immigration has decided to fire you. Have fun staying poor!";
    } else {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        message.textContent = randomMessage;
    }
}

function restartGame() {
    score = 0;
    round = 1;
    lives = 3;
    time = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = time;
    updateLives();
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('game-rules').classList.remove('hidden');
}

document.getElementById('game-rules').classList.remove('hidden');
