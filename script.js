const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const shipWidth = 10;  // Nave menor
const shipHeight = 10;
const asteroidSize = 5; // Asteroides bem pequenos
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let shipX = canvasWidth / 2 - shipWidth / 2;
let shipY = canvasHeight - shipHeight - 10;
let shipSpeed = 5;

let asteroids = [];
let score = 0;
let maxScore = localStorage.getItem('maxScore') ? parseInt(localStorage.getItem('maxScore')) : 0; // Recupera a pontuação máxima salva
let gameOver = false;
let gameTime = 0;

// Controle de movimento da nave
let shipVelocityX = 0;
let shipVelocityY = 0;
const maxSpeed = 5;

document.addEventListener('keydown', moveShip);
document.addEventListener('keyup', stopShip);

function moveShip(event) {
    if (event.keyCode == 37) { // Esquerda
        shipVelocityX = -shipSpeed;
    } else if (event.keyCode == 39) { // Direita
        shipVelocityX = shipSpeed;
    } else if (event.keyCode == 38) { // Cima
        shipVelocityY = -shipSpeed;
    } else if (event.keyCode == 40) { // Baixo
        shipVelocityY = shipSpeed;
    }
}

function stopShip(event) {
    if (event.keyCode == 37 || event.keyCode == 39) {
        shipVelocityX = 0;
    }
    if (event.keyCode == 38 || event.keyCode == 40) {
        shipVelocityY = 0;
    }
}

// Função para criar os asteroides com posições aleatórias
function createAsteroid() {
    const randomPosition = Math.floor(Math.random() * 4); // 4 posições possíveis

    let x, y, speed;

    switch (randomPosition) {
        case 0: // Posição superior
            x = Math.floor(Math.random() * canvasWidth);
            y = -asteroidSize; // Fora da tela no topo
            break;
        case 1: // Posição inferior
            x = Math.floor(Math.random() * canvasWidth);
            y = canvasHeight; // Fora da tela no fundo
            break;
        case 2: // Posição direita
            x = canvasWidth;
            y = Math.floor(Math.random() * canvasHeight);
            break;
        case 3: // Posição esquerda
            x = -asteroidSize; // Fora da tela na esquerda
            y = Math.floor(Math.random() * canvasHeight);
            break;
    }

    speed = Math.random() * 2 + 1; // Velocidade aleatória entre 1 e 3

    asteroids.push({ x: x, y: y, size: asteroidSize, speed: speed, direction: randomPosition });
}

// Função para desenhar a nave
function drawShip() {
    ctx.fillStyle = "blue";
    ctx.fillRect(shipX, shipY, shipWidth, shipHeight);
}

// Função para desenhar os asteroides
function drawAsteroids() {
    ctx.fillStyle = "gray";
    for (let i = 0; i < asteroids.length; i++) {
        ctx.fillRect(asteroids[i].x, asteroids[i].y, asteroids[i].size, asteroids[i].size);

        // Atualiza a posição dos asteroides com base na direção
        switch (asteroids[i].direction) {
            case 0: // Para os asteroides vindos de cima
                asteroids[i].y += asteroids[i].speed;
                break;
            case 1: // Para os asteroides vindos de baixo
                asteroids[i].y -= asteroids[i].speed;
                break;
            case 2: // Para os asteroides vindos da direita
                asteroids[i].x -= asteroids[i].speed;
                break;
            case 3: // Para os asteroides vindos da esquerda
                asteroids[i].x += asteroids[i].speed;
                break;
        }

        // Verifica colisões com a nave
        if (asteroids[i].y + asteroids[i].size > shipY &&
            asteroids[i].y < shipY + shipHeight &&
            asteroids[i].x + asteroids[i].size > shipX &&
            asteroids[i].x < shipX + shipWidth) {
                gameOver = true;
        }

        // Remove asteroides que saem da tela
        if (asteroids[i].x < 0 || asteroids[i].x > canvasWidth || asteroids[i].y < 0 || asteroids[i].y > canvasHeight) {
            asteroids.splice(i, 1);
            score++;
        }
    }
}

// Função para exibir o "Game Over" e pontuação
function displayGameOver() {
    document.getElementById('gameOver').style.display = "block";  // Exibe o Game Over
    document.getElementById('score').style.display = "none";      // Oculta a pontuação
    document.getElementById('timer').style.display = "none";      // Oculta o timer
    document.getElementById('maxScore').style.display = "block";  // Exibe a pontuação máxima
    document.getElementById('restartButton').style.display = "block"; // Exibe o botão de reinício
}

// Função para atualizar o cronômetro
function updateTimer() {
    gameTime++;
    document.getElementById('timer').innerText = "Tempo: " + gameTime + "s";
}

// Função para atualizar a pontuação máxima
function updateMaxScore() {
    if (score > maxScore) {
        maxScore = score;
        document.getElementById('maxScore').innerText = "Pontuação Máxima: " + score;
        localStorage.setItem('maxScore', maxScore); // Salva a nova pontuação máxima no localStorage
    }
}

// Função principal do jogo
function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return;
    }
    

    // Atualiza a posição da nave
    shipX += shipVelocityX;
    shipY += shipVelocityY;

    // Limita a nave para não sair da tela
    if (shipX < 0) shipX = 0;
    if (shipX + shipWidth > canvasWidth) shipX = canvasWidth - shipWidth;
    if (shipY < 0) shipY = 0;
    if (shipY + shipHeight > canvasHeight) shipY = canvasHeight - shipHeight;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Desenha a nave e os asteroides
    drawShip();
    drawAsteroids();

    // Exibe a pontuação
    document.getElementById('score').innerText = "Pontuação: " + score;
    document.getElementById('maxScore').innerText = "Pontuação Máxima: " + maxScore;

    // Aumenta a quantidade de asteroides conforme o tempo
    if (Math.random() < 0.1 + (gameTime / 3000)) { // Chance aumenta conforme o tempo
        createAsteroid();
    }

    // Atualiza o cronômetro
    updateTimer();

    // Atualiza a pontuação máxima se necessário
    updateMaxScore();

    // Atualiza o jogo a cada 20ms
    setTimeout(gameLoop, 20);
}

// Função para reiniciar o jogo
function restartGame() {
    score = 0; // Reinicia a pontuação para 0
    gameTime = 0;
    asteroids = [];
    gameOver = false;
    document.getElementById('gameOver').style.display = "none"; // Oculta o Game Over
    document.getElementById('score').style.display = "block"; // Exibe a pontuação
    document.getElementById('timer').style.display = "block"; // Exibe o timer
    document.getElementById('maxScore').style.display = "block"; // Exibe a pontuação máxima
    document.getElementById('restartButton').style.display = "none"; // Oculta o botão de reinício
    gameLoop(); // Inicia o jogo novamente
}

// Inicia o jogo
gameLoop();
