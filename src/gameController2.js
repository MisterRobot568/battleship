const { GameBoard } = require('./gameBoard');
const { Player } = require('./player');
const { DomManager } = require('./domManager');

function startGame() {
    let currentPlayer;
    //here we add the functions that trigger the start of the game
    let player1 = new Player('player1', 'grid-1', true);
    let player2 = new Player('player2', 'grid-2', true);
    let domManager1 = new DomManager(player1);
    let domManager2 = new DomManager(player2);

    currentPlayer = player2;
    // render initial boards
    // initializeBoards(domManager1, domManager2);
    domManager1.renderBoard();
    domManager2.renderBoard();

    // startAttackLoop(player2, domManager2);
    createEventListeners(currentPlayer, domManager2);
}

// this function inializes the boards
// function initializeBoards(domManager1, domManager2) {
//     domManager1.renderBoard();
//     domManager2.renderBoard();
// }

//this function updates the boards
// function updateBoards(domManager1, domManager2) {
//     domManager1.updateBoard();
//     domManager2.updateBoard();
// }

function startAttackLoop(startingPlayer, domManager) {
    // this function will start the back and forth attack loop
    createEventListeners(startingPlayer, domManager);
}

function getTileCoordinates(tile) {
    console.log(tile);
    const [i, j] = tile.id.split('-').pop().split('');
    console.log(tile.id);
    console.log([parseInt(i, 10), parseInt(j, 10)]);
    return [parseInt(i, 10), parseInt(j, 10)];
}
// create all event listeners for player
function createEventListeners(player, domManager) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let currentTile = document.querySelector(
                `#${player.gridID}-tile-${i}${j}`
            );
            // if tile has already been clicked, skip it
            if (currentTile.classList.contains('clicked')) {
                continue;
            }

            // define a function reference on the tile for later removal
            function handleTileClick(event) {
                handleClick(event, player, domManager);
            }
            currentTile.addEventListener('click', handleTileClick);

            // store the handler function reference on the tile for later removal
            currentTile.handleTileClick = handleTileClick;
        }
    }
}
// remove all event listeners for player
function removeAllListeners(player, domManager) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let currentTile = document.querySelector(
                `#${player.gridID}-tile-${i}${j}`
            );
            if (currentTile.handleTileClick) {
                currentTile.removeEventListener(
                    'click',
                    currentTile.handleTileClick
                );
                delete currentTile.handleTileClick;
            }
        }
    }
}

// handle when an event listener is clicked
function handleClick(event, player, domManager) {
    // if a tile is clicked i want to:
    // 1) attack that tile
    // 2) check if game has ended
    // 3) if game has not ended, swap trigger the other player to move
    // 4)
    // this function needs access to the player objects
    const currentTile = event.currentTarget;
    console.log(currentTile.id);

    const [i, j] = getTileCoordinates(currentTile);
    player.gameBoard.receiveAttack(j, i);

    currentTile.classList.add('clicked');

    currentTile.removeEventListener('click', currentTile.handleTileClick);
    delete currentTile.handleTileClick;
    // TOGGLE PLAYER TURN HERE (after a successful move?)

    // this.updateBoard();
    domManager.updateBoard();
    swapPlayerTurn(player);
    // updateBoards(domManager1, domManager2);
}
function swapPlayerTurn(player) {
    if (player === player1) {
        currentPlayer = player2;
        removeAllListeners(player1);
        createEventListeners(player2, domManager2);
    } else {
        currentPlayer = player1;
        removeAllListeners(player2);
        createEventListeners(player1, domManager1);
    }
}

module.exports = { startGame };
