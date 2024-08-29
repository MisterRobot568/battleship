// const { sum } = require('./index');
// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
// });

// testing ship class
const { Ship } = require('./ship');
const { GameBoard } = require('./gameBoard');

test('Ship constructor initializes with correct values', () => {
    const ship = new Ship(3, 0);
    expect(ship.length).toBe(3);
    expect(ship.timesHit).toBe(0);
    expect(ship.sunk).toBe(false);
});

test('Ship hit method properly increments the timesHit', () => {
    const ship = new Ship(3, 0);
    ship.hit();
    expect(ship.timesHit).toBe(1);
});

test('Ship isSunk method properly sinks ships', () => {
    const ship = new Ship(3, 0);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.isSunk();
    expect(ship.sunk).toBe(true);
});
// GameBoard Testing
test('GameBoard initializes with correct values', () => {
    const gameBoard = new GameBoard();
    expect(gameBoard.board).toEqual([
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
    ]);
    expect(gameBoard.shipsObj).toEqual({});
});

test('GameBoard placeShip() properly places a ship', () => {
    const gameBoard = new GameBoard();
    gameBoard.placeShip([2, 2, 2], [2, 3, 4]);
    expect(gameBoard.board).toEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    expect(gameBoard.shipsObj).toEqual({
        ship: { length: 3, timesHit: 0, sunk: false },
        xCoordinates: [2, 2, 2],
        yCoordinates: [2, 3, 4],
    });
});
