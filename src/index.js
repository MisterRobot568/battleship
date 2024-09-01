const { Player } = require('./player');
const { DomManager } = require('./domManager');
// 1 try to put pieces on the board
console.log('testing');
// 1) create the pieces, id the pieces, populate the pieces with 0s

const player1 = new Player('player1', 'grid-1');
console.log(player1.gridID);
// const player2 = new Player('player2', 'grid-2');

const domManager1 = new DomManager(player1);
domManager1.printTest();
domManager1.renderBoard();
player1.gameBoard.placeShip('test', 2, 2, 3, true);
domManager1.updateBoard();
// player1.renderBoard();
// player1.updateBoard();

// player2.gameBoard.placeShip('test', 2, 2, 3, true);
// player2.renderBoard();

// player2.createEventListeners();
// player2.removeListeners();
// player2.createEventListeners();

// let gameOver = false;
// let playerTurn = true;

// 1) maybe start with attacking
//    in order to attack when my mouse is, i need an event listener for every enemy
//    tile to determine when a tile is clicked
//    put event listeners in this module? Or put them in player module?
// 1) let's try this module

// 2) then place pieces

// event listeners
// CREATE ANOTHER MODULE/CLASS/WHATEVER RESPONSIBLE FOR DOM MANIPULATION HERE
// WE'LL HAVE TO TRANSLOCATE DOM METHODS IN PLAYER TO HERE
// Event driven approach like chatgpt says:
function createEventListeners(player) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let currentTile = document.querySelector(
                `#${player.gridID}-tile-${i}${j}`
            );

            if (currentTile.classList.contains('clicked')) {
                continue;
            }
            currentTile.addEventListener('click', player.handleClick);
        }
    }
}

function removeListeners(player) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let currentTile = document.querySelector(
                `#${player.gridID}-tile-${i}${j}`
            );
            currentTile.removeEventListener('click', player.handleClick);
        }
    }
}

// while (!gameOver) {
//     //We run the game inside of this loop.
//     // Need to find a way to trigger playerTurn based on click event listener
//     // Do we need to put event listeners/ dom manipulation here instead?\

//     if (playerTurn) {
//     }
// }
