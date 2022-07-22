const header = document.querySelector("#current");
const cells = document.querySelectorAll(".cell");

const boardStates = [
    [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
];

let currentState;
let currentStateIdx;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const choosePopup = document.querySelector(".popup");
const board = document.querySelector(".board-container");
const btnContainer = document.querySelector(".btn-container");
const chooseXBtn = document.querySelector("#player-x");
const chooseOBtn = document.querySelector("#player-o");

let currentPlayer;

function choosePlayer() {
    if(this.id === "player-x") {
        currentPlayer = "X";
    } else {
        currentPlayer= "O";
    }

    choosePopup.classList.add("hide");
    board.classList.remove("hide");
    btnContainer.classList.remove("hide");

    startGame();
}
chooseXBtn.addEventListener("click", choosePlayer);
chooseOBtn.addEventListener("click", choosePlayer);

function startGame() {
    header.textContent = currentPlayer + "'s Turn";

    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", setMark);
    }

    previousBtn.classList.add("hide");
    nextBtn.classList.add("hide");
}

function endGame() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", setMark);
    }

    changePlayer();

    currentStateIdx = boardStates.length - 1;
    currentState = boardStates[currentStateIdx].flat();

    previousBtn.classList.remove("hide");
    nextBtn.classList.remove("hide");

    previousBtn.addEventListener("click", previous);
    nextBtn.addEventListener("click", next);
}

function changePlayer() {
    if(currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
}

function setMark() {
    const span = this.childNodes[1];

    if(span.classList.length === 2) {
        if(currentPlayer === "X") {
            span.classList.add("fa-xmark");
        } else {
            span.classList.add("fa-o");
        }

        playerTurn(this);
    }
}

function updateBoard(index) {
    const board = boardStates[boardStates.length - 1].map((row) => row.map((el) => el));
    let firstIdx;
    let secondIdx;

    if(index >= 6) {
        firstIdx = 2;
        secondIdx = index - 6;
    } else if(index >= 3) {
        firstIdx = 1;
        secondIdx = index - 3;
    } else {
        firstIdx = 0;
        secondIdx = index;
    }

    //Update board
    board[firstIdx][secondIdx] = currentPlayer;
    boardStates.push(board);
}

function playerTurn(cell) {
    updateBoard(Array.from(cells).indexOf(cell));

    if(isPlayerWinner()) {
        header.textContent = currentPlayer + " Wins!";
        endGame();
        return;
    }

    if(isDraw()) {
        header.textContent = "It's a draw!";
        endGame();
        return;
    }

    changePlayer();
    header.textContent = currentPlayer + "'s Turn";
}


/*
    =========================================
    Game Outcomes
    =========================================
*/
function isDraw() {
    const latestBoard = boardStates[boardStates.length - 1];
    const empty = (el) => el === "";

    return !latestBoard.some((row) => row.some(empty));
}

function isPlayerWinner() {
    const latestBoard = boardStates[boardStates.length - 1].flat();

    for(let i = 0; i < winningCombos.length; i++) {
        if(latestBoard[winningCombos[i][0]] === currentPlayer
            && latestBoard[winningCombos[i][1]] === currentPlayer
            && latestBoard[winningCombos[i][2]] === currentPlayer) {
                return true;
        }
    }

    return false;
}


/*
    =========================================
    Buttons
    =========================================
*/
const spans = document.querySelectorAll(".mark");
const restartBtn = document.querySelector("#restart-btn");
const previousBtn = document.querySelector("#previous-btn");
const nextBtn = document.querySelector("#next-btn");

function restart() {
    boardStates.splice(1, boardStates.length - 1);

    spans.forEach((span) => {
        span.classList.remove("fa-xmark");
        span.classList.remove("fa-o");
    });

    startGame();
}
restartBtn.addEventListener("click", restart);

function previous() {
    if(currentStateIdx === 0) {
        return;
    }

    const previousState = boardStates[currentStateIdx - 1].flat();
    console.log(currentState);

    for(let i = 0; i < 9; i++) {
        if(currentState[i] !== previousState[i]) {
            if(currentState[i] === "X") {
                spans[i].classList.remove("fa-xmark");
            } else {
                spans[i].classList.remove("fa-o");
            }
            break;
        }
    }

    currentStateIdx--;
    currentState = boardStates[currentStateIdx].flat();
}

function next() {
    if(currentStateIdx === boardStates.length - 1) {return;}

    const nextState = boardStates[currentStateIdx + 1].flat();

    for(let i = 0; i < 9; i++) {
        if(currentState[i] !== nextState[i]) {
            if(nextState[i] === "X") {
                spans[i].classList.add("fa-xmark");
            } else {
                spans[i].classList.add("fa-o");
            }
            break;
        }
    }

    currentStateIdx++;
    currentState = boardStates[currentStateIdx].flat();
}
