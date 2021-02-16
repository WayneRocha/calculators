var accountCalc = '';
var account = '';
var result;

addEventListenersToCalculator();

function addEventListenersToCalculator() {
    const buttons = document.getElementsByClassName('calc-btn');
    for (let i = 0; i <= buttons.length - 1; i++) {
        buttons[i].addEventListener('click', calculator);
    }
    document.addEventListener('keydown', KeyboardListener);
}
function calculator(isKeyboardEvent = false, key = '') {
    var btnId;
    var btnContent;

    if (isKeyboardEvent === true) {
        btnId = key;
        btnContent = key;
    } else {
        btnId = this.id;
        btnContent = this.innerText;
    }

    buttonActions();

    function buttonActions() {
        let isNumericBtn = Number.isInteger(parseInt(btnContent));
        let isOperatorBtn = isOperator(btnContent);
        let isEraseOperatorBtn = btnId == 'delete';
        let isEraseAllOperatorBtn = btnId == 'delete-all';
        let isCommaBtn = btnContent == ',';
        let isParenthesesBtn = btnContent == '(' || btnContent == ')';
        let isEqualityOperatorBtn = btnContent == '=';
        let resultIsTithe = false;

        if (isNumericBtn) {
            account += btnContent;
        }
        else if (isOperatorBtn) {
            if (noRepeatedOperator()) {
                account += btnContent;
            }
        }
        else if (isCommaBtn) {
            if (noRepeatedComma()) {
                account += btnContent;
            }
        }
        else if (isParenthesesBtn) {
            account += btnContent;
        }
        else if (isEraseOperatorBtn) {
            account = deleteLastArgument(account);
            refreshVisor(false, true);
        }
        else if (isEraseAllOperatorBtn) {
            account = '';
            refreshVisor(true, true);
        }
        else if (isEqualityOperatorBtn) {
            if (isLastValueValid()) {
                accountCalc = normalizeExpression(account);
                calculateResult();
            }
        }
        else {
            refreshVisor(false, true);
        }
        refreshVisor(false, false, resultIsTithe);
    }

    function calculateResult() {
        let expression = createReversePolishNotation();
        if(expression == undefined){
            console.log('calc error :(');
        }
        result = resolveReversePolishNotation(expression);

        function createReversePolishNotation() {
            let expression = expressionToArray(accountCalc);
            let stack = new Array;
            let operatorStack = new Array;

            //Shunting-yard Algorithm
            while (expression.length > 0) {
                let token = expression[0];

                if (typeof(token) == 'number') {
                    stack.push(expression.shift());
                }
                else if (isOperator(token, true)) {
                    while (isOperator(operatorStack[operatorStack.length - 1], true) && DoHaveMorePrecendence(operatorStack[operatorStack.length - 1], token)) {
                        stack.push(operatorStack.pop());
                    }
                    operatorStack.push(expression.shift());
                }
                else if (token == '('){
                    operatorStack.push(expression.shift());
                }else if (token == ')'){
                    while (operatorStack[operatorStack.length - 1] != '('){
                        if (operatorStack.length == 0){
                            return;
                        }
                        stack.push(operatorStack.pop());
                    }
                    operatorStack.pop();
                }
            }
            while (operatorStack.length > 0){
                if (operatorStack[operatorStack.length - 1] == '(' || operatorStack[operatorStack.length - 1] == ')'){
                    return;
                }
                stack.push(operatorStack.pop());
            }

            return stack;

            function expressionToArray(val) {
                let numberElements = new Array;
                let stack = new Array;

                for (let i = 0; i <= val.length - 1; i++) {
                    let isNumericOrDot = (Number.isInteger(parseInt(val[i]))) || (val[i] === '.');

                    if (isNumericOrDot) {
                        if (val[i] === '.') {
                            numberElements.push(val[i]);
                        } else {
                            numberElements.push(parseInt(val[i]));
                        }
                        if (i == val.length - 1) {
                            addNumberToStack();
                        }
                    }
                    else {
                        addNumberToStack();
                        stack.push(val[i]);
                    }
                    function addNumberToStack() {
                        if (numberElements.length > 0) {
                            stack.push(convertToIntOrFloat(numberElements));
                            numberElements = new Array;
                        }

                        function convertToIntOrFloat(numberArray) {
                            let joinedArray = numberArray.join('');

                            if (parseFloat(joinedArray).toFixed(1) % 1 === 0) {
                                return parseInt(joinedArray);
                            } else {
                                return parseFloat(joinedArray);
                            }
                        }
                    }
                }

                return stack;
            }
        }
        function resolveReversePolishNotation(expression) {
            return;
        }
    }
    function normalizeExpression(exp) {
        exp = exp.split('');
        for (let i = 1; i <= exp.length - 1; i++) {
            if (exp[i] === '÷') {
                exp[i] = '/';
            }
            else if (exp[i] === 'x') {
                exp[i] = '*';
            }
            else if (exp[i] === ',') {
                exp[i] = '.';
            }
        }
        return exp.join('');
    }
    function deleteLastArgument(val) {
        return val.substring(0, account.length - 1);
    }
    function noRepeatedOperator() {
        let lastArgumentOfAccont = account.substr(account.length - 1, 1);

        return !(isOperator(lastArgumentOfAccont) && isOperator(btnContent));
    }
    function noRepeatedComma() {
        let lastArgumentOfAccont = account.substr(account.length - 1, 1);
        
        return !(lastArgumentOfAccont == ',' && btnContent == ',');
    }
    function isLastValueValid() {
        let lastArgumentOfAccont = account.substr(account.length - 1, 1);

        isValid = (!isOperator(lastArgumentOfAccont) && lastArgumentOfAccont != '(') && lastArgumentOfAccont != ',';

        if (isValid) {
            return true;
        }
        else {
            account = deleteLastArgument(account);
            return false;
        }
    }
    function isOperator(val, computerSimbols = false) {
        if (computerSimbols) {
            return val == '+' || val == '-' || val == '*' || val == '/';
        } else {
            return val == '+' || val == '-' || val == 'x' || val == '÷';
        }
    }
    function DoHaveMorePrecendence(val1, val2){
        return (val1 == '*' || val1 == '/') && (val2 == '-' || val2 == '+');
    }
    function refreshVisor(cleanAccount = false, cleanResult = false, resultIsTithe = false) {
        const visorAccount = document.getElementById('calc');
        const visorResult = document.getElementById('result');

        if (cleanResult) {
            result = undefined;
        }
        if (cleanAccount) {
            account = '';
        }
        if (result != undefined) {
            visorResult.innerText = result;
            if (resultIsTithe) {
                visorResult.innerText += '... ';
            }
        }
        else {
            visorResult.innerText = '';
        }

        visorAccount.innerText = account;
    }
}
function KeyboardListener(key) {
    let keyPressed = key.key;
    const validKey = Number.isInteger(parseInt(keyPressed)) ||
        keyPressed == '+' ||
        keyPressed == '-' ||
        keyPressed == '*' ||
        keyPressed == '/' ||
        keyPressed == '(' ||
        keyPressed == ')' ||
        keyPressed == ',' ||
        keyPressed == '.' ||
        keyPressed == 'Backspace' ||
        keyPressed == 'Delete' ||
        keyPressed == 'Enter';

    if (validKey) {
        if (keyPressed == '*') {
            keyPressed = 'x';
        }
        else if (keyPressed == '/') {
            keyPressed = '÷';
        }
        else if (keyPressed == 'Backspace') {
            keyPressed = 'delete';
        }
        else if (keyPressed == 'Delete') {
            keyPressed = 'delete-all';
        }
        else if (keyPressed == 'Enter') {
            keyPressed = '=';
        }

        calculator(true, keyPressed);
    }
}
