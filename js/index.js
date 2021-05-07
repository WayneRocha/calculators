const calculatorElements = {
    buttons: document.querySelectorAll('#calculadora tr td:not(#result)'),
    visor: document.querySelector('#result')
}
const calculatorValues = {
    expression: '0',
    result: 0
}
function addEventListnersToButtons(){
    calculatorElements.buttons.forEach(button => {
        button.addEventListener('click', getElementText);
    });
}
function getElementText(){
    expressionHandler(this.outerText);
}
function addKeyboardListner(){
    window.addEventListener('keydown', event => {
        let keyPressed = event.key;
        const needReplace = {
            '0': '0',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
            'Delete': 'AC',
            'Backspace': '<',
            'Enter': '=',
            '(': '(',
            ')': ')',
            '-': '-',
            '+': '+',
            '/': '/',
            '*': '*',
            '.': '.',
            ',': ','
        };
        if (needReplace[keyPressed]){
            keyPressed = needReplace[keyPressed];
            expressionHandler(keyPressed);
        }
    });
}
function expressionHandler(command){
    const commandActions = {
        'AC': () => {
            calculatorValues.expression = '';
        },
        '<': () => {
            const expressionWithoutLastValue = calculatorValues.expression.substr(0, calculatorValues.expression.length - 1);
            calculatorValues.expression = expressionWithoutLastValue;
        },
        '=': () => {
            solveExpression();
        }
    }

    const commandAction = commandActions[command];
    if (commandAction) {
        commandAction();
    } else {
        calculatorValues.expression += command;
    }
    calculatorElements.visor.innerHTML = calculatorValues.expression;
}
function compileExpression() {
    let correctExpression = '';
    const correctCharacters = {
        ',': '.',
        'x': '*',
        '÷': '/'
    }
    for (const char of calculatorValues.expression){
        correctExpression += correctCharacters[char] ? correctCharacters[char] : char;
    }
    return correctExpression;
}
function solveExpression() {
    try {
        calculatorValues.result = math.evaluate(compileExpression());
        calculatorValues.expression = calculatorValues.result;
    } catch {
        alertError();
    }
    calculatorElements.visor.innerHTML = calculatorValues.result;
}
function alertError(){
    calculatorElements.visor.style.color = 'red';
    setTimeout(() => calculatorElements.visor.style.color = 'black', 1000);
}

addEventListnersToButtons();
addKeyboardListner();