window.addEventListener('DOMContentLoaded', function() {
    // глобальный обект игры
    const game = {
        lives: 3,
        timer: 0,
        minspeed: window.innerwidth <= 768 ? 400 : 700,
        gamespeed: 1700,
        board: 16
    };

    // Получаем элементы dom
    const startscreen = document.getElementById('start-screen'),
            gamecontainer = document.getElementById('game-container'),
            gameoverscreen = document.getElementById('game-over'),
            grid = document.getElementById('grid'),
            livesdisplay = document.getElementById('lives'),
            timerdisplay = document.getElementById('timer'),
            finaltime = document.getElementById('final-time'),
            startbtn = document.getElementById('start-btn'),
            restartbtn = document.getElementById('restart-btn');

    // Звуки
    const sounds = {
        hit: document.getElementById('hitsound'),
        miss: document.getElementById('misssound'),
        gameover: document.getElementById('gameoversound'),
        hitheart: document.getElementById('hitheartsound'),
        missheart: document.getElementById('missheartsound'),
    };

    // Список ячеек
    const cells = [];

    // Функция грида
    function creategrid() {
        grid.innerHTML = '';
        cells.length = 0;
        for (let i = 0; i < game.board; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    // функция получения случяной ячейки
    function getRandomCell() {
        return cells[Math.floor(Math.random() * cells.length)];
    }

    // Функция отображения элемента
    function spawnelement(type) {
        if (game.lives <= 0) {
            checkgameover();
            return;
        }

        const cell = getRandomCell();

        const element = document.createElement('img');
        element.src = type === 'mole' ? 'assets/mole.png' : 'assets/heart.png';
        element.classList.add(type);
        element.dataset.clicked = 'false';
        cell.appendChild(element);

        element.addEventListener('click', () => {
            if (element.dataset.clicked == 'false')
                handleclick(type, element); 
            else {
                console.log('На элемент уже нажали');
            }
        }); 



        setTimeout(() => {           
            if (cell.contains(element) && type == 'mole' && element.dataset.clicked == 'false') {
                element.dataset.clicked = 'true';
                game.lives--;
                checkgameover();
                livesdisplay.textContent = '❤️'. repeat(game.lives);
                livesdisplay.classList.add('blink')
                sounds.missheart.play();
                setTimeout(() => {
                    livesdisplay.classList.remove('blink');
                }, 300);
            }
            if(type == 'heart' &&
              element.dataset.clicked == 'false' ) {
                element.dataset.clicked == 'true';
                element.classList.add('heart-blink');
                sounds.missheart.play();
              }
            else element.classList.add('mole-hide');
            setTimeout(() => {
                delete element.dataset.clicked;
                element.remove();
            }, 500);
        }, Math.max(game.minspeed, game.gamespeed));

        setTimeout(gettingfaster, game.gamespeed);
    }

    // функция клика
    function handleclick(type, element) {
        if (element.dataset.clicked == 'true') {
            console.log('Выход уже нажал!');
            return;
        }
        element.dataset.clicked = 'true';
        element.classList.add(type === 'mole'? 'mole-hit' : 'heart-glow');
        setTimeout(() => {
            delete element.dataset.clicked;
            element.remove();
        }, 500);

        if (type === 'mole') {
            console.log('крот кликнут!');
            sounds.hit.play();
        } else {
            console.log('сердце кликнуто!');
            game.lives++;
            livesdisplay.textContent = '❤️'.repeat(game.lives);
            livesdisplay.classList.add('blink');
            setTimeout(() => {livesdisplay.classList.remove('blink');}, 300);
            // мигание сердец
            sounds.hitheart.play();
        }
    }

    // Функция старта игры

    function startgame() { 
        startscreen.classList.add('hidden');
        gamecontainer.classList.remove('hidden');
        game.lives = 3;
        game.timer = 0;
        game.gamespeed = 1700;
        livesdisplay.innerText = '❤️'.repeat(game.lives);

        setTimeout(gettingfaster, game.gamespeed);
    }

    // Функция спавна
    function gettingfaster() {
        game.timer++;
        timerdisplay.innerText = `Время: ${Math.floor(game.timer / 60)}:${(game.
            timer % 60).toString().padStart(2, '0')}`;
            spawnelement(Math.random() < 0.9 ? 'mole' : 'heart');
            game.gamespeed = Math.max(game.minspeed, game.gamespeed - 50);
            console.log('новая скорость:', game.gamespeed);      
    }


    function checkgameover() {
        if ( game.lives <= 0) {
            gameoverscreen.classList.remove('hidden');
            gamecontainer.classList.add('hidden');
            finaltime.innerText = `Ты продержался ${game.timer} sec.`;
            sounds.gameover.play();
        }
    }

    function restartgame() {
        gameoverscreen.classList.add('hidden'); 
        timerdisplay.innerText = 'Время: 0:00';
        startgame();
    }

    startbtn.addEventListener('click', startgame);
    restartbtn.addEventListener('click', restartgame);
    creategrid();
});
