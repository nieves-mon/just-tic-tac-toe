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
                spans[winningCombos[i][0]].classList.add("winningCombo");
                spans[winningCombos[i][1]].classList.add("winningCombo");
                spans[winningCombos[i][2]].classList.add("winningCombo");

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
            horizontal.style.top = "49%";
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
            break;
        case 6:
            diagonalLeft.style.width = "130%";
            break;
        case 7:
            diagonalRight.style.width = "130%";
            break;
    }
}

function unstrike(index) {
    if(index < 3) {
        horizontal.style.width = 0;
    } else if(index < 6) {
        vertical.style.height = 0;
    } else if(index === 6) {
        diagonalLeft.style.width = 0;
    } else {
        diagonalRight.style.width = 0;
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
    unstrike(winningIdx);
    winningIdx = null;
    previousBtn.classList.remove("disabled");

    boardStates.splice(1, boardStates.length - 1);

    spans.forEach((span) => {
        span.style.fontSize = null;
        span.classList.remove("winningCombo");
        span.classList.remove("fa-xmark");
        span.classList.remove("fa-o");
    });

    startGame();
}
restartBtn.addEventListener("click", restart);

function previous() {
    if(Array.from(nextBtn.classList).includes("disabled")) {
        unstrike(winningIdx);
        nextBtn.classList.remove("disabled");
        nextBtn.addEventListener("click", next);
    }

    const previousState = boardStates[currentStateIdx - 1].flat();

    for(let i = 0; i < 9; i++) {
        if(currentState[i] !== previousState[i]) {
            spans[i].style.fontSize = 0;
            if(currentState[i] === "X") {
                setTimeout(() => {spans[i].classList.remove("fa-xmark")}, 200);
            } else {
                setTimeout(() => {spans[i].classList.remove("fa-o")}, 200);
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
            spans[i].style.fontSize = null;
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
        strike(winningIdx);
        nextBtn.classList.add("disabled");
        nextBtn.removeEventListener("click", next);
    }
}


/*
    =========================================
    Dark and Light Mode
    =========================================
*/
const body = document.querySelector("body");
const darkBtn = document.querySelector("#dark");
const lightBtn = document.querySelector("#light");
function changeMode() {
    if(body.className === "light") {
        localStorage.setItem("userMode", "dark");
        body.className = ("dark");
        lightBtn.classList.remove("hide");
        darkBtn.classList.add("hide");
    } else {
        localStorage.setItem("userMode", "light");
        body.className = ("light");
        darkBtn.classList.remove("hide");
        lightBtn.classList.add("hide");
    }
}
darkBtn.addEventListener("click", changeMode);
lightBtn.addEventListener("click", changeMode);

function checkMode() {
    if(localStorage.userMode === "undefined") {
        localStorage.setItem("userMode", "light");
    }
    let userMode = localStorage.userMode;

    if(userMode !== body.className) {
        changeMode();
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

checkMode();
