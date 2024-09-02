const { GameBoard } = require('./gameBoard');
const { Player } = require('./player');
const { DomManager } = require('./domManager');
//DISABLE TILES ON THE BOARD WITH CSS CLASSES
const player1 = new Player('player1', 'grid-1', true);
const player2 = new Player('player2', 'grid-2', false);

let domManager1 = new DomManager(player1);
let domManager2 = new DomManager(player2);
domManager1.renderBoard();
domManager2.renderBoard();

function startGame() {
    // initial setup function (where board is set up initially)
    initialSetup();
    playGame();
}

function initialSetup() {
    // in this funciton we will
    // 1) render the initial board
    // 2) placed pieces on the board
    // 3) render that too
    // 1)
    // domManager1.renderBoard();
    // domManager2.renderBoard();
}
function playGame() {
    // this function will handle the attack gameplay loop
    // assume player2 is a bot
    const enemyBoard = document.querySelector('#grid-2');
    enemyBoard.addEventListener('click', (event) => {
        // first the player attacks the bot
        const tile = event.target;
        //1) we attack the tile
        ///////////////////////////////////
        if (
            // due to dom event propagation. clicked class is sometimes applied to grid
            // this if statement prevents that
            !tile.classList.contains('tile') ||
            tile.classList.contains('clicked')
        )
            return;
        /////////////////////////////////////
        tile.classList.add('clicked'); // this makes the entire grid unclickable, not just the tile

        [y, x] = getTileCoordinates(tile);
        player2.gameBoard.receiveAttack(x, y);
        domManager2.updateBoard();
        // 2) we check if attacker has won
        if (player2.gameBoard.shipsSunk()) {
            // end the game
            // create method in domManager() to display end screen
        }

        // 3) we let the bot attack, then check if the bot has won. If so, end the game
        // if
        //      1) ask bot for attack coords
        //      2) check if those coords have been hit already
        //                  if already hit, choose different coords
        //                  if not already hit, then hit

        player1.botAttack();
        domManager1.updateBoard();
        if (player1.gameBoard.shipsSunk()) {
            // end game bot wins
        }
    });
    // if (!player2.ishuman) {
    // }
}

// returns the coordinates of a tile given the tile itself
function getTileCoordinates(tile) {
    console.log(tile);
    const [i, j] = tile.id.split('-').pop().split('');
    console.log(tile.id);
    console.log([parseInt(i, 10), parseInt(j, 10)]);
    return [parseInt(i, 10), parseInt(j, 10)];
}

// function generateCoords() {
//     const randomX = Math.floor(Math.random() * 10);
//     const randomY = Math.floor(Math.random() * 10);
//     return [randomX, randomY];
// }

module.exports = { startGame };
