const { Player } = require('./player');
// 1 try to put pieces on the board
console.log('testing');
// 1) create the pieces, id the pieces, populate the pieces with 0s

const player1 = new Player('player1', 'grid-1');
const player2 = new Player('player2', 'grid-2');

player1.renderBoard();
player1.updateBoard();

player2.gameBoard.placeShip('test', 2, 2, 3, true);
player2.renderBoard();

player2.createEventListeners();
player2.removeListeners();

let gameOver = false;

// 1) maybe start with attacking
//    in order to attack when my mouse is, i need an event listener for every enemy
//    tile to determine when a tile is clicked
//    put event listeners in this module? Or put them in player module?
// 1) let's try this module

// 2) then place pieces

// event listener
// while (!gameOver) {

// }
