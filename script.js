const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryButton = document.getElementById("retryButton");
const playerNameDisplay = document.getElementById("playerName");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const brickColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#A633FF"];

let bricks = [];
let score = 0;
let level = 1;
let playerName = "John Doe";

function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 2, color: brickColors[r % brickColors.length] };
        }
    }
}

initBricks();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("touchstart", touchStartHandler);
canvas.addEventListener("touchmove", touchMoveHandler);

retryButton.addEventListener("click", () => {
    resetGame();
    draw();
});

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function touchStartHandler(e) {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        leftPressed = true;
    } else {
        rightPressed = true;
    }
}

function touchMoveHandler(e) {
    const touchX = e.touches[0].clientX;
    paddleX = touchX - paddleWidth / 2;
    if (paddleX < 0) {
        paddleX = 0;
    } else if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
    e.preventDefault();
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;
                    score += 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                    if (bricks.every(column => column.every(brick => brick.status === 0))) {
                        level++;
                        levelDisplay.textContent = `Level: ${level}`;
                        initBricks();
                        resetBall();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#808080";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.globalAlpha = bricks[c][r].status / 2;
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x - ballRadius < 0) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            endGame();
            return;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
}

function resetGame() {
    score = 0;
    level = 1;
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${level}`;
    initBricks();
    resetBall();
    retryButton.style.display = "none";
    draw();
}

function endGame() {
    retryButton.style.display = "block";
}

resetGame();
