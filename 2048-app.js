'use strict'

// Variables _______________________________________________________________________________________________
const len = 4;
let arr = [];
let moveCount = 0;
let timer;
let currentTime = 1;
let score = 0;
let highScore = 0;

// Generate a empty array __________________________________________________________________________________
function zeroArray(arr) {
    for (let i = 0; i < len; i++) {
        arr[i] = [];
        for (let j = 0; j < len; j++) {
            arr[i][j] = 0;
        }
    }
}

//renderOutput Board Cells _________________________________________________________________________________
function renderOutput() {
    for (let i = 0; i < arr.flat().length; i++) {
        document.querySelectorAll('.board-cell')[i].textContent = 2 ** (arr.flat()[i]);
        if (document.querySelectorAll('.board-cell')[i].textContent == 1) {
            document.querySelectorAll('.board-cell')[i].textContent = ""
        }
    }
}

// Set color for each value ________________________________________________________________________________
function setColor() {
    for (let i = 0; i < len ** 2; i++) {
        const cell = document.querySelectorAll('.board-cell');
        for (let j = 1; j < 12; j++) {
            if (cell[i].textContent == 2 ** j) {
                cell[i].style.backgroundColor = `rgb(${12 * j},${22 * j},${15 * j})`
            }
            if (cell[i].textContent == 0) {
                cell[i].style.backgroundColor = `rgb(52, 92, 104)`
            }
        }
    }
}

//afterMove ________________________________________________________________________________________________
function afterMove(isMoved) {
    let twoHeight = Math.trunc(Math.random() * len);
    let twoWidth = Math.trunc(Math.random() * len);
    if (isMoved) {
        if (arr[twoHeight][twoWidth] == 0) {
            arr[twoHeight][twoWidth] = 1
        }
        else {
            afterMove()
        }
    }
}

// Mirror __________________________________________________________________________________________________
function mirror() {
    let altArr = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < arr.length; i++) {
            altArr[i][j] = arr[i][arr.length - 1 - j];
        };
    };
    arr = altArr

}

// Transpose _______________________________________________________________________________________________
function transpose() {
    let altArr = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < arr.length; i++) {
            altArr[i][j] = arr[j][i];
        };
    };
    arr = altArr

}

// generate two random in start ____________________________________________________________________________
function initRandom() {
    let i = Math.trunc(Math.random() * 4);
    let j = Math.trunc(Math.random() * 4);
    let x = Math.trunc(Math.random() * 4);
    let y = Math.trunc(Math.random() * 4);
    arr[i][j] = 1;
    arr[x][y] = 1;
}

// Win the game ____________________________________________________________________________________________
function win() {
    for (let i = 0; i < arr.flat().length; i++) {
        if (arr.flat()[i] == 11) {
            document.querySelector('body').style.backgroundColor = 'rgb(12,200,70)'

        }
    }
}

//loose ____________________________________________________________________________________________________
function loose() {
    let looseCounter = 0;
    for (let i = 0; i < 4; i++) {
        for (let z = 0; z < 4; z++) {

            if (arr[i][z] == arr[i][z + 1] || arr[z][i] == arr[z][i + 1] || arr[i][z] == 0 || arr[z][i] == 0) {
                looseCounter += 1
            }
        }
    }
    if (looseCounter == 0) {
        document.querySelector('body').style.backgroundColor = 'rgb(200,0,0)'
        console.log('Looser')
        stopTimer();
    }
}

// Timer ___________________________________________________________________________________________________
function startTimer() {
    currentTime = 1;
    if (timer) {
        stopTimer();
    };
    timer = setInterval(function () {
        document.querySelector('#time').textContent = currentTime;
        currentTime++;
    }, 1000
    );
}
function stopTimer() {
    clearInterval(timer);
}

//Score and Highscore _______________________________________________________________________________________
function showScore() {
    //Score
    document.querySelector('#score-number').textContent = score;

    //Highscore
    if (score > highScore) {
        highScore = score;
        document.querySelector('#highscore-number').textContent = highScore;
    }
}

// Move _____________________________________________________________________________________________________
function move() {
    let isMoved = false;


    // Start timer
    if (currentTime == 1) {
        startTimer()
    }
    //Merge similar numbers
    for (let i = 0; i < arr.length; i++) {

        // Remove zero
        for (let j = arr[i].length - 1; j >= 0; j--) {
            if (arr[i][j] == 0) {
                arr[i].splice(j, 1);
                for (let k = j - 1; k >= 0; k--) {
                    if (arr[i][k] != 0) {
                        isMoved = true;
                    }
                }
            }
        }

        //Merge
        let sc = []
        let num = [];
        for (let z = arr[i].length - 1; z > 0; z--) {
            if (arr[i][z] == arr[i][z - 1]) {
                num.unshift(arr[i][z] + 1)
                sc.unshift(arr[i][z] + 1)
                arr[i].splice(z, 1);
                arr[i].splice(z - 1, 1);
                isMoved = true;
            }
            if (arr[i][z] != arr[i][z - 1] && arr[i][z]) {
                num.unshift(arr[i][z])
                arr[i].splice(z, 1);
            }
        }

        for (let x = 0; x < num.length; x++) {
            arr[i].push(num[x]);
            if (sc[x]) {
                score += 2 ** sc[x];

            }
        }

        //fill the array with zero
        while (arr[i].length != len) {
            arr[i].unshift(0)
        }
    }

    // loose condition
    loose();

    //score and highscore
    showScore()

    // win condition
    win()

    // Move Counter
    if (isMoved) {
        moveCount += 1
        document.querySelector('#move').textContent = moveCount;
    }

    //generate a new '2'
    afterMove(isMoved)

}

// Actions after oppening ___________________________________________________________________________________
zeroArray(arr);
initRandom()
renderOutput();
setColor();

// action on each press _____________________________________________________________________________________
document.addEventListener("keydown", function (e) {
    if (e.key == 'ArrowRight') {
        move()
    }
    if (e.key == 'ArrowDown') {
        transpose();
        move()
        transpose()
    }
    if (e.key == 'ArrowLeft') {
        mirror()
        move()
        mirror()
    }
    if (e.key == 'ArrowUp') {
        transpose()
        mirror()
        move()
        mirror()
        transpose()
    }

})
document.addEventListener('keydown', renderOutput)
document.addEventListener('keydown', setColor)

// New game Button _________________________________________________________________________________________
document.querySelector('#btn-new').addEventListener('click', function () {
    zeroArray(arr);
    initRandom()
    renderOutput();
    setColor();
    stopTimer();
    currentTime = 1;
    moveCount = 0;
    score = 0;
    document.querySelector('#move').textContent = 0;
    document.querySelector('#time').textContent = 0;
    document.querySelector('#score-number').textContent = 0;
})