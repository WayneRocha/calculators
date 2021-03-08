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
        console.log('expression: ' + expression);
        result = solveReversePolishNotation(expression);
        console.log('result: ' + result);

        function createReversePolishNotation() {
            let expression = expressionToArray(accountCalc);

            expression = infixToPostFix(expression);
            return expression;

            function infixToPostFix(exp) {
                //Shunting-yard Algorithm in JS by Nic Raboy

                var outputQueue = [];
                var operatorStack = [];
                var operators = {
                    "^": {
                        precedence: 4,
                        associativity: "Right"
                    },
                    "/": {
                        precedence: 3,
                        associativity: "Left"
                    },
                    "*": {
                        precedence: 3,
                        associativity: "Left"
                    },
                    "+": {
                        precedence: 2,
                        associativity: "Left"
                    },
                    "-": {
                        precedence: 2,
                        associativity: "Left"
                    }
                }
                for (var i = 0; i < exp.length; i++) {
                    var token = exp[i];
                    if (typeof (token) == 'number') {
                        outputQueue.push(token);
                    } else if ("^*/+-".indexOf(token) !== -1) {
                        var o1 = token;
                        var o2 = operatorStack[operatorStack.length - 1];
                        while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                            outputQueue.push(operatorStack.pop());
                            o2 = operatorStack[operatorStack.length - 1];
                        }
                        operatorStack.push(o1);
                    } else if (token === "(") {
                        operatorStack.push(token);
                    } else if (token === ")") {
                        while (operatorStack[operatorStack.length - 1] !== "(") {
                            if (operatorStack.length !== 0){
                                outputQueue.push(operatorStack.pop());
                            } else {
                                break;
                            }
                        }
                        operatorStack.pop();
                    }
                }
                while (operatorStack.length > 0) {
                    if (operatorStack[operatorStack.length - 1] !== '(' || operatorStack[operatorStack.length - 1] !== ')'){
                        outputQueue.push(operatorStack.pop());
                    } else {
                        break;
                    }
                }
                return outputQueue;
            }
            function expressionToArray(val) {
                let numberElements = new Array;
                let stack = new Array;

                for (let i = 0; i < val.length; i++) {
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
        function solveReversePolishNotation(exp) {
            let stack = [];
            let token;

            while (exp.length > 0){
                token = exp.shift();

                switch(token){
                    case '^':
                        stack.push((stack.pop()) ** (stack.pop()));
                        break;
                    case '*':
                        stack.push((stack.pop()) * (stack.pop()));
                        break;
                    case '/':
                        stack.push((stack.pop()) / (stack.pop()));
                        break;
                    case '+':
                        stack.push((stack.pop()) + (stack.pop()));
                        break;
                    case '-':
                        stack.push((stack.pop()) - (stack.pop()));
                        break;
                    default:
                        stack.push(token);
                        break;
                }
            }
            return stack;
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
