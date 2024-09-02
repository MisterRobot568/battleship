const { Player } = require('./player');
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
                newTile.textContent = this.player.gameBoard.board[i][j];
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
                currentTile.textContent = this.player.gameBoard.board[i][j];
            }
        }
    }
}

module.exports = { DomManager };
