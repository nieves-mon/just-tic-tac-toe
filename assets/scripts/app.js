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

    if(span.classList.length === 1) {
        span.classList.add("fa-solid");

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

startGame();