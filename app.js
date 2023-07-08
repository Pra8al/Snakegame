const GAME_SPEED_CHANGE = 10000;
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
]

let snakeAtStart = Array.from(snake);

// The user's score
let score = 0;
// When set to true the snake is changing direction
let changingDirection = false;
// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;
// Game Speed which will increase after every 10 sec
let gameSpeed = 750
setInterval(() => {
    if (gameSpeed >= 100) {
        gameSpeed -= 50;
    }
}, GAME_SPEED_CHANGE)

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

// Create the first food location
createFood();
// Start game

// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);
let overHtml = document.getElementById('over');
overHtml.style.opacity = 0;
let playHtml = document.getElementById('play');
playHtml.style.opacity = 1;
let scoreHtml = document.getElementById('score');
let lastScoreHtml = document.getElementById('lastscore');
let lastScore = 0;

document.querySelector("button").onclick = function () {
    createFood();
    main();
    playHtml.style.opacity = 0;
}




/**
* Main function of the game
* called repeatedly to advance the game
*/
function main() {
    // If the game ended return early to stop game
    if (didGameEnd()) { 
            playHtml.style.opacity = 1; 
            snake = snakeAtStart;
            lastScore = score;
            score = 0;
            scoreHtml.innerHTML = score;
            lastScoreHtml.innerHTML = lastScore;
            overHtml.style.opacity=1;

            return 
    };
    drawSnake();
    drawFood();
    // setTimeout(()=>{
    //     clearCanvas();
    // },3000)
    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        // Call game again
        main();
    }, gameSpeed)
}

/**
 * Draw the food on the canvas
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.clientWidth - 10);
    foodY = randomTen(0, gameCanvas.clientHeight - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake)
            createFood();
    });
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

/**
 * Draw the Snake on the canvas
 */

function drawSnakePart(snakePart, snakeColor) {
    ctx.fillStyle = snakeColor;
    ctx.strokestyle = 'black';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let snakeColor = 'lightgreen'
        if (i == 0) {
            snakeColor = 'darkgreen';
        }
        drawSnakePart(snake[i], snakeColor);
    }

}

/**
 * Movement of snake and Score Logic
 */

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        scoreHtml.innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}


function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    /**
     * Prevent the snake from reversing
     * Example scenario:
     * Snake is moving to the right. User presses down and immediately left
     * and the snake immediately changes direction without taking a step down first
     */
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
/**
 * Returns true if the head of the snake touched another part of the game
 * or any of the walls
 */
function didGameEnd() {
    //Since the snake might collide itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.clientWidth - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.clientHeight - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.clientWidth, gameCanvas.clientHeight);
}