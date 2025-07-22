const intArr = [1, 4, 44, 23, 664, 21, 3, 6, 3, 55, 98, 9];
const intArrReverse = [9, 98, 55, 3, 6, 3, 21, 664, 23, 44, 4, 1];
const strArr = ['black', 'white', 'green', 'orange', 'black', 'black', 'white', 'green', 'green', 'white'];

function getLastValue() {
    return intArr[intArr.length-1];
}

function swapArr() {
    const arr = [];

    for (let i = intArr.length-1; i >= 0; i--) {
        arr.push(intArr[i]);
    }

    console.log(arr);
}

function increaseBy(int) {
    const arr = [];

    for (let i = 0; i < intArr.length; i++) {
        arr[i] = intArr[i] + int;
    }

    console.log(arr);
}

function addArrays() {
    const arr = [];
    for (let i = 0; i < intArr.length; i++) {
        arr[i] = intArr[i] + intArrReverse[i];
    }

    console.log(arr);
}

function countPositive(arr) {
    let countPositive = 0;
    let countNegative = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= 0) countPositive++;
        else if (arr[i] < 0) countNegative++;
    }

    console.log(`Positive values: ${countPositive}, Negative values: ${countNegative}`);
}

function countWords() {
    const items = [];
    const amountOfItems = [];

    for (let i = 0; i < strArr.length; i++) {
        
    }
}