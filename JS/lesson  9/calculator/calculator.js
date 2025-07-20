let calculation = localStorage.getItem('calculation') || '';

function calculate() {
    let result = eval(calculation);
    if (result !== undefined) {
        document.querySelector('.js-output').innerHTML = result;
        calculation = '';
    }
}

function updateOutput(str) {
    calculation += str;
    localStorage.setItem('calculation', calculation);
    const jsOutput = document.querySelector('.js-output');
    jsOutput.innerHTML = calculation;
}

function cleanOutput() {
    document.querySelector('.js-output').innerHTML = ' ';
    localStorage.setItem('calculation', '');
}