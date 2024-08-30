const { GameBoard } = require('./gameBoard');
// import GameBoard from './gameBoard.js';
class Player {
    // there will be two types of players. Real players and computer players
    constructor() {
        this.gameBoard = new GameBoard();
    }
}

module.exports = { Player };
// export default Player;
