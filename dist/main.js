/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
    }
    // should be able to place ships at specific coords by calling the ship class
    // need to make sure ship is placed on valid coords, not outside the board
    // place ships horizontally or vertically

    // is placeship given one set of coordinates? or is given a Z number of coords
    // based on Z length of a ship?
    placeShip(shipName, x, y, length, horizontal) {
        //assume we're given arrays of coordinates.
        // 1) length of each array must match the ship length
        // 2) length of each array must match each other
        // 3) each set of coordinates in the array must touch horizontally or
        //    vertically on the board (never diagnolly)
        // 4) ships cannot be on top of each other, no pair of coords
        //    from one ship can match those of anther ship

        // MAYBE THIS STUFF SHOULD BE CHECKED IN THE PLAYER or GAME CLASS?
        // inside this method check:
        // 1) pieces are not being placed on top of other pieces
        // 2)
        // let ship = new Ship(xCoords.length);
        // if (xCoords.length !== yCoords.length) {
        //     throw new Error('Placeship coordinate length mismatch');
        // }
        // xCoords.forEach((x) => {
        //     if (x < 0) {
        //         throw new Error('x coord out of bounds');
        //     }
        // });
        // for (let i = 0; i < xCoords.length; i++) {
        //     if (xCoords[i] < 0 || xCoords[i] > 9) {
        //         throw new Error('x coord out of bounds');
        //     }
        //     if (yCoords[i] < 0 || yCoords[i] > 9) {
        //         throw new Error('y coord out of bounds');
        //     }
        // }
        // //check if each coordinate is touching the other
        // function checkArray(array) {
        //     for (let i = 0; i < array.length - 1; i++) {
        //         if (array[i] > array[i + 1] + 1) {
        //             return false;
        //         }
        //     }
        // }
        // this.shipsObj.ship = new Ship(xCoords.length);
        // this.shipsObj.xCoordinates = xCoords;
        // this.shipsObj.yCoordinates = yCoords;

        // // place the ship on the board
        // for (let i = 0; i < xCoords.length; i++) {
        //     if (this.board[yCoords[i]][xCoords[i]] === 1) {
        //         throw new Error('Overlapping ships');
        //     } else {
        //         this.board[yCoords[i]][xCoords[i]] = 1;
        // }
        // let ship = new Ship(shipName, xCoords.length);
        // for (let i = 0; i < xCoords.length; i++) {
        //     this.board[yCoords[i]][xCoords[i]] = ship;
        // }
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
    // takes a pair of coordinates, determines if the attack hit a ship
    // sends hit function to the correct ship, or records coords of missed shot

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

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { GameBoard } = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
// import GameBoard from './gameBoard.js';
class Player {
    // there will be two types of players. Real players and computer players
    constructor(playerID, gridID) {
        this.gameBoard = new GameBoard();
        this.playerID = playerID;
        this.gridID = gridID;
        this.boardHTML = document.querySelector(`#${this.gridID}`);
        this.handleClick = this.handleClick.bind(this);
        // this.myTurn = false;
    }
    // testing the dom stuff is outside the scope of this project.
    // method that renders the current state of the gameBoard
    renderBoard() {
        // const boardHTML = document.querySelector(`#${this.gridID}`);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const newTile = document.createElement('div');
                newTile.setAttribute('id', `${this.gridID}-tile-${i}${j}`);
                newTile.textContent = this.gameBoard.board[i][j];
                this.boardHTML.appendChild(newTile);
            }
        }
    }

    // we can create a method here to randomly place ships for the bot

    // updateBoard() updates the html board based on what players GameBoard looks like
    updateBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.gridID}-tile-${i}${j}`
                );
                currentTile.textContent = this.gameBoard.board[i][j];
            }
        }
    }

    // // create event listener
    // createEventListeners() {
    //     for (let i = 0; i < 10; i++) {
    //         for (let j = 0; j < 10; j++) {
    //             let currentTile = document.querySelector(
    //                 `#${this.gridID}-tile-${i}${j}`
    //             );

    //             // // if currentTile has already been clicked, remove event listener
    //             // if (currentTile.classList.contains('clicked ')) {
    //             //     currentTile.removeEventListener();
    //             //     continue;
    //             // }
    //             // currentTile.addEventListener('click', () => {
    //             //     // remove event listener once clicked here?
    //             //     // but if we do that, then how do we deactivate/reactivate
    //             //     // all event listeners when it is/ is not player turn
    //             //     this.gameBoard.receiveAttack(j, i);
    //             //     // currentTile.dataset.clicked = 'true';
    //             //     currentTile.classList.add('clicked');
    //             //     this.updateBoard();
    //             // });

    //             // click handler separate function
    //             const handleClick = () => {
    //                 // perform the attack
    //                 this.gameBoard.receiveAttack(j, i);

    //                 // add clicked class to the list so we know
    //                 currentTile.classList.add('clicked');

    //                 // when you remove an event listener you call it with the exact
    //                 // same parametersthat were used when adding it
    //                 currentTile.removeEventListener('click', handleClick);
    //                 this.updateBoard();
    //             };

    //             // if tile has already been clicked, won't have listener readded
    //             if (currentTile.classList.contains('clicked')) {
    //                 currentTile.removeEventListener('click', handleClick);
    //                 continue;
    //             }

    //             currentTile.addEventListener('click', handleClick);
    //         }
    //     }
    // }
    // disableBoard() {
    //     for (let i = 0; i < 10; i++) {
    //         for (let j = 0; j < 10; j++) {
    //             let currentTile = document.querySelector(
    //                 `#${this.gridID}-tile-${i}${j}`
    //             );
    //             currentTile.removeEventListener('click', (event) =>
    //                 this.handleClick(event)
    //             );
    //         }
    //     }
    // }
    getTileCoordinates(tile) {
        console.log(tile);
        const [i, j] = tile.id.split('-').pop().split('');
        console.log(tile.id);
        console.log([parseInt(i, 10), parseInt(j, 10)]);
        return [parseInt(i, 10), parseInt(j, 10)];
    }
    handleClick(event) {
        const currentTile = event.currentTarget;
        console.log(currentTile.id);

        const [a, b] = currentTile.id.split('-').pop().split('');
        console.log(typeof a);
        console.log(b);
        // let [i, j] = [parseInt(a, 10), parseInt(b, 10)];
        // console.log(i);
        // console.log(typeof i);
        const [i, j] = this.getTileCoordinates(currentTile);
        console.log(this.gameBoard);
        this.gameBoard.receiveAttack(j, i);

        currentTile.classList.add('clicked');

        currentTile.removeEventListener('click', this.handleClick);

        this.updateBoard();
    }

    createEventListeners() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.gridID}-tile-${i}${j}`
                );

                if (currentTile.classList.contains('clicked')) {
                    continue;
                }
                currentTile.addEventListener('click', this.handleClick);
            }
        }
    }
    removeListeners() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let currentTile = document.querySelector(
                    `#${this.gridID}-tile-${i}${j}`
                );
                currentTile.removeEventListener('click', this.handleClick);
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxRQUFRLE9BQU8sRUFBRSxtQkFBTyxDQUFDLDZCQUFRO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWiwyQkFBMkIsb0JBQW9CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixzQkFBc0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQixvQkFBb0I7QUFDL0M7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsb0JBQW9CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGtCQUFrQjtBQUNwRSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjs7Ozs7Ozs7Ozs7QUN4Sm5CLFFBQVEsWUFBWSxFQUFFLG1CQUFPLENBQUMsdUNBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsWUFBWTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsWUFBWTtBQUNwRSx3QkFBd0IsUUFBUTtBQUNoQyw0QkFBNEIsUUFBUTtBQUNwQztBQUNBLDhDQUE4QyxZQUFZLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQSx3QkFBd0IsWUFBWSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQixRQUFRO0FBQ25DLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0EsMkJBQTJCLFlBQVksUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixRQUFRO0FBQ25DLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0EsMkJBQTJCLFlBQVksUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQSx3QkFBd0IsWUFBWSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ2xEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQyw0QkFBNEIsUUFBUTtBQUNwQztBQUNBLHdCQUF3QixZQUFZLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjs7Ozs7Ozs7Ozs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7VUNwQm5CO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxRQUFRLFNBQVMsRUFBRSxtQkFBTyxDQUFDLGlDQUFVO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLXRlbXBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stdGVtcGxhdGUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBTaGlwIH0gPSByZXF1aXJlKCcuL3NoaXAnKTtcbmNsYXNzIEdhbWVCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBbXG4gICAgICAgICAgICAvLyAwID0gd2F0ZXJcbiAgICAgICAgICAgIC8vIHNoaXBOYW1lID0gc2hpcFxuICAgICAgICAgICAgLy8gMiA9IGhpdFxuICAgICAgICAgICAgLy8gMyA9IG1pc3NcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgXTtcbiAgICAgICAgLy8gdXNlIGFuIG9iamVjdCB0byBzdG9yZSB0aGUgc2hpcHM/XG4gICAgICAgIC8vIHRoaXMuc2hpcHNPYmogPSB7fTtcbiAgICAgICAgdGhpcy5zaGlwc01hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gcGxhY2Ugc2hpcHMgYXQgc3BlY2lmaWMgY29vcmRzIGJ5IGNhbGxpbmcgdGhlIHNoaXAgY2xhc3NcbiAgICAvLyBuZWVkIHRvIG1ha2Ugc3VyZSBzaGlwIGlzIHBsYWNlZCBvbiB2YWxpZCBjb29yZHMsIG5vdCBvdXRzaWRlIHRoZSBib2FyZFxuICAgIC8vIHBsYWNlIHNoaXBzIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5XG5cbiAgICAvLyBpcyBwbGFjZXNoaXAgZ2l2ZW4gb25lIHNldCBvZiBjb29yZGluYXRlcz8gb3IgaXMgZ2l2ZW4gYSBaIG51bWJlciBvZiBjb29yZHNcbiAgICAvLyBiYXNlZCBvbiBaIGxlbmd0aCBvZiBhIHNoaXA/XG4gICAgcGxhY2VTaGlwKHNoaXBOYW1lLCB4LCB5LCBsZW5ndGgsIGhvcml6b250YWwpIHtcbiAgICAgICAgLy9hc3N1bWUgd2UncmUgZ2l2ZW4gYXJyYXlzIG9mIGNvb3JkaW5hdGVzLlxuICAgICAgICAvLyAxKSBsZW5ndGggb2YgZWFjaCBhcnJheSBtdXN0IG1hdGNoIHRoZSBzaGlwIGxlbmd0aFxuICAgICAgICAvLyAyKSBsZW5ndGggb2YgZWFjaCBhcnJheSBtdXN0IG1hdGNoIGVhY2ggb3RoZXJcbiAgICAgICAgLy8gMykgZWFjaCBzZXQgb2YgY29vcmRpbmF0ZXMgaW4gdGhlIGFycmF5IG11c3QgdG91Y2ggaG9yaXpvbnRhbGx5IG9yXG4gICAgICAgIC8vICAgIHZlcnRpY2FsbHkgb24gdGhlIGJvYXJkIChuZXZlciBkaWFnbm9sbHkpXG4gICAgICAgIC8vIDQpIHNoaXBzIGNhbm5vdCBiZSBvbiB0b3Agb2YgZWFjaCBvdGhlciwgbm8gcGFpciBvZiBjb29yZHNcbiAgICAgICAgLy8gICAgZnJvbSBvbmUgc2hpcCBjYW4gbWF0Y2ggdGhvc2Ugb2YgYW50aGVyIHNoaXBcblxuICAgICAgICAvLyBNQVlCRSBUSElTIFNUVUZGIFNIT1VMRCBCRSBDSEVDS0VEIElOIFRIRSBQTEFZRVIgb3IgR0FNRSBDTEFTUz9cbiAgICAgICAgLy8gaW5zaWRlIHRoaXMgbWV0aG9kIGNoZWNrOlxuICAgICAgICAvLyAxKSBwaWVjZXMgYXJlIG5vdCBiZWluZyBwbGFjZWQgb24gdG9wIG9mIG90aGVyIHBpZWNlc1xuICAgICAgICAvLyAyKVxuICAgICAgICAvLyBsZXQgc2hpcCA9IG5ldyBTaGlwKHhDb29yZHMubGVuZ3RoKTtcbiAgICAgICAgLy8gaWYgKHhDb29yZHMubGVuZ3RoICE9PSB5Q29vcmRzLmxlbmd0aCkge1xuICAgICAgICAvLyAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGFjZXNoaXAgY29vcmRpbmF0ZSBsZW5ndGggbWlzbWF0Y2gnKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB4Q29vcmRzLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgLy8gICAgIGlmICh4IDwgMCkge1xuICAgICAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcigneCBjb29yZCBvdXQgb2YgYm91bmRzJyk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHhDb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGlmICh4Q29vcmRzW2ldIDwgMCB8fCB4Q29vcmRzW2ldID4gOSkge1xuICAgICAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcigneCBjb29yZCBvdXQgb2YgYm91bmRzJyk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBpZiAoeUNvb3Jkc1tpXSA8IDAgfHwgeUNvb3Jkc1tpXSA+IDkpIHtcbiAgICAgICAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3kgY29vcmQgb3V0IG9mIGJvdW5kcycpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8vY2hlY2sgaWYgZWFjaCBjb29yZGluYXRlIGlzIHRvdWNoaW5nIHRoZSBvdGhlclxuICAgICAgICAvLyBmdW5jdGlvbiBjaGVja0FycmF5KGFycmF5KSB7XG4gICAgICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAvLyAgICAgICAgIGlmIChhcnJheVtpXSA+IGFycmF5W2kgKyAxXSArIDEpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLnNoaXBzT2JqLnNoaXAgPSBuZXcgU2hpcCh4Q29vcmRzLmxlbmd0aCk7XG4gICAgICAgIC8vIHRoaXMuc2hpcHNPYmoueENvb3JkaW5hdGVzID0geENvb3JkcztcbiAgICAgICAgLy8gdGhpcy5zaGlwc09iai55Q29vcmRpbmF0ZXMgPSB5Q29vcmRzO1xuXG4gICAgICAgIC8vIC8vIHBsYWNlIHRoZSBzaGlwIG9uIHRoZSBib2FyZFxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHhDb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGlmICh0aGlzLmJvYXJkW3lDb29yZHNbaV1dW3hDb29yZHNbaV1dID09PSAxKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdmVybGFwcGluZyBzaGlwcycpO1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmJvYXJkW3lDb29yZHNbaV1dW3hDb29yZHNbaV1dID0gMTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBOYW1lLCB4Q29vcmRzLmxlbmd0aCk7XG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgeENvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyAgICAgdGhpcy5ib2FyZFt5Q29vcmRzW2ldXVt4Q29vcmRzW2ldXSA9IHNoaXA7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBwbGFjZXMgcGllY2VzIG9uIGJvYXJkIGJhc2VkIG9uIG9yaWdpbmFsIGNvb3JkcywgYW5kXG4gICAgICAgIC8vIGhvcml6b250YWwvdmVydGljYWxcbiAgICAgICAgLy8gd2UgbmVlZCB0bzpcbiAgICAgICAgLy8gMSkgbWFrZSBzdXJlIHRoZSBwaWVjZSB3aWxsIG5vdCBmbG93IG9mZiBvZiB0aGUgYm9hcmRcbiAgICAgICAgLy8gMikgbWFrZSBzdXJlIHRoZSBwaWVjZSBpc24ndCBiZWluZyBwbGFjZWQgb24gdG9wIG9mIGFub3RoZXIgcGllY2VcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwTmFtZSwgbGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcG9zWCA9IGhvcml6b250YWwgPyB4ICsgaSA6IHg7XG4gICAgICAgICAgICBjb25zdCBwb3NZID0gaG9yaXpvbnRhbCA/IHkgOiB5ICsgaTtcbiAgICAgICAgICAgIGlmIChwb3NYIDwgMCB8fCBwb3NZIDwgMCB8fCBwb3NYID4gOSB8fCBwb3NZID4gOSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcCBmbG93aW5nIG9mZiB0aGUgYm9hcmQgZXJyb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vIHBpZWNlIGlzIGFscmVhZHkgaW4gdGhhdCBzcGFjZVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zWV1bcG9zWF0gPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1ldW3Bvc1hdID0gc2hpcE5hbWU7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBzaGlwIGlzIG5vdCBhbHJlYWR5IGluIHRoZSBtYXAgZGF0YXN0cnVjdHVyZSwgYWRkIGl0XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBzTWFwLmhhcyhzaGlwTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwc01hcC5zZXQoc2hpcE5hbWUsIHNoaXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhZGQgYXNzb2NpYXRlZCBjb29yZGluYXRlcyB0byB0aGUgc2hpcCdzIG1hcCBkYXRhIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgIC8vIHRoaXMuc2hpcHNNYXAuZ2V0KHNoaXApLnB1c2goeyB4OiBwb3NYLCB5OiBwb3NZIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ092ZXJsYXBwaW5nIHNoaXBzIGVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gdGFrZXMgYSBwYWlyIG9mIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIGlmIHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAgIC8vIHNlbmRzIGhpdCBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIGNvb3JkcyBvZiBtaXNzZWQgc2hvdFxuXG4gICAgLy8gaG93IHNob3VsZCB3ZSByZWNvcmQgY29vcmRzIG9mIG1pc3NlZCBzaG90PyBqdXN0IG9uIHRoZSBtYXAgYm9hcmQgaXRzZWxmIG9yXG4gICAgLy8gaW4gYSBkYXRhc3RydWN0dXJlP1xuXG4gICAgLy8gZG9uJ3QgYWxsb3cgYXR0YWNrcyBpZiBpdCBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXG4gICAgcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLmJvYXJkW3ldW3hdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gYWRkIGEgaGl0IHRvIHRoZSBib2F0IGFuZCBjaGFuZ2UgbWFwXG4gICAgICAgICAgICBsZXQgY3VycmVudFNoaXAgPSB0aGlzLnNoaXBzTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgY3VycmVudFNoaXAuaGl0KCk7XG4gICAgICAgICAgICBjdXJyZW50U2hpcC5pc1N1bmsoKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbeV1beF0gPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbeV1beF0gPSAzO1xuICAgICAgICAgICAgLy8gbWF5YmUgYWRkIHRoaXMgY29vcmQgdG8gYSBkYXRhc3RydWN0dXJlIGxhdGVyP1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQgPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2hpcCBoYXMgYWxyZWFkeSBiZWVuIGhpdCBoZXJlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXQgaGFzIGFscmVhZHkgYmVlbiBtaXNzZWQgaGVyZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hpcHNTdW5rKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtzaGlwTmFtZSwgc2hpcERldGFpbHNdIG9mIHRoaXMuc2hpcHNNYXApIHtcbiAgICAgICAgICAgIC8vIGlmIGFueSBzaGlwIGlzIG5vdCBzdW5rLCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGlmICghc2hpcERldGFpbHMuc3Vuaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBhbGwgc2hpcHMgc3VuaywgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgR2FtZUJvYXJkIH07XG4iLCJjb25zdCB7IEdhbWVCb2FyZCB9ID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTtcbi8vIGltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lQm9hcmQuanMnO1xuY2xhc3MgUGxheWVyIHtcbiAgICAvLyB0aGVyZSB3aWxsIGJlIHR3byB0eXBlcyBvZiBwbGF5ZXJzLiBSZWFsIHBsYXllcnMgYW5kIGNvbXB1dGVyIHBsYXllcnNcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJJRCwgZ3JpZElEKSB7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVCb2FyZCgpO1xuICAgICAgICB0aGlzLnBsYXllcklEID0gcGxheWVySUQ7XG4gICAgICAgIHRoaXMuZ3JpZElEID0gZ3JpZElEO1xuICAgICAgICB0aGlzLmJvYXJkSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMuZ3JpZElEfWApO1xuICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgICAgICAvLyB0aGlzLm15VHVybiA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyB0ZXN0aW5nIHRoZSBkb20gc3R1ZmYgaXMgb3V0c2lkZSB0aGUgc2NvcGUgb2YgdGhpcyBwcm9qZWN0LlxuICAgIC8vIG1ldGhvZCB0aGF0IHJlbmRlcnMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGdhbWVCb2FyZFxuICAgIHJlbmRlckJvYXJkKCkge1xuICAgICAgICAvLyBjb25zdCBib2FyZEhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLmdyaWRJRH1gKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUaWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbmV3VGlsZS5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7dGhpcy5ncmlkSUR9LXRpbGUtJHtpfSR7an1gKTtcbiAgICAgICAgICAgICAgICBuZXdUaWxlLnRleHRDb250ZW50ID0gdGhpcy5nYW1lQm9hcmQuYm9hcmRbaV1bal07XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZEhUTUwuYXBwZW5kQ2hpbGQobmV3VGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB3ZSBjYW4gY3JlYXRlIGEgbWV0aG9kIGhlcmUgdG8gcmFuZG9tbHkgcGxhY2Ugc2hpcHMgZm9yIHRoZSBib3RcblxuICAgIC8vIHVwZGF0ZUJvYXJkKCkgdXBkYXRlcyB0aGUgaHRtbCBib2FyZCBiYXNlZCBvbiB3aGF0IHBsYXllcnMgR2FtZUJvYXJkIGxvb2tzIGxpa2VcbiAgICB1cGRhdGVCb2FyZCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICBgIyR7dGhpcy5ncmlkSUR9LXRpbGUtJHtpfSR7an1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS50ZXh0Q29udGVudCA9IHRoaXMuZ2FtZUJvYXJkLmJvYXJkW2ldW2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLy8gY3JlYXRlIGV2ZW50IGxpc3RlbmVyXG4gICAgLy8gY3JlYXRlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIC8vICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgLy8gICAgICAgICAgICAgbGV0IGN1cnJlbnRUaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAvLyAgICAgICAgICAgICAgICAgYCMke3RoaXMuZ3JpZElEfS10aWxlLSR7aX0ke2p9YFxuICAgIC8vICAgICAgICAgICAgICk7XG5cbiAgICAvLyAgICAgICAgICAgICAvLyAvLyBpZiBjdXJyZW50VGlsZSBoYXMgYWxyZWFkeSBiZWVuIGNsaWNrZWQsIHJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgIC8vICAgICAgICAgICAgIC8vIGlmIChjdXJyZW50VGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWNrZWQgJykpIHtcbiAgICAvLyAgICAgICAgICAgICAvLyAgICAgY3VycmVudFRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xuICAgIC8vICAgICAgICAgICAgIC8vICAgICBjb250aW51ZTtcbiAgICAvLyAgICAgICAgICAgICAvLyB9XG4gICAgLy8gICAgICAgICAgICAgLy8gY3VycmVudFRpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgLy8gICAgIC8vIHJlbW92ZSBldmVudCBsaXN0ZW5lciBvbmNlIGNsaWNrZWQgaGVyZT9cbiAgICAvLyAgICAgICAgICAgICAvLyAgICAgLy8gYnV0IGlmIHdlIGRvIHRoYXQsIHRoZW4gaG93IGRvIHdlIGRlYWN0aXZhdGUvcmVhY3RpdmF0ZVxuICAgIC8vICAgICAgICAgICAgIC8vICAgICAvLyBhbGwgZXZlbnQgbGlzdGVuZXJzIHdoZW4gaXQgaXMvIGlzIG5vdCBwbGF5ZXIgdHVyblxuICAgIC8vICAgICAgICAgICAgIC8vICAgICB0aGlzLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGosIGkpO1xuICAgIC8vICAgICAgICAgICAgIC8vICAgICAvLyBjdXJyZW50VGlsZS5kYXRhc2V0LmNsaWNrZWQgPSAndHJ1ZSc7XG4gICAgLy8gICAgICAgICAgICAgLy8gICAgIGN1cnJlbnRUaWxlLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcbiAgICAvLyAgICAgICAgICAgICAvLyAgICAgdGhpcy51cGRhdGVCb2FyZCgpO1xuICAgIC8vICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgLy8gICAgICAgICAgICAgLy8gY2xpY2sgaGFuZGxlciBzZXBhcmF0ZSBmdW5jdGlvblxuICAgIC8vICAgICAgICAgICAgIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHRoZSBhdHRhY2tcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhqLCBpKTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAvLyBhZGQgY2xpY2tlZCBjbGFzcyB0byB0aGUgbGlzdCBzbyB3ZSBrbm93XG4gICAgLy8gICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAvLyB3aGVuIHlvdSByZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIgeW91IGNhbGwgaXQgd2l0aCB0aGUgZXhhY3RcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gc2FtZSBwYXJhbWV0ZXJzdGhhdCB3ZXJlIHVzZWQgd2hlbiBhZGRpbmcgaXRcbiAgICAvLyAgICAgICAgICAgICAgICAgY3VycmVudFRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGljayk7XG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQm9hcmQoKTtcbiAgICAvLyAgICAgICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICAgICAgLy8gaWYgdGlsZSBoYXMgYWxyZWFkeSBiZWVuIGNsaWNrZWQsIHdvbid0IGhhdmUgbGlzdGVuZXIgcmVhZGRlZFxuICAgIC8vICAgICAgICAgICAgIGlmIChjdXJyZW50VGlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWNrZWQnKSkge1xuICAgIC8vICAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNsaWNrKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgLy8gICAgICAgICAgICAgfVxuXG4gICAgLy8gICAgICAgICAgICAgY3VycmVudFRpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGljayk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gZGlzYWJsZUJvYXJkKCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAvLyAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgIC8vICAgICAgICAgICAgIGxldCBjdXJyZW50VGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgLy8gICAgICAgICAgICAgICAgIGAjJHt0aGlzLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWBcbiAgICAvLyAgICAgICAgICAgICApO1xuICAgIC8vICAgICAgICAgICAgIGN1cnJlbnRUaWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PlxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrKGV2ZW50KVxuICAgIC8vICAgICAgICAgICAgICk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgZ2V0VGlsZUNvb3JkaW5hdGVzKHRpbGUpIHtcbiAgICAgICAgY29uc29sZS5sb2codGlsZSk7XG4gICAgICAgIGNvbnN0IFtpLCBqXSA9IHRpbGUuaWQuc3BsaXQoJy0nKS5wb3AoKS5zcGxpdCgnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRpbGUuaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhbcGFyc2VJbnQoaSwgMTApLCBwYXJzZUludChqLCAxMCldKTtcbiAgICAgICAgcmV0dXJuIFtwYXJzZUludChpLCAxMCksIHBhcnNlSW50KGosIDEwKV07XG4gICAgfVxuICAgIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudFRpbGUuaWQpO1xuXG4gICAgICAgIGNvbnN0IFthLCBiXSA9IGN1cnJlbnRUaWxlLmlkLnNwbGl0KCctJykucG9wKCkuc3BsaXQoJycpO1xuICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgYSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGIpO1xuICAgICAgICAvLyBsZXQgW2ksIGpdID0gW3BhcnNlSW50KGEsIDEwKSwgcGFyc2VJbnQoYiwgMTApXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHR5cGVvZiBpKTtcbiAgICAgICAgY29uc3QgW2ksIGpdID0gdGhpcy5nZXRUaWxlQ29vcmRpbmF0ZXMoY3VycmVudFRpbGUpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdhbWVCb2FyZCk7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soaiwgaSk7XG5cbiAgICAgICAgY3VycmVudFRpbGUuY2xhc3NMaXN0LmFkZCgnY2xpY2tlZCcpO1xuXG4gICAgICAgIGN1cnJlbnRUaWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCb2FyZCgpO1xuICAgIH1cblxuICAgIGNyZWF0ZUV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgIGAjJHt0aGlzLmdyaWRJRH0tdGlsZS0ke2l9JHtqfWBcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaWxlLmNsYXNzTGlzdC5jb250YWlucygnY2xpY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZUxpc3RlbmVycygpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICBgIyR7dGhpcy5ncmlkSUR9LXRpbGUtJHtpfSR7an1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgUGxheWVyIH07XG4vLyBleHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgICAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gaGl0IGZ1bmN0aW9uIGluY3JlYXNlcyBudW1iZXIgb2YgaGl0cyB0byB5b3VyIHNoaXBcbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgICB9XG5cbiAgICAvLyBpc1N1bmsoKSBjYWxjdWxhdGVzIHdoZXRoZXIgYSBzaGlwIGlzIGNvbnNpZGVyZWQgc3VuayBiYXNlZCBvbiBpdCdzIGxlbmd0aCBhbmQgbnVtaGl0cyBpdCBoYXMgcmVjZWl2ZWRcbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVzSGl0ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgU2hpcCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IHsgUGxheWVyIH0gPSByZXF1aXJlKCcuL3BsYXllcicpO1xuLy8gMSB0cnkgdG8gcHV0IHBpZWNlcyBvbiB0aGUgYm9hcmRcbmNvbnNvbGUubG9nKCd0ZXN0aW5nJyk7XG4vLyAxKSBjcmVhdGUgdGhlIHBpZWNlcywgaWQgdGhlIHBpZWNlcywgcG9wdWxhdGUgdGhlIHBpZWNlcyB3aXRoIDBzXG5cbmNvbnN0IHBsYXllcjEgPSBuZXcgUGxheWVyKCdwbGF5ZXIxJywgJ2dyaWQtMScpO1xuY29uc3QgcGxheWVyMiA9IG5ldyBQbGF5ZXIoJ3BsYXllcjInLCAnZ3JpZC0yJyk7XG5cbnBsYXllcjEucmVuZGVyQm9hcmQoKTtcbnBsYXllcjEudXBkYXRlQm9hcmQoKTtcblxucGxheWVyMi5nYW1lQm9hcmQucGxhY2VTaGlwKCd0ZXN0JywgMiwgMiwgMywgdHJ1ZSk7XG5wbGF5ZXIyLnJlbmRlckJvYXJkKCk7XG5cbnBsYXllcjIuY3JlYXRlRXZlbnRMaXN0ZW5lcnMoKTtcbnBsYXllcjIucmVtb3ZlTGlzdGVuZXJzKCk7XG5cbmxldCBnYW1lT3ZlciA9IGZhbHNlO1xuXG4vLyAxKSBtYXliZSBzdGFydCB3aXRoIGF0dGFja2luZ1xuLy8gICAgaW4gb3JkZXIgdG8gYXR0YWNrIHdoZW4gbXkgbW91c2UgaXMsIGkgbmVlZCBhbiBldmVudCBsaXN0ZW5lciBmb3IgZXZlcnkgZW5lbXlcbi8vICAgIHRpbGUgdG8gZGV0ZXJtaW5lIHdoZW4gYSB0aWxlIGlzIGNsaWNrZWRcbi8vICAgIHB1dCBldmVudCBsaXN0ZW5lcnMgaW4gdGhpcyBtb2R1bGU/IE9yIHB1dCB0aGVtIGluIHBsYXllciBtb2R1bGU/XG4vLyAxKSBsZXQncyB0cnkgdGhpcyBtb2R1bGVcblxuLy8gMikgdGhlbiBwbGFjZSBwaWVjZXNcblxuLy8gZXZlbnQgbGlzdGVuZXJcbi8vIHdoaWxlICghZ2FtZU92ZXIpIHtcblxuLy8gfVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9