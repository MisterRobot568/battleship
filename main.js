/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/domManager.js":
/*!***************************!*\
  !*** ./src/domManager.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Player } = __webpack_require__(/*! ./player */ "./src/player.js");
// this class takes a player object and renders/updates their on screen/board
// should it be more general? Should it only take a player ID and have the same functionality?

//What do we actually need from the player? It's ID maybe? so we can find the ID
class DomManager {
    constructor(player) {
        this.player = player;
        this.boardHTML = document.querySelector(`#${player.gridID}`);
        this.gridID = this.player.gridID;
        // console.log(this.player.gridID);
        // this.gridID = playerGridID;
    }
    printTest() {
        // console.log(this.gridID);
        console.log(this.player.gridID);
    }
    renderBoard() {
        // const boardHTML = document.querySelector(`#${this.gridID}`);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const newTile = document.createElement('div');
                newTile.setAttribute('class', 'tile');
                newTile.setAttribute('id', `${this.gridID}-tile-${i}${j}`);
                newTile.style.backgroundColor = 'lightblue';

                let newTextContent = this.player.gameBoard.board[i][j];

                newTile.textContent = newTextContent;
                newTile.style.color = 'transparent';
                // if (typeof newTextContent === 'string') {
                //     newTile.classList.add('ship');
                // }

                this.boardHTML.appendChild(newTile);
            }
        }
    }
    updateBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.player.gridID}-tile-${i}${j}`
                );
                let newTextContent = this.player.gameBoard.board[i][j];
                // handles colors of the board if player is human
                if (this.player.isHuman) {
                    if (typeof newTextContent === 'string') {
                        currentTile.style.backgroundColor = 'green';
                    }
                    if (newTextContent === 0) {
                        currentTile.style.backgroundColor = 'lightblue';
                    }
                }
                // handles colors of the board when it is hit
                if (newTextContent === 2) {
                    currentTile.style.backgroundColor = 'red';
                }
                if (newTextContent === 3) {
                    currentTile.style.backgroundColor = 'gray';
                }
                currentTile.textContent = this.player.gameBoard.board[i][j];
            }
        }
    }
    clearBoard() {
        // should i straight up delete the board for reset?
        this.boardHTML.innerHTML = '';
    }
    updateClassList() {
        // the purpose of this method is so that when a player is putting ships on the
        // board, it add a 'ship' class to the tiles where the ships are
        // that way we can differentiate between a 'hovered' ship and a 'clicked' ship
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.player.gridID}-tile-${i}${j}`
                );
                let tileTextContent = this.player.gameBoard.board[i][j];
                // currentTile.textContent = this.player.gameBoard.board[i][j];
                currentTile.textContent = tileTextContent;
                if (typeof tileTextContent === 'string') {
                    currentTile.classList.add('ship');
                }
            }
        }
    }

    announceWinner() {
        // this method will create a screen for whoever won the game at the end
        // probably with a button to play again
        const modal = document.querySelector('#modal');
        const modalTitle = document.querySelector('#modal-title');
        const modalParagraph = document.querySelector('#modal-paragraph');

        let titleMessage = this.player.isHuman
            ? 'Human wins'
            : 'Machine supremacy';
        let modalParagraphMessage = `${this.player.playerID} wins`;

        modalTitle.textContent = titleMessage;
        modalParagraph.textContent = modalParagraphMessage;
        modal.style.display = 'flex';
    }
}

module.exports = { DomManager };


/***/ }),

/***/ "./src/gameBoard.js":
/*!**************************!*\
  !*** ./src/gameBoard.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Ship } = __webpack_require__(/*! ./ship */ "./src/ship.js");
class GameBoard {
    constructor() {
        this.board = [
            // 0 = water
            // shipName = ship
            // 2 = hit
            // 3 = miss
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        // use an object to store the ships?
        // this.shipsObj = {};
        this.shipsMap = new Map();

        this.ships = [
            // [shipname, length, horizontal or not]
            ['Carrier', 5, true],
            ['Battleship', 4, false],
            ['Destroyer', 3, true],
            ['Submarine', 3, true],
            ['Patrol Boat', 2, false],
        ];
    }
    // should be able to place ships at specific coords by calling the ship class
    // need to make sure ship is placed on valid coords, not outside the board
    // place ships horizontally or vertically

    // is placeship given one set of coordinates? or is given a Z number of coords
    // based on Z length of a ship?
    placeShip(shipName, x, y, length, horizontal) {
        ////////////////////////////////////////
        // places pieces on board based on original coords, and
        // horizontal/vertical
        // we need to:
        // 1) make sure the piece will not flow off of the board
        // 2) make sure the piece isn't being placed on top of another piece
        //////////////////////////////////////
        let ship = new Ship(shipName, length);
        for (let i = 0; i < length; i++) {
            const posX = horizontal ? x + i : x;
            const posY = horizontal ? y : y + i;
            if (posX < 0 || posY < 0 || posX > 9 || posY > 9) {
                throw new Error('Ship flowing off the board error');
            }
            // if no piece is already in that space
            if (this.board[posY][posX] === 0) {
                this.board[posY][posX] = shipName;

                // if ship is not already in the map datastructure, add it
                if (!this.shipsMap.has(shipName)) {
                    this.shipsMap.set(shipName, ship);
                }
                // add associated coordinates to the ship's map data structure
                // this.shipsMap.get(ship).push({ x: posX, y: posY });
            } else {
                throw new Error('Overlapping ships error');
            }
        }
    }

    deleteShip(shipName, x, y, length, horizontal) {
        // need method to delete a ship so that we can drag/drop place ships
        // This method will delete a ship if it maches the name inputted
        for (let i = 0; i < length; i++) {
            const posX = horizontal ? x + i : x;
            const posY = horizontal ? y : y + i;
            if (posX < 0 || posY < 0 || posX > 9 || posY > 9) {
                // can only delete within the bounds of the board
                continue;
            }
            if (this.board[posY][posX] === shipName) {
                this.board[posY][posX] = 0;
            }
            // this.board[posY][posX] = 0;
        }
    }

    clearBoard() {
        // this method will clear the gameboard
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.shipsMap = new Map();
    }

    // how should we record coords of missed shot? just on the map board itself or
    // in a datastructure?

    // don't allow attacks if it has already been attacked
    receiveAttack(x, y) {
        let target = this.board[y][x];

        if (typeof target === 'string') {
            // add a hit to the boat and change map
            let currentShip = this.shipsMap.get(target);
            currentShip.hit();
            currentShip.isSunk();
            this.board[y][x] = 2;
        }
        if (target === 0) {
            this.board[y][x] = 3;
            // maybe add this coord to a datastructure later?
        }
        if (target === 2) {
            throw new Error('ship has already been hit here');
        }
        if (target === 3) {
            throw new Error('target has already been missed here');
        }
    }

    shipsSunk() {
        for (const [shipName, shipDetails] of this.shipsMap) {
            // if any ship is not sunk, return false
            if (!shipDetails.sunk) {
                return false;
            }
        }
        // if all ships sunk, return true
        return true;
    }
}

module.exports = { GameBoard };


/***/ }),

/***/ "./src/gameController.js":
/*!*******************************!*\
  !*** ./src/gameController.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { GameBoard } = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
const { Player } = __webpack_require__(/*! ./player */ "./src/player.js");
const { DomManager } = __webpack_require__(/*! ./domManager */ "./src/domManager.js");

// accepts two player objects as input and runs the game
class GameController {
    constructor(player1, player2) {
        this.player1 = new Player(player1, player1);
        this.player2 = new Player(player2, player2);
        this.domManager1 = new DomManager(player1);
        this.domManager2 = new DomManager(player2);
        this.player1Turn = true;
        this.gameOver = false;
    }

    startGame() {
        // in order to start the game what do we need to do?

        //attacking/taking turns
        if (this.player1Turn) {
            this.creatEventListeners(this.player1);
            // player1 stuff
        } else {
            // player2 stuff
        }
    }
    getTileCoordinates(tile) {
        console.log(tile);
        const [i, j] = tile.id.split('-').pop().split('');
        console.log(tile.id);
        console.log([parseInt(i, 10), parseInt(j, 10)]);
        return [parseInt(i, 10), parseInt(j, 10)];
    }

    createEventListeners(player) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${player.gridID}-tile-${i}${j}`
                );

                if (currentTile.classList.contains('clicked')) {
                    continue;
                }
                currentTile.addEventListener('click', (event) => {
                    handleClick(event, player);
                });
            }
        }
    }
    removeListeners(player) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.gridID}-tile-${i}${j}`
                );
                currentTile.removeEventListener('click', (event) => {
                    handleClick(event, player);
                });
            }
        }
    }

    handleClick(event, player) {
        const currentTile = event.currentTarget;
        console.log(currentTile.id);

        const [a, b] = currentTile.id.split('-').pop().split('');
        console.log(typeof a);
        console.log(b);
        // let [i, j] = [parseInt(a, 10), parseInt(b, 10)];
        // console.log(i);
        // console.log(typeof i);
        const [i, j] = getTileCoordinates(currentTile);
        console.log(player.gameBoard);
        player.gameBoard.receiveAttack(j, i);

        currentTile.classList.add('clicked');

        currentTile.removeEventListener('click', (event) => {
            this.handleClick(event, player);
        });
        // TOGGLE PLAYER TURN HERE (after a successful move?)

        this.updateBoard();
    }
}

module.exports = { GameController };


/***/ }),

/***/ "./src/gameController3.js":
/*!********************************!*\
  !*** ./src/gameController3.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { GameBoard } = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
const { Player } = __webpack_require__(/*! ./player */ "./src/player.js");
const { DomManager } = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
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
    // initialSetup();
    // attackLoop();
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
function resetGame() {
    // clear the boards of the players
    domManager1.clearBoard();
    domManager2.clearBoard();

    // reset players
    player1 = new Player('player1', 'grid-1', true);
    player2 = new Player('player2', 'grid-2', false);

    //reset player doms
    domManager1 = new DomManager(player1);
    domManager2 = new DomManager(player2);

    // render new boards
    domManager1.renderBoard();
    domManager2.renderBoard();

    // reset vars associated with event listeners
    playerBoard = document.querySelector('#grid-1');
    ships = player1.gameBoard.ships;
    currentShipIndex = 0;
    on_board_array = [];
    placeAble = false;

    startGame();
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
            console.log('player1 wins'); // WIN TRIGGERS PROPERLY
            domManager1.announceWinner();
        }

        player1.botAttack();
        domManager1.updateBoard();
        // check if bot has won
        console.log(player1.gameBoard.shipsSunk());
        if (player1.gameBoard.shipsSunk()) {
            // BOT WIN CONDITION
            console.log('bot wins');
            domManager2.announceWinner();
        }
    });
}

// returns the coordinates of a tile given the tile itself
function getTileCoordinates(tile) {
    console.log(tile);
    const [i, j] = tile.id.split('-').pop().split('');
    console.log(tile.id);
    console.log([parseInt(i, 10), parseInt(j, 10)]);
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
        // placeAble = true;
        //makes sure we're on a tile and in between
        const [y, x] = getTileCoordinates(tile);
        const currentShip = ships[currentShipIndex];

        // if (tile.classList.contains('ship')) {
        //     // if ship is already there, do nothing
        //     // if ship would be placed out of bounds, do nothing
        //     return;
        // } else {
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

        // if (on_board_array.contains[currentShip[0]]) {
        //     return;
        // }
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
    // IF PLACING A SHIP WOULD TRIGGER AN ERROR, WE JUST RETURN
    // IF SHIP NOT ACTUALLY PLACED, THEN WE DON'T REACT TO CLICK
    const tile = event.target;
    if (tile.classList.contains('tile')) {
        // deactive hover effects when clicked
        // if (~tile.classList.contains('ship')) {
        //     return;
        // } else {
        if (placeAble) {
            playerBoard.removeEventListener('mouseover', handleMouseOver);
            playerBoard.removeEventListener('mouseout', handleMouseOut);

            // const [y, x] = getTileCoordinates(tile);
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
    console.log(
        'All ships placed. Event listeners removed. AttackLoop() called'
    );
}

module.exports = { startGame };


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { GameBoard } = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
// import GameBoard from './gameBoard.js';
class Player {
    // there will be two types of players. Real players and computer players
    constructor(playerID, gridID, isHuman) {
        this.gameBoard = new GameBoard();
        this.playerID = playerID;
        this.gridID = gridID;
        this.boardHTML = document.querySelector(`#${this.gridID}`);
        this.ships = [
            ['Carrier', 5, true],
            ['Battleship', 4, false],
            ['Destroyer', 3, true],
            ['Submarine', 3, true],
            ['Patrol Boat', 2, false],
        ];

        // bind handleclick method to the instance of the player classoka
        // this.handleClick = this.handleClick.bind(this);
        this.myTurn = false; // don't need?
        this.isHuman = isHuman; // don't need?
    }

    botAttack() {
        // this method makes the bot choose a spot and attack it on the board
        // need to make this more sophisticated
        function generateCoords(gameBoard_board) {
            const randomX = Math.floor(Math.random() * 10);
            const randomY = Math.floor(Math.random() * 10);
            if (
                gameBoard_board[randomX][randomY] === 2 ||
                gameBoard_board[randomX][randomY] === 3
            ) {
                // if gameBoard has already been hit here, then generate new coords
                return generateCoords(gameBoard_board);
            } else {
                //otherwise, return these coords to attack
                return [randomX, randomY];
            }
        }
        let [xCoord, yCoord] = generateCoords(this.gameBoard.board);
        // if (this.gameBoard.board[xCoord][yCoord]) {
        //     [xCoord, yCoord] = generateCoords();
        // }
        this.gameBoard.receiveAttack(yCoord, xCoord);
    }

    generateRandomSetup() {
        // given a list of ships, generate a random setup for them
        let ships = this.ships;
        let gameBoard = this.gameBoard;
        for (let i = 0; i < ships.length; i++) {
            // let {name, length} = ships[i]
            // placeShipRandomly(ships[i][0], ships[i][1], ships[i][2]);
            placeShipRandomly(ships[i][0], ships[i][1], ships[i][2], gameBoard);
            //UNDERSTAND WHY WE'RE USING "CALL" and "THIS" HERE
        }
        function placeShipRandomly(shipName, length, horizontal, gameBoard) {
            const randomX = Math.floor(Math.random() * 10);
            const randomY = Math.floor(Math.random() * 10);
            try {
                gameBoard.placeShip(
                    shipName,
                    randomX,
                    randomY,
                    length,
                    horizontal
                );
            } catch (error) {
                // if placing ship errors, then delete what was placed
                gameBoard.deleteShip(
                    shipName,
                    randomX,
                    randomY,
                    length,
                    horizontal
                );
                // return placeShipRandomly(shipName, length, horizontal);
                placeShipRandomly(shipName, length, horizontal, gameBoard);
            }
        }
    }
}

module.exports = { Player };
// export default Player;


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((module) => {

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.timesHit = 0;
        this.sunk = false;
    }
    // hit function increases number of hits to your ship
    hit() {
        this.timesHit += 1;
    }

    // isSunk() calculates whether a ship is considered sunk based on it's length and numhits it has received
    isSunk() {
        if (this.timesHit >= this.length) {
            this.sunk = true;
        }
    }
}

module.exports = { Ship };


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const { Player } = __webpack_require__(/*! ./player */ "./src/player.js");
const { DomManager } = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
const { GameController } = __webpack_require__(/*! ./gameController */ "./src/gameController.js");
const { startGame } = __webpack_require__(/*! ./gameController3 */ "./src/gameController3.js");

// 1 try to put pieces on the board
// console.log('testing');
// 1) create the pieces, id the pieces, populate the pieces with 0s
startGame();
// let game = new GameController('player1', 'player2');
// game.startGame();
// const player1 = new Player('player1', 'grid-1');
// console.log(player1.gridID);
// // const player2 = new Player('player2', 'grid-2');

// const domManager1 = new DomManager(player1);
// domManager1.printTest();
// domManager1.renderBoard();
// player1.gameBoard.placeShip('test', 2, 2, 3, true);
// domManager1.updateBoard();
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
// function createEventListeners(player) {
//     for (let i = 0; i < 10; i++) {
//         for (let j = 0; j < 10; j++) {
//             let currentTile = document.querySelector(
//                 `#${player.gridID}-tile-${i}${j}`
//             );

//             if (currentTile.classList.contains('clicked')) {
//                 continue;
//             }
//             currentTile.addEventListener('click', player.handleClick);
//         }
//     }
// }

// function removeListeners(player) {
//     for (let i = 0; i < 10; i++) {
//         for (let j = 0; j < 10; j++) {
//             let currentTile = document.querySelector(
//                 `#${player.gridID}-tile-${i}${j}`
//             );
//             currentTile.removeEventListener('click', player.handleClick);
//         }
//     }
// }

// while (!gameOver) {
//     //We run the game inside of this loop.
//     // Need to find a way to trigger playerTurn based on click event listener
//     // Do we need to put event listeners/ dom manipulation here instead?\

//     if (playerTurn) {
//     }
// }

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDelFuQixRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLHVDQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFlBQVk7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQyxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7Ozs7Ozs7Ozs7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1COzs7Ozs7O1VDcEJuQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsUUFBUSxTQUFTLEVBQUUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNyQyxRQUFRLGFBQWEsRUFBRSxtQkFBTyxDQUFDLHlDQUFjO0FBQzdDLFFBQVEsaUJBQWlCLEVBQUUsbUJBQU8sQ0FBQyxpREFBa0I7QUFDckQsUUFBUSxZQUFZLEVBQUUsbUJBQU8sQ0FBQyxtREFBbUI7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0EsdUJBQXVCLGNBQWMsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0EsdUJBQXVCLGNBQWMsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvZG9tTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLXRlbXBsYXRlLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLXRlbXBsYXRlLy4vc3JjL2dhbWVDb250cm9sbGVyLmpzIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvZ2FtZUNvbnRyb2xsZXIzLmpzIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLXRlbXBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBQbGF5ZXIgfSA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XG4vLyB0aGlzIGNsYXNzIHRha2VzIGEgcGxheWVyIG9iamVjdCBhbmQgcmVuZGVycy91cGRhdGVzIHRoZWlyIG9uIHNjcmVlbi9ib2FyZFxuLy8gc2hvdWxkIGl0IGJlIG1vcmUgZ2VuZXJhbD8gU2hvdWxkIGl0IG9ubHkgdGFrZSBhIHBsYXllciBJRCBhbmQgaGF2ZSB0aGUgc2FtZSBmdW5jdGlvbmFsaXR5P1xuXG4vL1doYXQgZG8gd2UgYWN0dWFsbHkgbmVlZCBmcm9tIHRoZSBwbGF5ZXI/IEl0J3MgSUQgbWF5YmU/IHNvIHdlIGNhbiBmaW5kIHRoZSBJRFxuY2xhc3MgRG9tTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IocGxheWVyKSB7XG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgICB0aGlzLmJvYXJkSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3BsYXllci5ncmlkSUR9YCk7XG4gICAgICAgIHRoaXMuZ3JpZElEID0gdGhpcy5wbGF5ZXIuZ3JpZElEO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnBsYXllci5ncmlkSUQpO1xuICAgICAgICAvLyB0aGlzLmdyaWRJRCA9IHBsYXllckdyaWRJRDtcbiAgICB9XG4gICAgcHJpbnRUZXN0KCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdyaWRJRCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheWVyLmdyaWRJRCk7XG4gICAgfVxuICAgIHJlbmRlckJvYXJkKCkge1xuICAgICAgICAvLyBjb25zdCBib2FyZEhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLmdyaWRJRH1gKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUaWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbmV3VGlsZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpbGUnKTtcbiAgICAgICAgICAgICAgICBuZXdUaWxlLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHt0aGlzLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWApO1xuICAgICAgICAgICAgICAgIG5ld1RpbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ2xpZ2h0Ymx1ZSc7XG5cbiAgICAgICAgICAgICAgICBsZXQgbmV3VGV4dENvbnRlbnQgPSB0aGlzLnBsYXllci5nYW1lQm9hcmQuYm9hcmRbaV1bal07XG5cbiAgICAgICAgICAgICAgICBuZXdUaWxlLnRleHRDb250ZW50ID0gbmV3VGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgbmV3VGlsZS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiBuZXdUZXh0Q29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbmV3VGlsZS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZEhUTUwuYXBwZW5kQ2hpbGQobmV3VGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlQm9hcmQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRUaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgYCMke3RoaXMucGxheWVyLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGxldCBuZXdUZXh0Q29udGVudCA9IHRoaXMucGxheWVyLmdhbWVCb2FyZC5ib2FyZFtpXVtqXTtcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGVzIGNvbG9ycyBvZiB0aGUgYm9hcmQgaWYgcGxheWVyIGlzIGh1bWFuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmlzSHVtYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBuZXdUZXh0Q29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdncmVlbic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1RleHRDb250ZW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnbGlnaHRibHVlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGVzIGNvbG9ycyBvZiB0aGUgYm9hcmQgd2hlbiBpdCBpcyBoaXRcbiAgICAgICAgICAgICAgICBpZiAobmV3VGV4dENvbnRlbnQgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRpbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JlZCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXdUZXh0Q29udGVudCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnZ3JheSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLnRleHRDb250ZW50ID0gdGhpcy5wbGF5ZXIuZ2FtZUJvYXJkLmJvYXJkW2ldW2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFyQm9hcmQoKSB7XG4gICAgICAgIC8vIHNob3VsZCBpIHN0cmFpZ2h0IHVwIGRlbGV0ZSB0aGUgYm9hcmQgZm9yIHJlc2V0P1xuICAgICAgICB0aGlzLmJvYXJkSFRNTC5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gICAgdXBkYXRlQ2xhc3NMaXN0KCkge1xuICAgICAgICAvLyB0aGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyBzbyB0aGF0IHdoZW4gYSBwbGF5ZXIgaXMgcHV0dGluZyBzaGlwcyBvbiB0aGVcbiAgICAgICAgLy8gYm9hcmQsIGl0IGFkZCBhICdzaGlwJyBjbGFzcyB0byB0aGUgdGlsZXMgd2hlcmUgdGhlIHNoaXBzIGFyZVxuICAgICAgICAvLyB0aGF0IHdheSB3ZSBjYW4gZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIGEgJ2hvdmVyZWQnIHNoaXAgYW5kIGEgJ2NsaWNrZWQnIHNoaXBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICBgIyR7dGhpcy5wbGF5ZXIuZ3JpZElEfS10aWxlLSR7aX0ke2p9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbGV0IHRpbGVUZXh0Q29udGVudCA9IHRoaXMucGxheWVyLmdhbWVCb2FyZC5ib2FyZFtpXVtqXTtcbiAgICAgICAgICAgICAgICAvLyBjdXJyZW50VGlsZS50ZXh0Q29udGVudCA9IHRoaXMucGxheWVyLmdhbWVCb2FyZC5ib2FyZFtpXVtqXTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS50ZXh0Q29udGVudCA9IHRpbGVUZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRpbGVUZXh0Q29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRpbGUuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFubm91bmNlV2lubmVyKCkge1xuICAgICAgICAvLyB0aGlzIG1ldGhvZCB3aWxsIGNyZWF0ZSBhIHNjcmVlbiBmb3Igd2hvZXZlciB3b24gdGhlIGdhbWUgYXQgdGhlIGVuZFxuICAgICAgICAvLyBwcm9iYWJseSB3aXRoIGEgYnV0dG9uIHRvIHBsYXkgYWdhaW5cbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwnKTtcbiAgICAgICAgY29uc3QgbW9kYWxUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC10aXRsZScpO1xuICAgICAgICBjb25zdCBtb2RhbFBhcmFncmFwaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1wYXJhZ3JhcGgnKTtcblxuICAgICAgICBsZXQgdGl0bGVNZXNzYWdlID0gdGhpcy5wbGF5ZXIuaXNIdW1hblxuICAgICAgICAgICAgPyAnSHVtYW4gd2lucydcbiAgICAgICAgICAgIDogJ01hY2hpbmUgc3VwcmVtYWN5JztcbiAgICAgICAgbGV0IG1vZGFsUGFyYWdyYXBoTWVzc2FnZSA9IGAke3RoaXMucGxheWVyLnBsYXllcklEfSB3aW5zYDtcblxuICAgICAgICBtb2RhbFRpdGxlLnRleHRDb250ZW50ID0gdGl0bGVNZXNzYWdlO1xuICAgICAgICBtb2RhbFBhcmFncmFwaC50ZXh0Q29udGVudCA9IG1vZGFsUGFyYWdyYXBoTWVzc2FnZTtcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEb21NYW5hZ2VyIH07XG4iLCJjb25zdCB7IFNoaXAgfSA9IHJlcXVpcmUoJy4vc2hpcCcpO1xuY2xhc3MgR2FtZUJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IFtcbiAgICAgICAgICAgIC8vIDAgPSB3YXRlclxuICAgICAgICAgICAgLy8gc2hpcE5hbWUgPSBzaGlwXG4gICAgICAgICAgICAvLyAyID0gaGl0XG4gICAgICAgICAgICAvLyAzID0gbWlzc1xuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBdO1xuICAgICAgICAvLyB1c2UgYW4gb2JqZWN0IHRvIHN0b3JlIHRoZSBzaGlwcz9cbiAgICAgICAgLy8gdGhpcy5zaGlwc09iaiA9IHt9O1xuICAgICAgICB0aGlzLnNoaXBzTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXG4gICAgICAgICAgICAvLyBbc2hpcG5hbWUsIGxlbmd0aCwgaG9yaXpvbnRhbCBvciBub3RdXG4gICAgICAgICAgICBbJ0NhcnJpZXInLCA1LCB0cnVlXSxcbiAgICAgICAgICAgIFsnQmF0dGxlc2hpcCcsIDQsIGZhbHNlXSxcbiAgICAgICAgICAgIFsnRGVzdHJveWVyJywgMywgdHJ1ZV0sXG4gICAgICAgICAgICBbJ1N1Ym1hcmluZScsIDMsIHRydWVdLFxuICAgICAgICAgICAgWydQYXRyb2wgQm9hdCcsIDIsIGZhbHNlXSxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gcGxhY2Ugc2hpcHMgYXQgc3BlY2lmaWMgY29vcmRzIGJ5IGNhbGxpbmcgdGhlIHNoaXAgY2xhc3NcbiAgICAvLyBuZWVkIHRvIG1ha2Ugc3VyZSBzaGlwIGlzIHBsYWNlZCBvbiB2YWxpZCBjb29yZHMsIG5vdCBvdXRzaWRlIHRoZSBib2FyZFxuICAgIC8vIHBsYWNlIHNoaXBzIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5XG5cbiAgICAvLyBpcyBwbGFjZXNoaXAgZ2l2ZW4gb25lIHNldCBvZiBjb29yZGluYXRlcz8gb3IgaXMgZ2l2ZW4gYSBaIG51bWJlciBvZiBjb29yZHNcbiAgICAvLyBiYXNlZCBvbiBaIGxlbmd0aCBvZiBhIHNoaXA/XG4gICAgcGxhY2VTaGlwKHNoaXBOYW1lLCB4LCB5LCBsZW5ndGgsIGhvcml6b250YWwpIHtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBwbGFjZXMgcGllY2VzIG9uIGJvYXJkIGJhc2VkIG9uIG9yaWdpbmFsIGNvb3JkcywgYW5kXG4gICAgICAgIC8vIGhvcml6b250YWwvdmVydGljYWxcbiAgICAgICAgLy8gd2UgbmVlZCB0bzpcbiAgICAgICAgLy8gMSkgbWFrZSBzdXJlIHRoZSBwaWVjZSB3aWxsIG5vdCBmbG93IG9mZiBvZiB0aGUgYm9hcmRcbiAgICAgICAgLy8gMikgbWFrZSBzdXJlIHRoZSBwaWVjZSBpc24ndCBiZWluZyBwbGFjZWQgb24gdG9wIG9mIGFub3RoZXIgcGllY2VcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwTmFtZSwgbGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcG9zWCA9IGhvcml6b250YWwgPyB4ICsgaSA6IHg7XG4gICAgICAgICAgICBjb25zdCBwb3NZID0gaG9yaXpvbnRhbCA/IHkgOiB5ICsgaTtcbiAgICAgICAgICAgIGlmIChwb3NYIDwgMCB8fCBwb3NZIDwgMCB8fCBwb3NYID4gOSB8fCBwb3NZID4gOSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcCBmbG93aW5nIG9mZiB0aGUgYm9hcmQgZXJyb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vIHBpZWNlIGlzIGFscmVhZHkgaW4gdGhhdCBzcGFjZVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zWV1bcG9zWF0gPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1ldW3Bvc1hdID0gc2hpcE5hbWU7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBzaGlwIGlzIG5vdCBhbHJlYWR5IGluIHRoZSBtYXAgZGF0YXN0cnVjdHVyZSwgYWRkIGl0XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBzTWFwLmhhcyhzaGlwTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwc01hcC5zZXQoc2hpcE5hbWUsIHNoaXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhZGQgYXNzb2NpYXRlZCBjb29yZGluYXRlcyB0byB0aGUgc2hpcCdzIG1hcCBkYXRhIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgIC8vIHRoaXMuc2hpcHNNYXAuZ2V0KHNoaXApLnB1c2goeyB4OiBwb3NYLCB5OiBwb3NZIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ092ZXJsYXBwaW5nIHNoaXBzIGVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVTaGlwKHNoaXBOYW1lLCB4LCB5LCBsZW5ndGgsIGhvcml6b250YWwpIHtcbiAgICAgICAgLy8gbmVlZCBtZXRob2QgdG8gZGVsZXRlIGEgc2hpcCBzbyB0aGF0IHdlIGNhbiBkcmFnL2Ryb3AgcGxhY2Ugc2hpcHNcbiAgICAgICAgLy8gVGhpcyBtZXRob2Qgd2lsbCBkZWxldGUgYSBzaGlwIGlmIGl0IG1hY2hlcyB0aGUgbmFtZSBpbnB1dHRlZFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwb3NYID0gaG9yaXpvbnRhbCA/IHggKyBpIDogeDtcbiAgICAgICAgICAgIGNvbnN0IHBvc1kgPSBob3Jpem9udGFsID8geSA6IHkgKyBpO1xuICAgICAgICAgICAgaWYgKHBvc1ggPCAwIHx8IHBvc1kgPCAwIHx8IHBvc1ggPiA5IHx8IHBvc1kgPiA5KSB7XG4gICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgZGVsZXRlIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoZSBib2FyZFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zWV1bcG9zWF0gPT09IHNoaXBOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NZXVtwb3NYXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzLmJvYXJkW3Bvc1ldW3Bvc1hdID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyQm9hcmQoKSB7XG4gICAgICAgIC8vIHRoaXMgbWV0aG9kIHdpbGwgY2xlYXIgdGhlIGdhbWVib2FyZFxuICAgICAgICB0aGlzLmJvYXJkID0gW1xuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLnNoaXBzTWFwID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIC8vIGhvdyBzaG91bGQgd2UgcmVjb3JkIGNvb3JkcyBvZiBtaXNzZWQgc2hvdD8ganVzdCBvbiB0aGUgbWFwIGJvYXJkIGl0c2VsZiBvclxuICAgIC8vIGluIGEgZGF0YXN0cnVjdHVyZT9cblxuICAgIC8vIGRvbid0IGFsbG93IGF0dGFja3MgaWYgaXQgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZFxuICAgIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5ib2FyZFt5XVt4XTtcblxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIGFkZCBhIGhpdCB0byB0aGUgYm9hdCBhbmQgY2hhbmdlIG1hcFxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaGlwID0gdGhpcy5zaGlwc01hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIGN1cnJlbnRTaGlwLmhpdCgpO1xuICAgICAgICAgICAgY3VycmVudFNoaXAuaXNTdW5rKCk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3ldW3hdID0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3ldW3hdID0gMztcbiAgICAgICAgICAgIC8vIG1heWJlIGFkZCB0aGlzIGNvb3JkIHRvIGEgZGF0YXN0cnVjdHVyZSBsYXRlcj9cbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0ID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NoaXAgaGFzIGFscmVhZHkgYmVlbiBoaXQgaGVyZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQgPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGFyZ2V0IGhhcyBhbHJlYWR5IGJlZW4gbWlzc2VkIGhlcmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBzU3VuaygpIHtcbiAgICAgICAgZm9yIChjb25zdCBbc2hpcE5hbWUsIHNoaXBEZXRhaWxzXSBvZiB0aGlzLnNoaXBzTWFwKSB7XG4gICAgICAgICAgICAvLyBpZiBhbnkgc2hpcCBpcyBub3Qgc3VuaywgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBpZiAoIXNoaXBEZXRhaWxzLnN1bmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgYWxsIHNoaXBzIHN1bmssIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEdhbWVCb2FyZCB9O1xuIiwiY29uc3QgeyBHYW1lQm9hcmQgfSA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7XG5jb25zdCB7IFBsYXllciB9ID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmNvbnN0IHsgRG9tTWFuYWdlciB9ID0gcmVxdWlyZSgnLi9kb21NYW5hZ2VyJyk7XG5cbi8vIGFjY2VwdHMgdHdvIHBsYXllciBvYmplY3RzIGFzIGlucHV0IGFuZCBydW5zIHRoZSBnYW1lXG5jbGFzcyBHYW1lQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IocGxheWVyMSwgcGxheWVyMikge1xuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKHBsYXllcjEsIHBsYXllcjEpO1xuICAgICAgICB0aGlzLnBsYXllcjIgPSBuZXcgUGxheWVyKHBsYXllcjIsIHBsYXllcjIpO1xuICAgICAgICB0aGlzLmRvbU1hbmFnZXIxID0gbmV3IERvbU1hbmFnZXIocGxheWVyMSk7XG4gICAgICAgIHRoaXMuZG9tTWFuYWdlcjIgPSBuZXcgRG9tTWFuYWdlcihwbGF5ZXIyKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIxVHVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIC8vIGluIG9yZGVyIHRvIHN0YXJ0IHRoZSBnYW1lIHdoYXQgZG8gd2UgbmVlZCB0byBkbz9cblxuICAgICAgICAvL2F0dGFja2luZy90YWtpbmcgdHVybnNcbiAgICAgICAgaWYgKHRoaXMucGxheWVyMVR1cm4pIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRFdmVudExpc3RlbmVycyh0aGlzLnBsYXllcjEpO1xuICAgICAgICAgICAgLy8gcGxheWVyMSBzdHVmZlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcGxheWVyMiBzdHVmZlxuICAgICAgICB9XG4gICAgfVxuICAgIGdldFRpbGVDb29yZGluYXRlcyh0aWxlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRpbGUpO1xuICAgICAgICBjb25zdCBbaSwgal0gPSB0aWxlLmlkLnNwbGl0KCctJykucG9wKCkuc3BsaXQoJycpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aWxlLmlkKTtcbiAgICAgICAgY29uc29sZS5sb2coW3BhcnNlSW50KGksIDEwKSwgcGFyc2VJbnQoaiwgMTApXSk7XG4gICAgICAgIHJldHVybiBbcGFyc2VJbnQoaSwgMTApLCBwYXJzZUludChqLCAxMCldO1xuICAgIH1cblxuICAgIGNyZWF0ZUV2ZW50TGlzdGVuZXJzKHBsYXllcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgIGAjJHtwbGF5ZXIuZ3JpZElEfS10aWxlLSR7aX0ke2p9YFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGlja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZUNsaWNrKGV2ZW50LCBwbGF5ZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZUxpc3RlbmVycyhwbGF5ZXIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICBgIyR7dGhpcy5ncmlkSUR9LXRpbGUtJHtpfSR7an1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVDbGljayhldmVudCwgcGxheWVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKGV2ZW50LCBwbGF5ZXIpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbGUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50VGlsZS5pZCk7XG5cbiAgICAgICAgY29uc3QgW2EsIGJdID0gY3VycmVudFRpbGUuaWQuc3BsaXQoJy0nKS5wb3AoKS5zcGxpdCgnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcbiAgICAgICAgY29uc29sZS5sb2coYik7XG4gICAgICAgIC8vIGxldCBbaSwgal0gPSBbcGFyc2VJbnQoYSwgMTApLCBwYXJzZUludChiLCAxMCldO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codHlwZW9mIGkpO1xuICAgICAgICBjb25zdCBbaSwgal0gPSBnZXRUaWxlQ29vcmRpbmF0ZXMoY3VycmVudFRpbGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuZ2FtZUJvYXJkKTtcbiAgICAgICAgcGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGosIGkpO1xuXG4gICAgICAgIGN1cnJlbnRUaWxlLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcblxuICAgICAgICBjdXJyZW50VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGljayhldmVudCwgcGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFRPR0dMRSBQTEFZRVIgVFVSTiBIRVJFIChhZnRlciBhIHN1Y2Nlc3NmdWwgbW92ZT8pXG5cbiAgICAgICAgdGhpcy51cGRhdGVCb2FyZCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEdhbWVDb250cm9sbGVyIH07XG4iLCJjb25zdCB7IEdhbWVCb2FyZCB9ID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTtcbmNvbnN0IHsgUGxheWVyIH0gPSByZXF1aXJlKCcuL3BsYXllcicpO1xuY29uc3QgeyBEb21NYW5hZ2VyIH0gPSByZXF1aXJlKCcuL2RvbU1hbmFnZXInKTtcbi8vRElTQUJMRSBUSUxFUyBPTiBUSEUgQk9BUkQgV0lUSCBDU1MgQ0xBU1NFU1xubGV0IHBsYXllcjEgPSBuZXcgUGxheWVyKCdwbGF5ZXIxJywgJ2dyaWQtMScsIHRydWUpO1xubGV0IHBsYXllcjIgPSBuZXcgUGxheWVyKCdwbGF5ZXIyJywgJ2dyaWQtMicsIGZhbHNlKTtcblxubGV0IGRvbU1hbmFnZXIxID0gbmV3IERvbU1hbmFnZXIocGxheWVyMSk7XG5sZXQgZG9tTWFuYWdlcjIgPSBuZXcgRG9tTWFuYWdlcihwbGF5ZXIyKTtcbmRvbU1hbmFnZXIxLnJlbmRlckJvYXJkKCk7XG5kb21NYW5hZ2VyMi5yZW5kZXJCb2FyZCgpO1xubGV0IHNoaXBPcmllbnRhdGlvbiA9IGZhbHNlO1xubGV0IHBsYWNlQWJsZSA9IGZhbHNlO1xubGV0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGUtYnRuJyk7XG4vLyBwbGFjZUFibGUgaXMgYSBnbG9iYWwgdmFyaWFibGV0ZWxscyB1cyB3aGV0aGVyIG9yIG5vdCB3ZSBjYW4gcGxhY2Vcbi8vIGEgcGllY2Ugb24gYSBib2FyZFxuXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgLy8gaW5pdGlhbCBzZXR1cCBmdW5jdGlvbiAod2hlcmUgYm9hcmQgaXMgc2V0IHVwIGluaXRpYWxseSlcbiAgICAvLyBpbml0aWFsU2V0dXAoKTtcbiAgICAvLyBhdHRhY2tMb29wKCk7XG4gICAgbGV0IHJlc2V0R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldC1idG4nKTtcbiAgICBsZXQgbW9kYWxSZXNldEdhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYnV0dG9uJyk7XG4gICAgcmVzZXRHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgICBtb2RhbFJlc2V0R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gcmVzZXRHYW1lKCk7XG4gICAgICAgIC8vIGxldCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbCcpO1xuICAgICAgICAvLyBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgICBib3RTZXR1cCgpO1xuICAgIHBsYXllclNldHVwKCk7XG59XG5mdW5jdGlvbiByZXNldEdhbWUoKSB7XG4gICAgLy8gY2xlYXIgdGhlIGJvYXJkcyBvZiB0aGUgcGxheWVyc1xuICAgIGRvbU1hbmFnZXIxLmNsZWFyQm9hcmQoKTtcbiAgICBkb21NYW5hZ2VyMi5jbGVhckJvYXJkKCk7XG5cbiAgICAvLyByZXNldCBwbGF5ZXJzXG4gICAgcGxheWVyMSA9IG5ldyBQbGF5ZXIoJ3BsYXllcjEnLCAnZ3JpZC0xJywgdHJ1ZSk7XG4gICAgcGxheWVyMiA9IG5ldyBQbGF5ZXIoJ3BsYXllcjInLCAnZ3JpZC0yJywgZmFsc2UpO1xuXG4gICAgLy9yZXNldCBwbGF5ZXIgZG9tc1xuICAgIGRvbU1hbmFnZXIxID0gbmV3IERvbU1hbmFnZXIocGxheWVyMSk7XG4gICAgZG9tTWFuYWdlcjIgPSBuZXcgRG9tTWFuYWdlcihwbGF5ZXIyKTtcblxuICAgIC8vIHJlbmRlciBuZXcgYm9hcmRzXG4gICAgZG9tTWFuYWdlcjEucmVuZGVyQm9hcmQoKTtcbiAgICBkb21NYW5hZ2VyMi5yZW5kZXJCb2FyZCgpO1xuXG4gICAgLy8gcmVzZXQgdmFycyBhc3NvY2lhdGVkIHdpdGggZXZlbnQgbGlzdGVuZXJzXG4gICAgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC0xJyk7XG4gICAgc2hpcHMgPSBwbGF5ZXIxLmdhbWVCb2FyZC5zaGlwcztcbiAgICBjdXJyZW50U2hpcEluZGV4ID0gMDtcbiAgICBvbl9ib2FyZF9hcnJheSA9IFtdO1xuICAgIHBsYWNlQWJsZSA9IGZhbHNlO1xuXG4gICAgc3RhcnRHYW1lKCk7XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZVNoaXAoKSB7XG4gICAgLy8gc3dhcHMgdGhlIG9yaWVuYXRpb24gb2YgdGhlIHNoaXAgcGxheWVyIGlzIHRyeWluZyB0byBwbGFjZVxuICAgIHNoaXBPcmllbnRhdGlvbiA9IHNoaXBPcmllbnRhdGlvbiA/IGZhbHNlIDogdHJ1ZTtcbn1cblxuZnVuY3Rpb24gYm90U2V0dXAoKSB7XG4gICAgLy8gdGhpcyBmdW5jdGlvbiB3aWxsIHNldHVwIHRoZSBib3QncyBib2FyZFxuXG4gICAgcGxheWVyMi5nZW5lcmF0ZVJhbmRvbVNldHVwKCk7IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgZG9tTWFuYWdlcjIudXBkYXRlQm9hcmQoKTtcbn1cbmZ1bmN0aW9uIGF0dGFja0xvb3AoKSB7XG4gICAgLy8gdGhpcyBmdW5jdGlvbiB3aWxsIGhhbmRsZSB0aGUgYXR0YWNrIGdhbWVwbGF5IGxvb3BcbiAgICAvLyBhc3N1bWUgcGxheWVyMiBpcyBhIGJvdFxuICAgIGNvbnN0IGVuZW15Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC0yJyk7XG4gICAgZW5lbXlCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAvLyBmaXJzdCB0aGUgcGxheWVyIGF0dGFja3MgdGhlIGJvdFxuICAgICAgICBjb25zdCB0aWxlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAvLzEpIHdlIGF0dGFjayB0aGUgdGlsZVxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBkdWUgdG8gZG9tIGV2ZW50IHByb3BhZ2F0aW9uLiBjbGlja2VkIGNsYXNzIGlzIHNvbWV0aW1lcyBhcHBsaWVkIHRvIGdyaWRcbiAgICAgICAgICAgIC8vIHRoaXMgaWYgc3RhdGVtZW50IHByZXZlbnRzIHRoYXRcbiAgICAgICAgICAgICF0aWxlLmNsYXNzTGlzdC5jb250YWlucygndGlsZScpIHx8XG4gICAgICAgICAgICB0aWxlLmNsYXNzTGlzdC5jb250YWlucygnY2xpY2tlZCcpXG4gICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTsgLy8gdGhpcyBtYWtlcyB0aGUgZW50aXJlIGdyaWQgdW5jbGlja2FibGUsIG5vdCBqdXN0IHRoZSB0aWxlXG5cbiAgICAgICAgW3ksIHhdID0gZ2V0VGlsZUNvb3JkaW5hdGVzKHRpbGUpO1xuICAgICAgICBwbGF5ZXIyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgICAgICBkb21NYW5hZ2VyMi51cGRhdGVCb2FyZCgpO1xuICAgICAgICAvLyAyKSB3ZSBjaGVjayBpZiBwbGF5ZXIgaGFzIHdvblxuICAgICAgICBpZiAocGxheWVyMi5nYW1lQm9hcmQuc2hpcHNTdW5rKCkpIHtcbiAgICAgICAgICAgIC8vIFBMQVlFUiBXSU4gQ09ORElUSU9OXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheWVyMSB3aW5zJyk7IC8vIFdJTiBUUklHR0VSUyBQUk9QRVJMWVxuICAgICAgICAgICAgZG9tTWFuYWdlcjEuYW5ub3VuY2VXaW5uZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllcjEuYm90QXR0YWNrKCk7XG4gICAgICAgIGRvbU1hbmFnZXIxLnVwZGF0ZUJvYXJkKCk7XG4gICAgICAgIC8vIGNoZWNrIGlmIGJvdCBoYXMgd29uXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllcjEuZ2FtZUJvYXJkLnNoaXBzU3VuaygpKTtcbiAgICAgICAgaWYgKHBsYXllcjEuZ2FtZUJvYXJkLnNoaXBzU3VuaygpKSB7XG4gICAgICAgICAgICAvLyBCT1QgV0lOIENPTkRJVElPTlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JvdCB3aW5zJyk7XG4gICAgICAgICAgICBkb21NYW5hZ2VyMi5hbm5vdW5jZVdpbm5lcigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIHJldHVybnMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdGlsZSBnaXZlbiB0aGUgdGlsZSBpdHNlbGZcbmZ1bmN0aW9uIGdldFRpbGVDb29yZGluYXRlcyh0aWxlKSB7XG4gICAgY29uc29sZS5sb2codGlsZSk7XG4gICAgY29uc3QgW2ksIGpdID0gdGlsZS5pZC5zcGxpdCgnLScpLnBvcCgpLnNwbGl0KCcnKTtcbiAgICBjb25zb2xlLmxvZyh0aWxlLmlkKTtcbiAgICBjb25zb2xlLmxvZyhbcGFyc2VJbnQoaSwgMTApLCBwYXJzZUludChqLCAxMCldKTtcbiAgICByZXR1cm4gW3BhcnNlSW50KGksIDEwKSwgcGFyc2VJbnQoaiwgMTApXTtcbn1cblxuLy8gdGhlc2UgdmFyaWFibGVzIHByb2JhYmx5IHNob3VsZCBiZSBpbnNpZGUgb2Ygc29tZXRoaW5nXG5sZXQgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC0xJyk7XG5sZXQgc2hpcHMgPSBwbGF5ZXIxLmdhbWVCb2FyZC5zaGlwcztcbmxldCBjdXJyZW50U2hpcEluZGV4ID0gMDtcbmxldCBvbl9ib2FyZF9hcnJheSA9IFtdO1xuXG5mdW5jdGlvbiBwbGF5ZXJTZXR1cCgpIHtcbiAgICBwbGFjZVNoaXBFdmVudExpc3RlbmVycygpO1xufVxuLy8gaGVyZSBpcyBhbiBhbHRlcm5hdGUgdmVyc2lvbiBvZiB3aGF0IGknbSBkb2luZyBhYm92ZVxuZnVuY3Rpb24gaGFuZGxlTW91c2VPdmVyKGV2ZW50KSB7XG4gICAgY29uc3QgdGlsZSA9IGV2ZW50LnRhcmdldDtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RpbGUnKSkge1xuICAgICAgICAvLyBwbGFjZUFibGUgPSB0cnVlO1xuICAgICAgICAvL21ha2VzIHN1cmUgd2UncmUgb24gYSB0aWxlIGFuZCBpbiBiZXR3ZWVuXG4gICAgICAgIGNvbnN0IFt5LCB4XSA9IGdldFRpbGVDb29yZGluYXRlcyh0aWxlKTtcbiAgICAgICAgY29uc3QgY3VycmVudFNoaXAgPSBzaGlwc1tjdXJyZW50U2hpcEluZGV4XTtcblxuICAgICAgICAvLyBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NoaXAnKSkge1xuICAgICAgICAvLyAgICAgLy8gaWYgc2hpcCBpcyBhbHJlYWR5IHRoZXJlLCBkbyBub3RoaW5nXG4gICAgICAgIC8vICAgICAvLyBpZiBzaGlwIHdvdWxkIGJlIHBsYWNlZCBvdXQgb2YgYm91bmRzLCBkbyBub3RoaW5nXG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBpZiBob3ZlcmluZyBhIHNoaXAgZ2l2ZXMgdXMgYW4gZXJyb3IsIHRoZW4gZG9uJ3RcbiAgICAgICAgICAgIHBsYXllcjEuZ2FtZUJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICBjdXJyZW50U2hpcFswXSxcbiAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgY3VycmVudFNoaXBbMV0sXG4gICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZG9tTWFuYWdlcjEudXBkYXRlQm9hcmQoKTtcbiAgICAgICAgICAgIHBsYWNlQWJsZSA9IHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBwbGFjZUFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIH1cbmZ1bmN0aW9uIGhhbmRsZU1vdXNlT3V0KGV2ZW50KSB7XG4gICAgY29uc3QgdGlsZSA9IGV2ZW50LnRhcmdldDtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RpbGUnKSkge1xuICAgICAgICAvL21ha2VzIHN1cmUgd2UncmUgb24gYSB0aWxlIGFuZCBub3QgaW4gYmV0d2VlblxuXG4gICAgICAgIC8vIGlmIChvbl9ib2FyZF9hcnJheS5jb250YWluc1tjdXJyZW50U2hpcFswXV0pIHtcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NoaXAnKSkge1xuICAgICAgICAgICAgLy8gaWYgd2UncmUgaG92ZXJpbmcgYW4gYWxyZWFkeSBwbGFjZWQoY2xpY2tlZCkgc2hpcCwgc2tpcFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW3ksIHhdID0gZ2V0VGlsZUNvb3JkaW5hdGVzKHRpbGUpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNoaXAgPSBzaGlwc1tjdXJyZW50U2hpcEluZGV4XTtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzaGlwIHByZXZpZXdcbiAgICAgICAgICAgIGlmICh+cGxhY2VBYmxlKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyMS5nYW1lQm9hcmQuZGVsZXRlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNoaXBbMF0sXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaGlwWzFdLFxuICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRvbU1hbmFnZXIxLnVwZGF0ZUJvYXJkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUFJPQkxFTTogd2UgaGF2ZSBtYWRlIGl0IHNvIHRoYXQgLmRlbGV0ZVNoaXAgd2lsbCBpZ25vcmUgYSBzaGlwIHdoZXJlXG4gICAgICAgIC8vICAgICAgICAgIG91ciBjdXJzb3IgaXMsIGJ1dCBkZWxldGUgcGFydHMgb2YgdGhlIHNoaXAgd2hlcmUgb3VyIGN1cnNvciBpc1xuICAgICAgICAvLyAgICAgICAgICBpcyBub3RcbiAgICAgICAgLy8gU09MVVRJT046XG4gICAgfVxufVxuXG4vLyBUSElTIE5FRURTIFRPIE1BS0UgVEhFIFNISVAgU1RBWSBXSEVSRSBXRSdSRSBIT1ZFUkVEXG4vLyBOT1cgVEhBVCBTSElQUyBTVEFZIFdISUxFIFRIRVknUkUgSE9WRVJFRCwgV0UgTkVFRCBUTyBUVVJOIEVWRU5UIExJU1RFTkVSUyBCQUNLIE9OXG4vLyBCVVQgQUxTTyBOT1QgQUZGRUNUIFRIRSBCT0FUUyBUSEFUIEFSRSBBTFJFQURZIE9OIFRIRSBCT0FSRFxuLy8gQ1JFQVRFIEFOIEFSUkFZIFRIQVQgQ09OVEFJTlMgVEhFIEJPQVRTIFRIQVQgQVJFIEFMUkVBRFkgT04gVEhFIEJPQVJEXG5mdW5jdGlvbiBoYW5kbGVNb3VzZUNsaWNrKGV2ZW50KSB7XG4gICAgLy8gSUYgUExBQ0lORyBBIFNISVAgV09VTEQgVFJJR0dFUiBBTiBFUlJPUiwgV0UgSlVTVCBSRVRVUk5cbiAgICAvLyBJRiBTSElQIE5PVCBBQ1RVQUxMWSBQTEFDRUQsIFRIRU4gV0UgRE9OJ1QgUkVBQ1QgVE8gQ0xJQ0tcbiAgICBjb25zdCB0aWxlID0gZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucygndGlsZScpKSB7XG4gICAgICAgIC8vIGRlYWN0aXZlIGhvdmVyIGVmZmVjdHMgd2hlbiBjbGlja2VkXG4gICAgICAgIC8vIGlmICh+dGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NoaXAnKSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICBpZiAocGxhY2VBYmxlKSB7XG4gICAgICAgICAgICBwbGF5ZXJCb2FyZC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVNb3VzZU92ZXIpO1xuICAgICAgICAgICAgcGxheWVyQm9hcmQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBoYW5kbGVNb3VzZU91dCk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IFt5LCB4XSA9IGdldFRpbGVDb29yZGluYXRlcyh0aWxlKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gc2hpcHNbY3VycmVudFNoaXBJbmRleF07XG4gICAgICAgICAgICBvbl9ib2FyZF9hcnJheS5wdXNoKGN1cnJlbnRTaGlwWzBdKTtcblxuICAgICAgICAgICAgLy8gcGxheWVyMS5nYW1lQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgICAgLy8gICAgIGN1cnJlbnRTaGlwWzBdLFxuICAgICAgICAgICAgLy8gICAgIHgsXG4gICAgICAgICAgICAvLyAgICAgeSxcbiAgICAgICAgICAgIC8vICAgICBjdXJyZW50U2hpcFsxXSxcbiAgICAgICAgICAgIC8vICAgICBjdXJyZW50U2hpcFsyXVxuICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgIGRvbU1hbmFnZXIxLnVwZGF0ZUNsYXNzTGlzdCgpO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGFkZCB0aGUgY3VycmVudFxuXG4gICAgICAgICAgICBkb21NYW5hZ2VyMS51cGRhdGVCb2FyZCgpO1xuXG4gICAgICAgICAgICBjdXJyZW50U2hpcEluZGV4Kys7XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hpcEluZGV4ID49IHNoaXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlJ3ZlIHJ1biBvdXQgb2Ygc2hpcHMsIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICByZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZS1hY3RpdmF0ZSBob3ZlciBlZmZlY3RzIGZvciB0aGUgbmV4dCBzaGlwXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlTW91c2VPdmVyKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGhhbmRsZU1vdXNlT3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYWNlQWJsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIH1cbn1cbmZ1bmN0aW9uIHBsYWNlU2hpcEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGhhbmRsZU1vdXNlT3Zlcik7XG4gICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBoYW5kbGVNb3VzZU91dCk7XG4gICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVNb3VzZUNsaWNrKTtcbiAgICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByb3RhdGVTaGlwKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgcGxheWVyQm9hcmQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlTW91c2VPdmVyKTtcbiAgICBwbGF5ZXJCb2FyZC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGhhbmRsZU1vdXNlT3V0KTtcbiAgICBwbGF5ZXJCb2FyZC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZU1vdXNlQ2xpY2spO1xuICAgIHJvdGF0ZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJvdGF0ZVNoaXApO1xuICAgIGF0dGFja0xvb3AoKTsgLy8gYXR0YWNrIGxvb3Agc3RhcnRzIGFmdGVyIHBsYXllciBwbGFjZXMgYWxsIHBpZWNlc1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnQWxsIHNoaXBzIHBsYWNlZC4gRXZlbnQgbGlzdGVuZXJzIHJlbW92ZWQuIEF0dGFja0xvb3AoKSBjYWxsZWQnXG4gICAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHN0YXJ0R2FtZSB9O1xuIiwiY29uc3QgeyBHYW1lQm9hcmQgfSA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7XG4vLyBpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZUJvYXJkLmpzJztcbmNsYXNzIFBsYXllciB7XG4gICAgLy8gdGhlcmUgd2lsbCBiZSB0d28gdHlwZXMgb2YgcGxheWVycy4gUmVhbCBwbGF5ZXJzIGFuZCBjb21wdXRlciBwbGF5ZXJzXG4gICAgY29uc3RydWN0b3IocGxheWVySUQsIGdyaWRJRCwgaXNIdW1hbikge1xuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IG5ldyBHYW1lQm9hcmQoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJRCA9IHBsYXllcklEO1xuICAgICAgICB0aGlzLmdyaWRJRCA9IGdyaWRJRDtcbiAgICAgICAgdGhpcy5ib2FyZEhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLmdyaWRJRH1gKTtcbiAgICAgICAgdGhpcy5zaGlwcyA9IFtcbiAgICAgICAgICAgIFsnQ2FycmllcicsIDUsIHRydWVdLFxuICAgICAgICAgICAgWydCYXR0bGVzaGlwJywgNCwgZmFsc2VdLFxuICAgICAgICAgICAgWydEZXN0cm95ZXInLCAzLCB0cnVlXSxcbiAgICAgICAgICAgIFsnU3VibWFyaW5lJywgMywgdHJ1ZV0sXG4gICAgICAgICAgICBbJ1BhdHJvbCBCb2F0JywgMiwgZmFsc2VdLFxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIGJpbmQgaGFuZGxlY2xpY2sgbWV0aG9kIHRvIHRoZSBpbnN0YW5jZSBvZiB0aGUgcGxheWVyIGNsYXNzb2thXG4gICAgICAgIC8vIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubXlUdXJuID0gZmFsc2U7IC8vIGRvbid0IG5lZWQ/XG4gICAgICAgIHRoaXMuaXNIdW1hbiA9IGlzSHVtYW47IC8vIGRvbid0IG5lZWQ/XG4gICAgfVxuXG4gICAgYm90QXR0YWNrKCkge1xuICAgICAgICAvLyB0aGlzIG1ldGhvZCBtYWtlcyB0aGUgYm90IGNob29zZSBhIHNwb3QgYW5kIGF0dGFjayBpdCBvbiB0aGUgYm9hcmRcbiAgICAgICAgLy8gbmVlZCB0byBtYWtlIHRoaXMgbW9yZSBzb3BoaXN0aWNhdGVkXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ29vcmRzKGdhbWVCb2FyZF9ib2FyZCkge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZ2FtZUJvYXJkX2JvYXJkW3JhbmRvbVhdW3JhbmRvbVldID09PSAyIHx8XG4gICAgICAgICAgICAgICAgZ2FtZUJvYXJkX2JvYXJkW3JhbmRvbVhdW3JhbmRvbVldID09PSAzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBnYW1lQm9hcmQgaGFzIGFscmVhZHkgYmVlbiBoaXQgaGVyZSwgdGhlbiBnZW5lcmF0ZSBuZXcgY29vcmRzXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlQ29vcmRzKGdhbWVCb2FyZF9ib2FyZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vb3RoZXJ3aXNlLCByZXR1cm4gdGhlc2UgY29vcmRzIHRvIGF0dGFja1xuICAgICAgICAgICAgICAgIHJldHVybiBbcmFuZG9tWCwgcmFuZG9tWV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IFt4Q29vcmQsIHlDb29yZF0gPSBnZW5lcmF0ZUNvb3Jkcyh0aGlzLmdhbWVCb2FyZC5ib2FyZCk7XG4gICAgICAgIC8vIGlmICh0aGlzLmdhbWVCb2FyZC5ib2FyZFt4Q29vcmRdW3lDb29yZF0pIHtcbiAgICAgICAgLy8gICAgIFt4Q29vcmQsIHlDb29yZF0gPSBnZW5lcmF0ZUNvb3JkcygpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soeUNvb3JkLCB4Q29vcmQpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlUmFuZG9tU2V0dXAoKSB7XG4gICAgICAgIC8vIGdpdmVuIGEgbGlzdCBvZiBzaGlwcywgZ2VuZXJhdGUgYSByYW5kb20gc2V0dXAgZm9yIHRoZW1cbiAgICAgICAgbGV0IHNoaXBzID0gdGhpcy5zaGlwcztcbiAgICAgICAgbGV0IGdhbWVCb2FyZCA9IHRoaXMuZ2FtZUJvYXJkO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBsZXQge25hbWUsIGxlbmd0aH0gPSBzaGlwc1tpXVxuICAgICAgICAgICAgLy8gcGxhY2VTaGlwUmFuZG9tbHkoc2hpcHNbaV1bMF0sIHNoaXBzW2ldWzFdLCBzaGlwc1tpXVsyXSk7XG4gICAgICAgICAgICBwbGFjZVNoaXBSYW5kb21seShzaGlwc1tpXVswXSwgc2hpcHNbaV1bMV0sIHNoaXBzW2ldWzJdLCBnYW1lQm9hcmQpO1xuICAgICAgICAgICAgLy9VTkRFUlNUQU5EIFdIWSBXRSdSRSBVU0lORyBcIkNBTExcIiBhbmQgXCJUSElTXCIgSEVSRVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBsYWNlU2hpcFJhbmRvbWx5KHNoaXBOYW1lLCBsZW5ndGgsIGhvcml6b250YWwsIGdhbWVCb2FyZCkge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGdhbWVCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgICAgICAgICAgIHNoaXBOYW1lLFxuICAgICAgICAgICAgICAgICAgICByYW5kb21YLFxuICAgICAgICAgICAgICAgICAgICByYW5kb21ZLFxuICAgICAgICAgICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBwbGFjaW5nIHNoaXAgZXJyb3JzLCB0aGVuIGRlbGV0ZSB3aGF0IHdhcyBwbGFjZWRcbiAgICAgICAgICAgICAgICBnYW1lQm9hcmQuZGVsZXRlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgc2hpcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVgsXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVksXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHBsYWNlU2hpcFJhbmRvbWx5KHNoaXBOYW1lLCBsZW5ndGgsIGhvcml6b250YWwpO1xuICAgICAgICAgICAgICAgIHBsYWNlU2hpcFJhbmRvbWx5KHNoaXBOYW1lLCBsZW5ndGgsIGhvcml6b250YWwsIGdhbWVCb2FyZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBQbGF5ZXIgfTtcbi8vIGV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy50aW1lc0hpdCA9IDA7XG4gICAgICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBoaXQgZnVuY3Rpb24gaW5jcmVhc2VzIG51bWJlciBvZiBoaXRzIHRvIHlvdXIgc2hpcFxuICAgIGhpdCgpIHtcbiAgICAgICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICAgIH1cblxuICAgIC8vIGlzU3VuaygpIGNhbGN1bGF0ZXMgd2hldGhlciBhIHNoaXAgaXMgY29uc2lkZXJlZCBzdW5rIGJhc2VkIG9uIGl0J3MgbGVuZ3RoIGFuZCBudW1oaXRzIGl0IGhhcyByZWNlaXZlZFxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXNIaXQgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBTaGlwIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgeyBQbGF5ZXIgfSA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XG5jb25zdCB7IERvbU1hbmFnZXIgfSA9IHJlcXVpcmUoJy4vZG9tTWFuYWdlcicpO1xuY29uc3QgeyBHYW1lQ29udHJvbGxlciB9ID0gcmVxdWlyZSgnLi9nYW1lQ29udHJvbGxlcicpO1xuY29uc3QgeyBzdGFydEdhbWUgfSA9IHJlcXVpcmUoJy4vZ2FtZUNvbnRyb2xsZXIzJyk7XG5cbi8vIDEgdHJ5IHRvIHB1dCBwaWVjZXMgb24gdGhlIGJvYXJkXG4vLyBjb25zb2xlLmxvZygndGVzdGluZycpO1xuLy8gMSkgY3JlYXRlIHRoZSBwaWVjZXMsIGlkIHRoZSBwaWVjZXMsIHBvcHVsYXRlIHRoZSBwaWVjZXMgd2l0aCAwc1xuc3RhcnRHYW1lKCk7XG4vLyBsZXQgZ2FtZSA9IG5ldyBHYW1lQ29udHJvbGxlcigncGxheWVyMScsICdwbGF5ZXIyJyk7XG4vLyBnYW1lLnN0YXJ0R2FtZSgpO1xuLy8gY29uc3QgcGxheWVyMSA9IG5ldyBQbGF5ZXIoJ3BsYXllcjEnLCAnZ3JpZC0xJyk7XG4vLyBjb25zb2xlLmxvZyhwbGF5ZXIxLmdyaWRJRCk7XG4vLyAvLyBjb25zdCBwbGF5ZXIyID0gbmV3IFBsYXllcigncGxheWVyMicsICdncmlkLTInKTtcblxuLy8gY29uc3QgZG9tTWFuYWdlcjEgPSBuZXcgRG9tTWFuYWdlcihwbGF5ZXIxKTtcbi8vIGRvbU1hbmFnZXIxLnByaW50VGVzdCgpO1xuLy8gZG9tTWFuYWdlcjEucmVuZGVyQm9hcmQoKTtcbi8vIHBsYXllcjEuZ2FtZUJvYXJkLnBsYWNlU2hpcCgndGVzdCcsIDIsIDIsIDMsIHRydWUpO1xuLy8gZG9tTWFuYWdlcjEudXBkYXRlQm9hcmQoKTtcbi8vIHBsYXllcjEucmVuZGVyQm9hcmQoKTtcbi8vIHBsYXllcjEudXBkYXRlQm9hcmQoKTtcblxuLy8gcGxheWVyMi5nYW1lQm9hcmQucGxhY2VTaGlwKCd0ZXN0JywgMiwgMiwgMywgdHJ1ZSk7XG4vLyBwbGF5ZXIyLnJlbmRlckJvYXJkKCk7XG5cbi8vIHBsYXllcjIuY3JlYXRlRXZlbnRMaXN0ZW5lcnMoKTtcbi8vIHBsYXllcjIucmVtb3ZlTGlzdGVuZXJzKCk7XG4vLyBwbGF5ZXIyLmNyZWF0ZUV2ZW50TGlzdGVuZXJzKCk7XG5cbi8vIGxldCBnYW1lT3ZlciA9IGZhbHNlO1xuLy8gbGV0IHBsYXllclR1cm4gPSB0cnVlO1xuXG4vLyAxKSBtYXliZSBzdGFydCB3aXRoIGF0dGFja2luZ1xuLy8gICAgaW4gb3JkZXIgdG8gYXR0YWNrIHdoZW4gbXkgbW91c2UgaXMsIGkgbmVlZCBhbiBldmVudCBsaXN0ZW5lciBmb3IgZXZlcnkgZW5lbXlcbi8vICAgIHRpbGUgdG8gZGV0ZXJtaW5lIHdoZW4gYSB0aWxlIGlzIGNsaWNrZWRcbi8vICAgIHB1dCBldmVudCBsaXN0ZW5lcnMgaW4gdGhpcyBtb2R1bGU/IE9yIHB1dCB0aGVtIGluIHBsYXllciBtb2R1bGU/XG4vLyAxKSBsZXQncyB0cnkgdGhpcyBtb2R1bGVcblxuLy8gMikgdGhlbiBwbGFjZSBwaWVjZXNcblxuLy8gZXZlbnQgbGlzdGVuZXJzXG4vLyBDUkVBVEUgQU5PVEhFUiBNT0RVTEUvQ0xBU1MvV0hBVEVWRVIgUkVTUE9OU0lCTEUgRk9SIERPTSBNQU5JUFVMQVRJT04gSEVSRVxuLy8gV0UnTEwgSEFWRSBUTyBUUkFOU0xPQ0FURSBET00gTUVUSE9EUyBJTiBQTEFZRVIgVE8gSEVSRVxuLy8gRXZlbnQgZHJpdmVuIGFwcHJvYWNoIGxpa2UgY2hhdGdwdCBzYXlzOlxuLy8gZnVuY3Rpb24gY3JlYXRlRXZlbnRMaXN0ZW5lcnMocGxheWVyKSB7XG4vLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4vLyAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuLy8gICAgICAgICAgICAgbGV0IGN1cnJlbnRUaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcbi8vICAgICAgICAgICAgICAgICBgIyR7cGxheWVyLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWBcbi8vICAgICAgICAgICAgICk7XG5cbi8vICAgICAgICAgICAgIGlmIChjdXJyZW50VGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWNrZWQnKSkge1xuLy8gICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgY3VycmVudFRpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwbGF5ZXIuaGFuZGxlQ2xpY2spO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMocGxheWVyKSB7XG4vLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4vLyAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuLy8gICAgICAgICAgICAgbGV0IGN1cnJlbnRUaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcbi8vICAgICAgICAgICAgICAgICBgIyR7cGxheWVyLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWBcbi8vICAgICAgICAgICAgICk7XG4vLyAgICAgICAgICAgICBjdXJyZW50VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYXllci5oYW5kbGVDbGljayk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cbi8vIHdoaWxlICghZ2FtZU92ZXIpIHtcbi8vICAgICAvL1dlIHJ1biB0aGUgZ2FtZSBpbnNpZGUgb2YgdGhpcyBsb29wLlxuLy8gICAgIC8vIE5lZWQgdG8gZmluZCBhIHdheSB0byB0cmlnZ2VyIHBsYXllclR1cm4gYmFzZWQgb24gY2xpY2sgZXZlbnQgbGlzdGVuZXJcbi8vICAgICAvLyBEbyB3ZSBuZWVkIHRvIHB1dCBldmVudCBsaXN0ZW5lcnMvIGRvbSBtYW5pcHVsYXRpb24gaGVyZSBpbnN0ZWFkP1xcXG5cbi8vICAgICBpZiAocGxheWVyVHVybikge1xuLy8gICAgIH1cbi8vIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==