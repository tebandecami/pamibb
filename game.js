document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const SCREEN_WIDTH = canvas.width;
    const SCREEN_HEIGHT = canvas.height;

    const HELLO_KITTY_WIDTH = 50;
    const HELLO_KITTY_HEIGHT = 50;

    const HEART_WIDTH = 30;
    const HEART_HEIGHT = 30;

    const BOMB_WIDTH = 30;
    const BOMB_HEIGHT = 30;

    const HELLO_KITTY_SPEED = 5;
    const HEART_SPEED = 2;
    const BOMB_SPEED = 3;

    let helloKittyX = SCREEN_WIDTH / 2 - HELLO_KITTY_WIDTH / 2;
    let helloKittyY = SCREEN_HEIGHT - HELLO_KITTY_HEIGHT - 10;
    let helloKittySpeedX = 0;

    let hearts = [];
    let bombs = [];
    let score = 0;
    let gameOver = false;

    const helloKittyImg = new Image();
    helloKittyImg.src = 'Hello_kitty.png';

    const heartImg = new Image();
    heartImg.src = 'Heart.png';

    const bombImg = new Image();
    bombImg.src = 'bomb.png';

    function generateObjects() {
        if (Math.random() < 0.05) {
            let heart = {
                x: Math.random() * (SCREEN_WIDTH - HEART_WIDTH),
                y: -HEART_HEIGHT,
                speedY: HEART_SPEED
            };
            hearts.push(heart);
        }

        if (Math.random() < 0.02) {
            let bomb = {
                x: Math.random() * (SCREEN_WIDTH - BOMB_WIDTH),
                y: -BOMB_HEIGHT,
                speedY: BOMB_SPEED
            };
            bombs.push(bomb);
        }
    }

    function drawHelloKitty() {
        ctx.drawImage(helloKittyImg, helloKittyX, helloKittyY, HELLO_KITTY_WIDTH, HELLO_KITTY_HEIGHT);
    }

    function drawHearts() {
        hearts.forEach(function(heart) {
            ctx.drawImage(heartImg, heart.x, heart.y, HEART_WIDTH, HEART_HEIGHT);
        });
    }

    function drawBombs() {
        bombs.forEach(function(bomb) {
            ctx.drawImage(bombImg, bomb.x, bomb.y, BOMB_WIDTH, BOMB_HEIGHT);
        });
    }

    function updateObjects() {
        hearts.forEach(function(heart) {
            heart.y += heart.speedY;
        });

        bombs.forEach(function(bomb) {
            bomb.y += bomb.speedY;
        });

        hearts = hearts.filter(function(heart) {
            return heart.y < SCREEN_HEIGHT;
        });

        bombs = bombs.filter(function(bomb) {
            return bomb.y < SCREEN_HEIGHT;
        });

        generateObjects();
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            helloKittySpeedX = -HELLO_KITTY_SPEED;
        } else if (event.key === 'ArrowRight') {
            helloKittySpeedX = HELLO_KITTY_SPEED;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            helloKittySpeedX = 0;
        }
    });

    function checkCollisions() {
        hearts.forEach(function(heart, heartIndex) {
            if (helloKittyX < heart.x + HEART_WIDTH &&
                helloKittyX + HELLO_KITTY_WIDTH > heart.x &&
                helloKittyY < heart.y + HEART_HEIGHT &&
                helloKittyY + HELLO_KITTY_HEIGHT > heart.y) {
                    hearts.splice(heartIndex, 1);
                    score++;
                    document.getElementById('score').textContent = 'Puntuación: ' + score;
                }
        });

        bombs.forEach(function(bomb, bombIndex) {
            if (helloKittyX < bomb.x + BOMB_WIDTH &&
                helloKittyX + HELLO_KITTY_WIDTH > bomb.x &&
                helloKittyY < bomb.y + BOMB_HEIGHT &&
                helloKittyY + HELLO_KITTY_HEIGHT > bomb.y) {
                    endGame();
                }
        });
    }

    function drawScore() {
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.fillText('Puntuación: ' + score, 10, 30);
    }

    function endGame() {
        gameOver = true;
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = '#e91e63';
        ctx.font = '32px Arial';
        ctx.fillText('¡Juego terminado!', SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2 - 50);
        ctx.fillText('Puntuación final: ' + score, SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2);
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('finalScore').textContent = score;
    }

    function restartGame() {
        location.reload(); // Recargar página para reiniciar el juego
    }

    function gameLoop() {
        if (!gameOver) {
            ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            updateObjects();
            checkCollisions();
            drawHelloKitty();
            drawHearts();
            drawBombs();
            drawScore();

            helloKittyX += helloKittySpeedX;

            if (helloKittyX < 0) {
                helloKittyX = 0;
            } else if (helloKittyX > SCREEN_WIDTH - HELLO_KITTY_WIDTH) {
                helloKittyX = SCREEN_WIDTH - HELLO_KITTY_WIDTH;
            }

            requestAnimationFrame(gameLoop);
        }
    }

    gameLoop();
});
