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

    generateRandomSetup() {
        // given a list of ships, generate a random setup for them
        let ships = this.ships;
        for (let i = 0; i < ships.length; i++) {
            // let {name, length} = ships[i]
            // placeShipRandomly(ships[i][0], ships[i][1], ships[i][2]);
            placeShipRandomly.call(this, ships[i][0], ships[i][1], ships[i][2]);
            //UNDERSTAND WHY WE'RE USING "CALL" and "THIS" HERE
        }
        function placeShipRandomly(shipName, length, horizontal) {
            const randomX = Math.floor(Math.random() * 10);
            const randomY = Math.floor(Math.random() * 10);
            try {
                this.placeShip(shipName, randomX, randomY, length, horizontal);
            } catch (error) {
                // return placeShipRandomly(shipName, length, horizontal);
                placeShipRandomly.call(this, shipName, length, horizontal);
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
