const { GameBoard } = require('./gameBoard');
// import GameBoard from './gameBoard.js';
class Player {
    // there will be two types of players. Real players and computer players
    constructor(playerID, gridID) {
        this.gameBoard = new GameBoard();
        this.playerID = playerID;
        this.gridID = gridID;
        this.boardHTML = document.querySelector(`#${this.gridID}`);

        // bind handleclick method to the instance of the player classoka
        this.handleClick = this.handleClick.bind(this);
        this.myTurn = false;
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
        // TOGGLE PLAYER TURN HERE (after a successful move?)

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
