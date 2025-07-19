let highScore = 0;
let animateId = null;
let IntervalId = null;
const canvas = document.querySelector("canvas");
    scoreEl = document.getElementById("scoreEl");
    recordEl = document.querySelector("#recordEl");
    startBtn = document.querySelector("#startBtn");
    modal = document.querySelector(".game-modal");
    bigscaore = document.querySelector("#bigScore");    
    c = canvas.getContext("2d");

canvas.width = window.innerWidth - 6;
canvas.height = window.innerHeight - 6;
highScore = localStorage.getItem("highScore") || 0;
recordEl.textContent = highScore;

function Player(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.score = 0;

    this.draw = function () {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );      
        c.fill();
    }     
    }

    function Projectile(x, y, radius, color, velocity, speed= 6) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;

    this.draw = function () {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );      
        c.fill();
    }  
    this.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x * this.speed;
        this.y = this.y + this.velocity.y * this.speed;             
    }   
}

      function Enemy (x, y, radius, color, velocity, speed= 6) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;

    this.draw = function () {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );      
        c.fill();
    }  
    this.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y;             
    }   
}

    const friction = 0.99;
     function Particle (x, y, radius, color, velocity, ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = Math.random() * 10;
    this.alpha = 1;
    this.draw = function () {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );      
        c.fill();
        c.restore();
    }  
    this.update = function () {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x * this.speed;
        this.y = this.y + this.velocity.y * this.speed;
        this.alpha -= 0.01;            
    }   
}

    let player = new Player(canvas.width / 2, canvas.height / 2, 10, "#fff"); 
    let projectiles = [];
    let enemies = [];
    let particles = [];

    function init() {
        player = new Player(canvas.width / 2, canvas.height / 2, 10, "#fff");
        projectiles = [];
        enemies = [];
        particles = [];
        player.score = 0;
        scoreEl.textContent = player.score;        
        highScore = localStorage.getItem("highScore") || 0;
        recordEl.textContent = highScore;
        bigScore.textContent = player.score;
    }

    function spawnEnemies() {
            IntervalId = setInterval(() => {
            const radius = 6 + Math.random() * (30-6);
            let x;
            let y;
            
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
              }  else {
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
                x = Math.random() * canvas.width;
            }
            const angle = Math.atan2(player.y - y, player.x - x);
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            const velocity = {
                x: Math.cos(angle), 
                y: Math.sin(angle)               
            };
          enemies.push(new Enemy(x, y, radius, color, velocity));
        }, 1000);

    }

    function animate() {
        animateId = requestAnimationFrame(animate);
        c.fillStyle = "rgba(0, 0, 0, 0.2)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        player.draw();

        particles.forEach((particle, partindex) => {
            if (particle.alpha <= 0) {              
                    particles.splice(partindex, 1);
            } else {
                particle.update();
            }
        });

        projectiles.forEach((item, projIndex) => {
            item.update(); 
            if (item.x + item.radius < 0 || 
                item.x - item.radius > canvas.width || 
                item.y + item.radius < 0 || 
                item.y - item.radius > canvas.height) {
                setTimeout(() => {
                    projectiles.splice(projIndex, 1);
                }, 1);
            }          
        });
        enemies.forEach((enemy, enemyIndex) => {
          enemy.update();

            const distance = Math.hypot(player.x - enemy.x, 
              player.y - enemy.y);

              if (distance - enemy.radius - player.radius < 1) {
                console.log("GAME OVER");
                cancelAnimationFrame(animateId);
                clearInterval(IntervalId);
                animateId = intervalId = null;
                if (player.score > highScore) {
                    highScore = player.score;
                    localStorage.setItem("highScore", highScore);                   
                }
                scoreEl.textContent = player.score;
                recordEl.textContent = highScore;
                modal.style.display = "flex";
                bigScore.textContent = player.score;                
              }

          projectiles.forEach((projectile, projIndex) => {
            const distance = Math.hypot(
              projectile.x - enemy.x,
              projectile.y - enemy.y
            );
// Снаряд попал во врага
            if(distance - enemy.radius - projectile.radius < 1) {
                for(let i = 0; i < Math.random() * (enemy.radius * 5); i++) {
                    particles.push(new Particle(
                        projectile.x, 
                        projectile.y,
                        1 + Math.random() * 4,
                            enemy.color,
                        { x: Math.random() - 0.5, y: Math.random() - 0.5 }
                       
                        )); 
                 }   

                if(enemy.radius - 10 > 5) {
                player.score += 10;
                scoreEl.textContent = player.score;

                setTimeout(() => {
                  gsap.to(enemy, {
                    radius: enemy.radius - 10});
                    projectiles.splice(projIndex, 1); 
                }, 0);
             }
             else {
                 player.score += 30;  
                scoreEl.textContent = player.score;
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(projIndex, 1);
                }, 0);
            }
        }
        });
     });
    }

window.addEventListener("click", (e) => {
      shoot(e.clientX, e.clientY);
});

window.addEventListener("touchstart", (e) =>{
    const touch = e.touches[0];
    shoot(touch.clientX, touch.clientY);
});

startBtn.addEventListener("click", () => {
    init();
    animate();
    spawnEnemies();
    modal.style.display = "none";
});

function shoot(x, y) {
    const angle = Math.atan2(
            y - player.y,
            x - player.x 
        );    
    const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
           
    projectiles.push(new Projectile(
            player.x, 
            player.y, 
            7, 
            "#fff", 
            velocity
        ));
}





