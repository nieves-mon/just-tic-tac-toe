const cells = document.querySelectorAll(".cell");
for(let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", setMark);
}

let currentPlayer = "X";

function setMark() {
    const span = this.childNodes[1];

    if(span.classList.length === 1) {
        span.classList.add("fa-solid");

        if(currentPlayer === "X") {
            span.classList.add("fa-xmark");
            currentPlayer = "O";
        } else {
            span.classList.add("fa-o");
            currentPlayer = "X";
        }
    }
}