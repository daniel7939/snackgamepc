let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let scale = 20;
let rows = canvas.height / scale;
let columns = canvas.width / scale;
let score = 0; // Initialize score

// Renamed from 'snack' to 'snake' for clarity
let snake = [];
snake[0] = {
    x: (Math.floor(Math.random() * columns)) * scale,
    y: (Math.floor(Math.random() * rows)) * scale
};

let food = {
    x: (Math.floor(Math.random() * columns)) * scale,
    y: (Math.floor(Math.random() * rows)) * scale
};

let d = "right";
let gameOver = false;

document.onkeydown = direction;

function direction(event) {
    if (gameOver) return;
    
    let key = event.keyCode;
    if (key == 37 && d != "right") d = "left";
    else if (key == 38 && d != "down") d = "up";
    else if (key == 39 && d != "left") d = "right";
    else if (key == 40 && d != "up") d = "down";
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width/2 - 100, canvas.height/2);
}

let playGame = setInterval(draw, 100);

function draw() {
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake body
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4CAF50" : "#8BC34A"; // Head is darker green
        ctx.strokeStyle = "#fff";
        ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
        ctx.strokeRect(snake[i].x, snake[i].y, scale, scale);
    }
    
    // Draw food
    ctx.fillStyle = "#FF5722";
    ctx.strokeStyle = "#fff";
    ctx.fillRect(food.x, food.y, scale, scale);
    ctx.strokeRect(food.x, food.y, scale, scale);
    
    // Old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // Move in current direction
    if (d == "left") snakeX -= scale;
    if (d == "up") snakeY -= scale;
    if (d == "right") snakeX += scale;
    if (d == "down") snakeY += scale;
    
    // Boundary checking - wrap around
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeX < 0) snakeX = canvas.width - scale;
    if (snakeY >= canvas.height) snakeY = 0;
    if (snakeY < 0) snakeY = canvas.height - scale;
    
    // Check if snake eats food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: (Math.floor(Math.random() * columns)) * scale,
            y: (Math.floor(Math.random() * rows)) * scale
        };
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
    
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    // Check for collisions
    if (eatSelf(newHead, snake)) {
        gameOver = true;
        drawGameOver();
        clearInterval(playGame);
    }
    
    snake.unshift(newHead);
    drawScore();
}

function eatSelf(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}