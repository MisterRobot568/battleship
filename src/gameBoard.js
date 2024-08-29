const { Ship } = require('./ship');
class GameBoard {
    constructor() {
        this.board = [
            // 0 = water
            // 1 = ship
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
        this.shipsObj = {};
    }
    // should be able to place ships at specific coords by calling the ship class
    // need to make sure ship is placed on valid coords, not outside the board
    // place ships horizontally or vertically

    // is placeship given one set of coordinates? or is given a Z number of coords
    // based on Z length of a ship?
    placeShip(xCoords, yCoords) {
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
        let ship = new Ship(xCoords.length);
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
        this.shipsObj.ship = new Ship(xCoords.length);
        this.shipsObj.xCoordinates = xCoords;
        this.shipsObj.yCoordinates = yCoords;

        // place the ship on the board
        for (let i = 0; i < xCoords.length; i++) {
            if (this.board[yCoords[i]][xCoords[i]] === 1) {
                throw new Error('Overlapping ships');
            } else {
                this.board[yCoords[i]][xCoords[i]] = 1;
            }
        }
    }
}
module.exports = { GameBoard };
