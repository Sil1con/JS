let score = JSON.parse(localStorage.getItem('score')) || {wins: 0, loses: 0, ties: 0};
const jsScore = document.querySelector('.js-score');
jsScore.innerHTML = `Wins: ${score.wins}, Losses: ${score.loses}, Ties: ${score.ties}`;

function playGame(playerMove) {
    const compMove = getComputerMove();
    let result = '';

    if (playerMove === 'rock') {
    
        if (compMove === 'rock') result = 'Tie.';
        else if (compMove === 'scissors') result = 'You win!';
        else if (compMove === 'paper') result = 'You lose!'
    
    } else if (playerMove === 'scissors') {

        if (compMove === 'rock') result = 'You lose!';
        else if (compMove === 'scissors') result = 'Tie.';
        else if (compMove === 'paper') result = 'You win!'
    
    } else if (playerMove === 'paper') {
        
        if (compMove === 'rock') result = 'You win!';
        else if (compMove === 'scissors') result = 'You lose!';
        else if (compMove === 'paper') result = 'Tie.'
    
    }

    document.querySelector('.js-move').innerHTML = `You 
            <img class="move-img" src="./img/${playerMove}-emoji.png"> 
                VS 
            <img class="move-img" src="./img/${compMove}-emoji.png">
                    Computer`;
    document.querySelector('.js-result').innerHTML = result;

    if (result === 'You win!') score.wins += 1;
    else if (result === 'You lose!') score.loses += 1;
    else if (result === 'Tie.') score.ties += 1;

    
    localStorage.setItem('score', JSON.stringify(score))
    updateScore();
}

function getComputerMove() {
    let rand = Math.random();
    let computerMove = '';

    if (rand >= 0 && rand < 1/3) computerMove = 'rock';
    else if (rand >= 1/3 && rand < 2/3) computerMove = 'paper';
    else if (rand >= 2/3 && rand < 1) computerMove = 'scissors';

    return computerMove;
}

function resetScore() {
    localStorage.setItem('score', '{"wins": 0, "loses": 0, "ties": 0}');
    updateScore();
}

function updateScore() {
    score = JSON.parse(localStorage.getItem('score'));
    jsScore.innerHTML = `Wins: ${score.wins}, Losses: ${score.loses}, Ties: ${score.ties}`;
}