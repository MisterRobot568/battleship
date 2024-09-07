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
    playerSetupBoard();
}

function initialSetup() {
    // in this funciton we will
    // 1) render the initial board
    // 2) placed pieces on the board
    // 3) render that too
    // 1)
    // domManager1.renderBoard();
    // domManager2.renderBoard();

    //give the bot a random setup
    player2.gameBoard.generateRandomSetup();
    domManager2.updateBoard();

    //player gets a random setup for testing
    // player1.gameBoard.generateRandomSetup();
    // domManager1.updateBoard();
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
        // 2) we check if player has won
        if (player2.gameBoard.shipsSunk()) {
            // end the game
            // create method in domManager() to display end screen
            console.log('player1 wins'); // WIN TRIGGERS PROPERLY
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
            console.log('bot wins');
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
const playerBoard = document.querySelector('#grid-1');
const ships = player1.gameBoard.ships;
let currentShipIndex = 0;
let on_board_array = [];
function playerSetupBoard() {
    // do we create another seperate overlay
    // 1) create modal with gameboard
    // 2) allow user to click on modal to add ships
    // 3) once all ships are there, map those ships onto the player board
    // 4) get rid of the modal
    //modal testing // do we need a modal for this?
    // let modalButton = document.querySelector('#modal-button');
    // modalButton.addEventListener('click', () => {
    //     let modal = document.querySelector('#modal');
    //     modal.style.display = 'none';
    // });
    // 1) create event listener for player board. Will listen for:
    //      1)Hover - place ships on board while hovered
    //      2)Mouse out effect- Delete ships from board when mouse away
    //      3)Click - Actually place on board if clicked (and valid spot)
    // const playerBoard = document.querySelector('#grid-1');
    // const ships = player1.gameBoard.ships;
    // let currentShipIndex = 0;
    ////////////////////////////////// THESE EVENT LISTENERS WORK//
    // playerBoard.addEventListener('mouseover', (event) => {
    //     const tile = event.target;
    //     // If we hover over targets inside the grid, first we make sure that
    //     // the object is a tile, next we do stuff with it
    //     if (tile.classList.contains('tile')) {
    //         // 1) get coordinates of the hovered tile
    //         // 2) use those coordinates to placeShip() on gameBoard
    //         // 3) rerender board based on new gameBoard
    //         // tile.style.backgroundColor = 'black';
    //         [y, x] = getTileCoordinates(tile);
    //         player1.gameBoard.placeShip('Patrol', x, y, 2, true);
    //         domManager1.updateBoard();
    //     }
    // });
    // playerBoard.addEventListener('mouseout', (event) => {
    //     const tile = event.target;
    //     if (tile.classList.contains('tile')) {
    //         // 1) get coordinates of the hovered tile
    //         // 2) use those coordinates to placeShip() on gameBoard
    //         // 3) rerender board based on new gameBoard
    //         // tile.style.backgroundColor = 'black';
    //         [y, x] = getTileCoordinates(tile);
    //         player1.gameBoard.deleteShip(x, y, 2, true);
    //         domManager1.updateBoard();
    //     }
    // });
    ///////////////////////////////////////////////////
    // PROBLEM: MOUSEOUT DELETES ANYTHING FROM THE BOARD
    // SOLUTION: CREATE AN ARRAY OF PLACED SHIPS, ADD SHIP TO ARRAY ONCE SHIP IS PLACED
    //           IF ARRAY CONTAINS CURRENTSHIP, THEN MOUSEOUT DOESN'T WORK
    //NOW we know how to temporarily place
    placeShipEventListeners();
}
// here is an alternate version of what i'm doing above
function handleMouseOver(event) {
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        //makes sure we're on a tile and in between
        const [y, x] = getTileCoordinates(tile);
        const currentShip = ships[currentShipIndex];

        if (tile.classList.contains('ship')) {
            // if ship is already there, do nothing
            return;
        } else {
            player1.gameBoard.placeShip(
                currentShip[0],
                x,
                y,
                currentShip[1],
                currentShip[2]
            );
            domManager1.updateBoard();
        }
    }
}
function handleMouseOut(event) {
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        //makes sure we're on a tile and not in between

        // if (on_board_array.contains[currentShip[0]]) {
        //     return;
        // }
        if (tile.classList.contains('ship')) {
            return;
        } else {
            const [y, x] = getTileCoordinates(tile);
            const currentShip = ships[currentShipIndex];
            // Remove ship preview
            player1.gameBoard.deleteShip(
                currentShip[0],
                x,
                y,
                currentShip[1],
                currentShip[2]
            );
            domManager1.updateBoard();
        }
        // PROBLEM: we have made it so that .deleteShip will ignore a ship where
        //          our cursor is, but delete parts of the ship where our cursor is
        //          is not
        // SOLUTION:
    }
}

// THIS NEEDS TO MAKE THE SHIP STAY WHERE WE'RE HOVERED
// NOW THAT SHIPS STAY WHILE THEY'RE HOVERED, WE NEED TO TURN EVENT LISTENERS BACK ON
// BUT ALSO NOT AFFECT THE BOATS THAT ARE ALREADY ON THE BOARD
// CREATE AN ARRAY THAT CONTAINS THE BOATS THAT ARE ALREADY ON THE BOARD
function handleMouseClick(event) {
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        // deactive hover effects when clicked
        playerBoard.removeEventListener('mouseover', handleMouseOver);
        playerBoard.removeEventListener('mouseout', handleMouseOut);

        const [y, x] = getTileCoordinates(tile);
        const currentShip = ships[currentShipIndex];
        on_board_array.push(currentShip[0]);

        // player1.gameBoard.placeShip(
        //     currentShip[0],
        //     x,
        //     y,
        //     currentShip[1],
        //     currentShip[2]
        // );
        domManager1.updateClassList();
        // this will add the current

        domManager1.updateBoard();

        currentShipIndex++;

        if (currentShipIndex >= ships.length) {
            removeEventListeners();
        } else {
            // Re-activate hover effects for the next ship
            playerBoard.addEventListener('mouseover', handleMouseOver);
            playerBoard.addEventListener('mouseout', handleMouseOut);
        }
    }
}
function placeShipEventListeners() {
    playerBoard.addEventListener('mouseover', handleMouseOver);
    playerBoard.addEventListener('mouseout', handleMouseOut);
    playerBoard.addEventListener('click', handleMouseClick);
}

function removeEventListeners() {
    playerBoard.removeEventListener('mouseover', handleMouseOver);
    playerBoard.removeEventListener('mouseout', handleMouseOut);
    playerBoard.removeEventListener('click', handleMouseClick);
    console.log('All ships placed. Event listeners removed.');
}

// function generateCoords() {
//     const randomX = Math.floor(Math.random() * 10);
//     const randomY = Math.floor(Math.random() * 10);
//     return [randomX, randomY];
// }

module.exports = { startGame };
