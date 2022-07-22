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

let winningIdx;
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

    hide(choosePopup);
    unhide(board);
    unhide(btnContainer);
    unhide(header);

    startGame();
}
chooseXBtn.addEventListener("click", choosePlayer);
chooseOBtn.addEventListener("click", choosePlayer);

function startGame() {
    hide(previousBtn);
    hide(nextBtn);

    header.textContent = currentPlayer + "'s Turn";

    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", setMark);
    }
}

function endGame() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", setMark);
    }

    changePlayer();

    currentStateIdx = boardStates.length - 1;
    currentState = boardStates[currentStateIdx].flat();

    nextBtn.classList.add("disabled");
    unhide(previousBtn);
    unhide(nextBtn);

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
                winningIdx = i;
                strike(winningIdx);
                return true;
        }
    }

    return false;
}


/*
    =========================================
    Strikethrough
    =========================================
*/
const vertical = document.querySelector("#vertical");
const horizontal = document.querySelector("#horizontal");
const diagonalLeft = document.querySelector("#diagonal-left");
const diagonalRight = document.querySelector("#diagonal-right");

function strike(index) {
    switch(index) {
        case 0:
            horizontal.style.top = "15%";
            horizontal.style.width = "95%";
            break;
        case 1:
            horizontal.style.top = "48%";
            horizontal.style.width = "95%";
            break;
        case 2:
            horizontal.style.top = "82%";
            horizontal.style.width = "95%";
            break;
        case 3:
            vertical.style.left = "15%";
            vertical.style.height = "95%";
            break;
        case 4:
            vertical.style.left = "49%";
            vertical.style.height = "95%";
            break;
        case 5:
            vertical.style.left = "82%";
            vertical.style.height = "95%";
        case 6:
            diagonalLeft.style.width = "130%";
            break;
        case 7:
            diagonalRight.style.width = "130%";
            break;
    }
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
    if(Array.from(nextBtn.classList).includes("disabled")) {
        nextBtn.classList.remove("disabled");
        nextBtn.addEventListener("click", next);
    }

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

    if(currentStateIdx === 0) {
        previousBtn.classList.add("disabled");
        previousBtn.removeEventListener("click", previous);
    }
}

function next() {
    if(Array.from(previousBtn.classList).includes("disabled")) {
        previousBtn.classList.remove("disabled");
        previousBtn.addEventListener("click", previous);
    }

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

    if(currentStateIdx === boardStates.length - 1) {
        nextBtn.classList.add("disabled");
        nextBtn.removeEventListener("click", next);
    }
}


/*
    =========================================
    Transition
    =========================================
*/
function unhide(element) {
    element.classList.remove("hide");
    setTimeout(() => {element.style.opacity = 1}, 500);
}

function hide(element) {
    element.style.opacity = 0;
    setTimeout(() => {element.classList.add("hide")}, 500);
}
