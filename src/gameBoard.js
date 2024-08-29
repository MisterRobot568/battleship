const { Ship } = require('./ship');
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
