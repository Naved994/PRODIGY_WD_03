
const gameInfo = document.querySelector('.game-info');
const boxes = document.querySelectorAll('.box');
const newGameBtn = document.querySelector('.new-game-btn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let mode = 'pvp'; // 'pvp' or 'ai'

// decide the current player
let currentPlayer;

// All possible combinations to win
const winningPositions = [
    // horizontal
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    // vertical
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8], 
    // diagonal
    [0, 4, 8],
    [2, 4, 6]
]

let gameGrid;


// Initialize the game
function initGame(){
    currentPlayer = 'x';
    gameGrid = ["", "", "", "", "", "", "", "", ""];

    boxes.forEach((box, index) => {
        box.innerText = "";
        box.style.pointerEvents = "all";
        box.classList.remove("win");
    });

    gameInfo.innerText = `Current Player - ${currentPlayer.toUpperCase()}`;
    newGameBtn.classList.remove("active");
    // If AI mode and AI is 'x', make AI move first
    if (mode === 'ai' && currentPlayer === 'o') {
        aiMove();
    }
}

initGame();


// event listener for each box

boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        handleClick(index);
    });
});

// Mode selection event
modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        mode = e.target.value;
        initGame();
    });
});


function handleClick(index){
    if(gameGrid[index] === ""){
        boxes[index].innerText = currentPlayer.toUpperCase();
        boxes[index].style.pointerEvents = "none";
        gameGrid[index] = currentPlayer;
        // checking game is over or not
        if (checkGameOver()) return;
        // swapping player's turn
        swapTurn();
        // If AI mode and it's AI's turn, let AI play
        if (mode === 'ai' && currentPlayer === 'o') {
            setTimeout(aiMove, 400); // slight delay for UX
        }
    }
}

function aiMove() {
    // Simple AI: pick a random empty cell
    let emptyIndices = gameGrid.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    if (emptyIndices.length === 0) return;
    // Optionally, improve AI with smarter logic
    let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    boxes[move].innerText = 'O';
    boxes[move].style.pointerEvents = "none";
    gameGrid[move] = 'o';
    if (checkGameOver()) return;
    swapTurn();
}

// swap player turns
function swapTurn(){
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    gameInfo.innerText = `Current Player - ${currentPlayer.toUpperCase()}`;
}


// Returns true if game is over (win or draw), false otherwise
function checkGameOver(){
    let winner = "";
    // checking if any player matches the winning combinations
    winningPositions.forEach((position) => {
        if(gameGrid[position[0]] != "" && 
            gameGrid[position[1]] != "" && 
            gameGrid[position[2]] != "" && 
            gameGrid[position[0]] === gameGrid[position[1]] &&
            gameGrid[position[1]] === gameGrid[position[2]]
        ){
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            });

            winner = gameGrid[position[0]] === 'x' ? 'x' : 'o'; 
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });

    // checks if we get the winner
    if(winner != ""){
        gameInfo.innerText = `Winner - ${winner.toUpperCase()}`;
        newGameBtn.classList.add("active");
        return true;
    }

    // checks if its a draw
    let allBoxesFilled = true;
    gameGrid.forEach((box) => {
        if(box === ""){
            allBoxesFilled = false;
        }
    });

    if(allBoxesFilled){
        gameInfo.innerText = `It's a Draw`;
        newGameBtn.classList.add("active");
        return true;
    }
    return false;
}

newGameBtn.addEventListener('click', initGame);