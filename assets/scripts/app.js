const header = document.querySelector("#current");
const cells = document.querySelectorAll(".cell");
for(let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", setMark);
}

let currentPlayer = "X";
const boardStates = [
    [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
];

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

        //Get most recent state of the board
        const board = boardStates[boardStates.length - 1];

        const index = Array.from(cells).indexOf(this);
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
        
        playerTurn();
    }
}

function playerTurn() {
    changePlayer();
    header.textContent = currentPlayer + "'s Turn";
}

header.textContent = currentPlayer + "'s Turn";