let intervalId = null;
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const recordEl = document.getElementById('record');
const board = document.querySelector('canvas');

const size = 25;
const rows = Math.floor((window.innerWidth - 50) /size); 
     colls = Math.floor((window.innerHeight - 100) /size);
board.width = rows * size;
board.height = colls * size;

c = board.getContext('2d');
let gameRunning = false;
let directionChanged = false;
let highScore = +(localStorage.getItem('snakeRecord')) || 1;
recordEl.textContent = `Record: ${highScore}`;
const gameSpeed = window.innerWidth < 900 ? 160 : 100;

const touch = {
    startX: 0,
    startY: 0
};
const snake = {
    body: [{
     x: Math.floor(rows/2) * size,
     y: Math.floor(colls/2) * size
    }],
 diraction: {dx: 1, dy: 0},
 length: 1
};

const food = {
x: null,
y: null,
placeFood: function() { 
    let valid = true;

    while(valid) {
     this.x = Math.floor(1 + Math.random() * (rows - 2)) * size;
     this.y = Math.floor(1 + Math.random() * (colls - 2)) * size;   

     valid = snake.body.some(seg => seg.x == this.x && seg.y == this.y)
    }
    
}
};

function startGame() {
    resetGame();
    food.placeFood();
    intervalId = setInterval(draw, gameSpeed);
    overlay.classList.remove('show');
    gameRunning = true;
}

function resetGame() {
    snake.body = [{
     x: Math.floor(rows/2) * size,
     y: Math.floor(colls/2) * size
    }];
    snake.length = 1;
    snake.diraction = {dx: 1, dy: 0};
    updateScore();

}

function updateScore() {
    scoreEl.textContent = `Score: ${snake.length}`;
    if (snake.length > highScore && !gameRunning) {
        highScore = snake.length;
        localStorage.setItem('snakeRecord', highScore);
    }
    recordEl.textContent = `Record: ${highScore}`
}

function draw() {
    directionChanged = false;
    c.clearRect(0, 0, board.width, board.height);

    c.fillStyle = 'red'
     c.fillRect(food.x, food.y, size, size);

    c.fillStyle = '#dd6809'
    for(let i = 0; i <snake.body.length; i++) {
        const segment = snake.body[i];
         c.fillRect(segment.x, segment.y, size, size);
    }


    const newHead = {
    x: snake.body[0].x + (snake.diraction.dx * size),
    y: snake.body[0].y + (snake.diraction.dy * size)   
    };
    
    if(collision(newHead, snake.body)) {
        clearInterval(intervalId);
        gameOver();
        return;
    }

    snake.body.unshift(newHead);

    if(snake.body[0].x == food.x && snake.body[0].y == food.y) {
        snake.length++;
        console.log(snake.length);
        food.placeFood();
        updateScore();
    } else {
        snake.body.pop();   
    }
}

function gameOver() {
overlay.innerHTML = `GAME OVER<span class='small'>Press Space</span>`;
overlay.classList.add('show');
gameRunning = false;
updateScore();
}

function collision(head, tail) {
    if(head.x < 0 || head.y < 0 ||
        head.x + size  > board.width ||
        head.y + size  > board.height) {
            return true;
        }

    for(let i = 0; i < tail.length; i++) {
        if(head.x == tail[i].x && head.y == tail[i].y) {
            return true;
        }
    }
    

    return false;
}

function simulateKey(key) {
    const eventKey = new KeyboardEvent('keydown', {key});
    document.dispatchEvent(eventKey);
}

board.addEventListener('touchstart', e => {
    const startTouch = (e.touches[0]);
    touch.startX = startTouch.clientX;
    touch.startY = startTouch.clientY;
});

board.addEventListener('touchend', e=> {
    const endTouch = e.changedTouches[0];
    const swipeX = touch.startX - endTouch.clientX;
    const swipeY = touch.startY - endTouch.clientY;

    if(Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX > 20) simulateKey('ArrowLeft');
        else if (swipeX < -20) simulateKey('ArrowRight');
    } else {
        if (swipeY > 20) simulateKey('ArrowUp');
        else if (swipeY < -20) simulateKey ('ArrowDown');
    }
});

document.addEventListener('touchstart', () => {
 if(gameRunning) return;
 const eventStart = new KeyboardEvent('keydown', {key:'', code:'Space'});
 document.dispatchEvent(eventStart);
});

document.addEventListener('keydown', function(e) {
    const dir = snake.diraction;

    if(!gameRunning && e.code == 'Space') {
        startGame();
    }

    if(directionChanged) return;

    if((e.key == 'ArrowDown' || e.key == 's') && dir.dy != -1) {
        dir.dx = 0;
        dir.dy = 1;
        directionChanged = true;
    } else if((e.key == 'ArrowLeft' || e.key == 'a')&& dir.dx != 1) {
        dir.dx = -1;
        dir.dy = 0; 
        directionChanged = true;
    } else if ((e.key == 'ArrowRight' || e.key == 'd')&& dir.dx != -1) {
        dir.dx = 1;
        dir.dy = 0;
        directionChanged = true;
    }  else if((e.key == 'ArrowUp' || e.key == 'w')&& dir.dy != 1) {
        dir.dx = 0;
        dir.dy = -1;
        directionChanged = true; 
    }        
});