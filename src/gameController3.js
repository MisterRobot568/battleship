const { GameBoard } = require('./gameBoard');
const { Player } = require('./player');
const { DomManager } = require('./domManager');
//DISABLE TILES ON THE BOARD WITH CSS CLASSES
let player1 = new Player('player1', 'grid-1', true);
let player2 = new Player('player2', 'grid-2', false);

let domManager1 = new DomManager(player1);
let domManager2 = new DomManager(player2);
domManager1.renderBoard();
domManager2.renderBoard();
let shipOrientation = false;
let placeAble = false;
let rotateBtn = document.querySelector('#rotate-btn');
// placeAble is a global variabletells us whether or not we can place
// a piece on a board

function startGame() {
    // initial setup function (where board is set up initially)
    let resetGameBtn = document.querySelector('#reset-btn');
    let modalResetGameBtn = document.querySelector('#modal-button');
    resetGameBtn.addEventListener('click', () => {
        location.reload();
    });
    modalResetGameBtn.addEventListener('click', () => {
        // resetGame();
        // let modal = document.querySelector('#modal');
        // modal.style.display = 'none';
        location.reload();
    });
    botSetup();
    playerSetup();
}

function rotateShip() {
    // swaps the orienation of the ship player is trying to place
    shipOrientation = shipOrientation ? false : true;
}

function botSetup() {
    // this function will setup the bot's board

    player2.generateRandomSetup(); //////////////////////////////////////
    domManager2.updateBoard();
}
function attackLoop() {
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
        // 2) we check if player has won
        if (player2.gameBoard.shipsSunk()) {
            // PLAYER WIN CONDITION
            domManager1.announceWinner();
        }

        player1.botAttack();
        domManager1.updateBoard();
        // check if bot has won
        if (player1.gameBoard.shipsSunk()) {
            // BOT WIN CONDITION
            domManager2.announceWinner();
        }
    });
}

// returns the coordinates of a tile given the tile itself
function getTileCoordinates(tile) {
    const [i, j] = tile.id.split('-').pop().split('');
    return [parseInt(i, 10), parseInt(j, 10)];
}

// these variables probably should be inside of something
let playerBoard = document.querySelector('#grid-1');
let ships = player1.gameBoard.ships;
let currentShipIndex = 0;
let on_board_array = [];

function playerSetup() {
    placeShipEventListeners();
}
// here is an alternate version of what i'm doing above
function handleMouseOver(event) {
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        //makes sure we're on a tile and in between
        const [y, x] = getTileCoordinates(tile);
        const currentShip = ships[currentShipIndex];

        try {
            // if hovering a ship gives us an error, then don't
            player1.gameBoard.placeShip(
                currentShip[0],
                x,
                y,
                currentShip[1],
                shipOrientation
            );
            domManager1.updateBoard();
            placeAble = true;
        } catch (error) {
            placeAble = false;
            return;
        }
    }
}
// }
function handleMouseOut(event) {
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        //makes sure we're on a tile and not in between

        if (tile.classList.contains('ship')) {
            // if we're hovering an already placed(clicked) ship, skip
            return;
        } else {
            const [y, x] = getTileCoordinates(tile);
            const currentShip = ships[currentShipIndex];
            // Remove ship preview
            if (~placeAble) {
                player1.gameBoard.deleteShip(
                    currentShip[0],
                    x,
                    y,
                    currentShip[1],
                    shipOrientation
                );
                domManager1.updateBoard();
            }
        }
    }
}

// THIS NEEDS TO MAKE THE SHIP STAY WHERE WE'RE HOVERED
// NOW THAT SHIPS STAY WHILE THEY'RE HOVERED, WE NEED TO TURN EVENT LISTENERS BACK ON
// BUT ALSO NOT AFFECT THE BOATS THAT ARE ALREADY ON THE BOARD
// CREATE AN ARRAY THAT CONTAINS THE BOATS THAT ARE ALREADY ON THE BOARD
function handleMouseClick(event) {
    // IF PLACING A SHIP WOULD TRIGGER AN ERROR, WE JUST RETURN
    // IF SHIP NOT ACTUALLY PLACED, THEN WE DON'T REACT TO CLICK
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        // deactive hover and unhover listener when clicked
        if (placeAble) {
            playerBoard.removeEventListener('mouseover', handleMouseOver);
            playerBoard.removeEventListener('mouseout', handleMouseOut);

            const currentShip = ships[currentShipIndex];
            on_board_array.push(currentShip[0]);

            domManager1.updateClassList();
            // this will add the current

            domManager1.updateBoard();

            currentShipIndex++;

            if (currentShipIndex >= ships.length) {
                // if we've run out of ships, remove event listeners
                removeEventListeners();
            } else {
                // Re-activate hover effects for the next ship
                playerBoard.addEventListener('mouseover', handleMouseOver);
                playerBoard.addEventListener('mouseout', handleMouseOut);
            }
            placeAble = false;
        } else {
            return;
        }
    }
    // }
}
function placeShipEventListeners() {
    playerBoard.addEventListener('mouseover', handleMouseOver);
    playerBoard.addEventListener('mouseout', handleMouseOut);
    playerBoard.addEventListener('click', handleMouseClick);
    rotateBtn.addEventListener('click', rotateShip);
}

function removeEventListeners() {
    playerBoard.removeEventListener('mouseover', handleMouseOver);
    playerBoard.removeEventListener('mouseout', handleMouseOut);
    playerBoard.removeEventListener('click', handleMouseClick);
    rotateBtn.removeEventListener('click', rotateShip);
    attackLoop(); // attack loop starts after player places all pieces
}

module.exports = { startGame };
