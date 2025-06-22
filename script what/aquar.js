const toggleAqua = document.createElement('button');
toggleAqua.textContent = '🌊';
toggleAqua.id = 'toggle-aquarium';
document.body.append(toggleAqua);

const canvas = document.createElement('canvas');
canvas.id = 'aquarium-canvas';
document.body.append(canvas);


canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

let circleArray;
const c = canvas.getContext('2d');
const colors = ['#14213d', '#FFFFFF' ];
let animeteId = null;
let active = false;

const animationSpeed = window.innerWidth <= 768 ? 1.5 : 3;
const minSize = window.innerWidth <= 768 ? 5 : 10;
const maxSize = window.innerWidth <= 768 ? 12 : 30;
const count = window.innerWidth <= 768 ? 2000 : 2500;

const circle = {
    x:100,
    y:200,
    radius: 50,
    color: `${colors[Math.floor(Math.random() * colors.length)]}`,
    diraction: {dx: 10, dy: 10},
    changecolor: function() {
        this.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
    }
};

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
    this.diraction = {
        dx: (Math.random() - .5) * animationSpeed,
        dy: (Math.random() - .5) * animationSpeed
    };
    this.changecolor = function() {
        this.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
    };
    this.draw = function() {
        c.beginPath();
        c.arc( this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();   
    };
    this.update = function() {
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.diraction.dx = -this.diraction.dx;
            // this.changecolor();
        } 

        if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.diraction.dy = -this.diraction.dy;
            // this.changecolor();
        }

        this.x += this.diraction.dx;
        this.y += this.diraction.dy;
        this.draw();

    }; 
}

function createCircles() {
    circleArray = [];
    for(let i = 0; i < count; i++) {
        const radius = minSize + (Math.random() * maxSize);
        circleArray.push(new Circle(
            Math.random() * (canvas.width - radius *2) + radius,
            Math.random() * (canvas.height- radius *2) + radius,
            radius
        ));
    }
}

function start() {
    canvas.classList.remove('hide');
    canvas.classList.add('show');
    createCircles();
    animate();
    canvas.style.display = 'block';
}

function stopAq() {
 canvas.classList.remove('show');
 canvas.classList.add('hide');
 setTimeout(function(){
    cancelAnimationFrame(animeteId);
    canvas.style.display = 'none';
 }, 600);
}

function animate() {
    animeteId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circleArray.forEach(function(item) {
        item.update();
    });
}

toggleAqua.addEventListener('click', ()=> {
    active = !active;
    active ? start() : stopAq()
});