const { GameBoard } = require('./gameBoard');
const { Player } = require('./player');
const { DomManager } = require('./domManager');

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
