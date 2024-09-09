const { GameBoard } = require('./gameBoard');
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
            placeShipRandomly(ships[i][0], ships[i][1], ships[i][2], gameBoard);
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
                placeShipRandomly(shipName, length, horizontal, gameBoard);
            }
        }
    }
}

module.exports = { Player };
// export default Player;
