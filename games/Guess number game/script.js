const MIN_NUMBER = 1,
      MAX_NUMBER = 100;
      
let answer;
let attempts = 0;



const guessInput = document.getElementById("guess-input"),
      submitGuess = document.getElementById("submit-guess"),
      feedback = document.getElementById("feedback"),
      hint = document.getElementById("hint"),
      attemptsDisplay = document.getElementById("attempts"),
      newGame = document.getElementById("new-game");

guessInput.disabled = true;

newGame.addEventListener('click', function() {
    answer = parseInt((Math.random() * (MAX_NUMBER - MIN_NUMBER) + 1));
    guessInput.disabled = false;
    newGame.classList.toggle("hidden");
    submitGuess.classList.toggle("hidden");

    attempts = 0;
    attemptsDisplay.textContent = `Попытки: ${attempts}`;
    hint.style.color = '#f44336';

    submitGuess.addEventListener('click', checkGuess);
});

function checkGuess () {
    let userGuess = parseInt(guessInput.value);

    if(isNaN(userGuess)  || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        feedback.textContent = "Введите допустимое число!";
        hint.textContent = "";
        console.log(userGuess, answer);
        return;
    }

    attempts++;
    attemptsDisplay.textContent = `Попытки: ${attempts}`;
    console.log(userGuess, answer);
    if(userGuess === answer) {
        feedback.textContent = "Вы угадали число!";
        hint.textContent = "";
        hint.style.color = "#5CB85C";
        submitGuess.classList.toggle("hidden")
        newGame.classList.toggle("hidden");
        guessInput.disabled = true;
        } else if (userGuess > answer) {
          feedback.textContent = "";
          hint.textContent = "Число меньше!";
        } else {
            feedback.textContent = "";
            hint.textContent = "Число больше!"; 
        }
    guessInput.value = "";
}