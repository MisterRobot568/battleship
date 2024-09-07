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

                let newTextContent = this.player.gameBoard.board[i][j];
                newTile.textContent = newTextContent;
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
                currentTile.textContent = this.player.gameBoard.board[i][j];
            }
        }
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
    }
}

module.exports = { DomManager };
