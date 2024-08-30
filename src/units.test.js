// const { sum } = require('./index');
// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
// });

// testing ship class
const { Ship } = require('./ship');
const { GameBoard } = require('./gameBoard');

test('Ship constructor initializes with correct values', () => {
    const ship = new Ship(test, 3);
    expect(ship.length).toBe(3);
    expect(ship.timesHit).toBe(0);
    expect(ship.sunk).toBe(false);
});

test('Ship hit method properly increments the timesHit', () => {
    const ship = new Ship(test, 3);
    ship.hit();
    expect(ship.timesHit).toBe(1);
});

test('Ship isSunk method properly sinks ships', () => {
    const ship = new Ship(test, 3);
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
    expect(gameBoard.shipsMap.size).toEqual(0);
});

test('GameBoard placeShip() properly places a ship if there are not yet ships', () => {
    const gameBoard = new GameBoard();
    gameBoard.placeShip('test', 2, 2, 3, true);
    expect(gameBoard.board).toEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'test', 'test', 'test', 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    // expect(Array.from(gameBoard.shipsMap)).toEqual([
    //     [
    //         'test',
    //         [
    //             { x: 2, y: 2 },
    //             { x: 3, y: 2 },
    //             { x: 4, y: 2 },
    //         ],
    //     ],
    // ]);
    let testShip = new Ship('test', 3);
    expect(gameBoard.shipsMap.get('test')).toEqual(testShip);
});

// gameboard error handling
describe('GameBoard placeShip() error handling', () => {
    let gameBoard;

    //creates a new independent gameboard before each test
    beforeEach(() => {
        gameBoard = new GameBoard();
    });

    test('GameBoard throws error if ship flows off board horizontally', () => {
        expect(() => {
            gameBoard.placeShip('test', 7, 0, 5, true);
        }).toThrow('Ship flowing off the board error');
    });

    test('GameBoard throws an error if ship flows off the board vertically', () => {
        expect(() => {
            gameBoard.placeShip('test', 9, 9, 5, false);
        }).toThrow('Ship flowing off the board error');
    });

    test('GameBoard throws an error is there is an overlapping ship', () => {
        gameBoard.placeShip('test', 2, 2, 3, true);
        expect(() => {
            gameBoard.placeShip('test2', 2, 2, 3, true);
        }).toThrow('Overlapping ships error');
    });
});

// gameBoard receiveAttack() testing
test('GameBoard receiveAttack() works when ship is attacked', () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip('test', 2, 2, 3, true);
    gameBoard.receiveAttack(2, 2);
    gameBoard.receiveAttack(3, 2);
    let attackedShip = gameBoard.shipsMap.get('test');
    expect(attackedShip.timesHit).toEqual(2);
});

// testing errors for receiveAttack()

describe('GameBoard receiveAttack() error handling', () => {
    let gameBoard;

    //creates a new independent gameboard before each test
    beforeEach(() => {
        gameBoard = new GameBoard();
    });

    test('GameBoard throws error if you attack a space where you have already destroyed a ship', () => {
        gameBoard.placeShip('test', 2, 2, 3, true);
        gameBoard.receiveAttack(2, 2);
        expect(() => {
            gameBoard.receiveAttack(2, 2);
        }).toThrow('ship has already been hit here');
    });

    test('GameBoard throws error if you attack a space where you have already missed', () => {
        gameBoard.placeShip('test', 2, 2, 3, true);
        gameBoard.receiveAttack(4, 4);
        expect(() => {
            gameBoard.receiveAttack(4, 4);
        }).toThrow('target has already been missed here');
    });
});

describe('GameBoard isSunk testing', () => {
    let gameBoard;
    beforeEach(() => {
        gameBoard = new GameBoard();
    });
    test('GameBoard isSunk works when ship is sunk', () => {
        // let gameBoard = new GameBoard();
        gameBoard.placeShip('test', 2, 2, 3, true);
        gameBoard.receiveAttack(2, 2);
        gameBoard.receiveAttack(3, 2);
        gameBoard.receiveAttack(4, 2);
        // let attackedShip = gameBoard.shipsMap.get('test');
        expect(gameBoard.shipsSunk()).toBe(true);
    });
    test('GameBoard isSunk works when ship is not sunk', () => {
        // let gameBoard = new GameBoard();
        gameBoard.placeShip('test', 2, 2, 3, true);
        gameBoard.receiveAttack(2, 2);
        gameBoard.receiveAttack(3, 2);
        // let attackedShip = gameBoard.shipsMap.get('test');
        expect(gameBoard.shipsSunk()).toBe(false);
    });
});
