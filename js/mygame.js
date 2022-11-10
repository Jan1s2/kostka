const dices = document.getElementById("dices");
const play = document.getElementById("game");
const settings = document.getElementById("settings");
const reset = document.getElementById("reset");

let players = [];
let timer = false;
let tmpPoints = [];
let timeout = 100;

const dice_images = [
    "img/kostka1.png",
    "img/kostka2.png",
    "img/kostka3.png",
    "img/kostka4.png",
    "img/kostka5.png",
    "img/kostka6.png",
];

const generate = {
    dice: (id, size) => {
        return `<div class="col-md-${size} text-center mt-1">
            <img class="dice col-xs-12" id="dice${id}" src="img/kostka6.png" alt="Kostka">
            <div id="results${id}" class="mt-3 col-xs-12"></div>
        </div>`;
    },
    /** @param {Player} player */
    results: (player, size) => {
        return `<div class="text-center">
        <h3>Aktuální hod: ${player.getLastPoints()} </h3>
        <p>Počet hodů: ${player.getRounds()} </p>
        <p>Součet hodů: ${player.getPoints()} </p>
        <p>Průměr hodů: ${player.getAverage()} </p>
        <p>Nejvyšší hod: ${player.getMax()} </p>
        <p>Nejnižší hod: ${player.getMin()} </p>
        </div>
        `;
    },
};

class Player {
    constructor(id) {
        this.id = id;
        this.rounds = 0;
        this.points = 0;
        this.lastPoints = 0;
        this.history = [];
        this.max = Number.MIN_SAFE_INTEGER;
        this.min = Number.MAX_SAFE_INTEGER;
    }
    getId() {
        return this.id;
    }
    getImage() { }

    addRounds(rounds = 1) {
        this.rounds += rounds;
    }
    getRounds() {
        return this.rounds;
    }

    addPoints(points) {
        this.lastPoints = points;
        this.points += points;
        this.history.push(points);
        if (points > this.max) {
            this.max = points;
        }
        if (points < this.min) {
            this.min = points;
        }
    }
    getLastPoints() {
        return this.lastPoints;
    }
    getPoints() {
        return this.points;
    }

    getHistory() {
        return this.history;
    }
    getAverage() {
        return (this.getPoints() / this.getRounds()).toFixed(2);
    }
    getMax() {
        return this.max;
    }
    getMin() {
        return this.min;
    }
    getDice() {
        return document.getElementById(`dice${this.id}`);
    }
    setDiceImage(image) {
        this.getDice().src = image;
    }
    getResults() {
        return document.getElementById(`results${this.id}`);
    }
}

function animace(players) {
    players.forEach((current) => {
        var id = current.getId();
        tmpPoints[id] = Math.ceil(Math.random() * 6);
        current.setDiceImage(dice_images[tmpPoints[id] - 1]);
    });
}

function assignPoints(players) {
    players.forEach((current) => {
        var id = current.getId();
        current.addPoints(tmpPoints[id]);
        current.addRounds();
    });
}

function renderResults() {
    players.forEach((player) => {
        var results = player.getResults();
        results.innerHTML = "";
        results.innerHTML += generate.results(player, 12 / players.length);
    });
}

play.addEventListener("click", () => {
    const timeout = document.getElementById("timeout").value;
    if (document.getElementById("players").value < 1) {
        alert("Error: invalid number of players");
    } else if (timeout < 25 || timeout > 2500 || isNaN(timeout)) {
        alert("Error: invalid timeout");
    } else {
        if (players.length === 0) {
            reset.hidden = false;
            dices.innerHTML = "";
            const num = document.getElementById("players").value;
            let blockSize;
            // Special case for 5

            var specialCase = false;
            var specialCaseIterations;
            if(num != 5) {
                blockSize = num > 6 ? 2 : Math.floor(12 / num); 
            } else {
                blockSize = 3;
            }
            if (Math.floor(num % 6) % 5 == 0) {
                specialCase = true;
                specialCaseIterations = Math.floor(num / 6);

            }
            for (var i = 0; i < num; i++) {
                players[i] = new Player(i);
                if(num > 6 && i > (num - 6) && i % 6 == 0) {
                    blockSize = Math.ceil(12 / (num % 6));
                } else if (specialCase && i == 4 + (specialCaseIterations * 6)) {
                    blockSize = 12;
                }
                dices.innerHTML += generate.dice(i, blockSize);
            }
            settings.hidden = true;
        }
        if (!timer) {
            timer = setInterval(animace, timeout, players);
            play.innerText = "STOP";
        } else {
            clearInterval(timer);
            timer = false;
            assignPoints(players);
            renderResults();
            play.innerText = "Hraj";
        }
    }
});

reset.addEventListener("click", () => {
    clearInterval(timer);
    timer = false;
    play.innerText = "Hraj";
    players = [];
    dices.innerHTML = "";
    dices.innerHTML += generate.dice("", 12);
    reset.hidden = true;
    settings.hidden = false;
});
