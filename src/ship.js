class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.timesHit = 0;
        this.sunk = false;
    }
    // hit function increases number of hits to your ship
    hit() {
        this.timesHit += 1;
    }

    // isSunk() calculates whether a ship is considered sunk based on it's length and numhits it has received
    isSunk() {
        if (this.timesHit >= this.length) {
            this.sunk = true;
        }
    }
}

module.exports = { Ship };
