window.addEventListener("load", startGame);

const header = document.querySelector("#current");
const cells = document.querySelectorAll(".cell");

let currentPlayer = "X";
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

function startGame() {
    header.textContent = currentPlayer + "'s Turn";

    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", setMark);
    }
}

function endGame() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", setMark);
    }

    currentState = boardStates[boardStates.length - 1].flat();
    currentStateIdx = boardStates.length - 1;
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

    spans.forEach((span, i) => {
        span.classList.remove("fa-xmark");
        span.classList.remove("fa-o");
    });

    startGame();
}
restartBtn.addEventListener("click", restart);

function previous() {
    const previousState = boardStates[currentStateIdx - 1].flat();

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
