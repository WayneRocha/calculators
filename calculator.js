var accountCalc = '';
var account = '';
var result;
addEventListenersToCalculator();

function addEventListenersToCalculator(){
    const buttons = document.getElementsByClassName('calc-btn');
    for (let i = 0; i <= buttons.length - 1; i++){
        buttons[i].addEventListener('click', calculator);
    }
    document.addEventListener('keydown', KeyboardListener);
}
function calculator(isKeyboardEvent=false, key=''){
    var btnId;
    var btnContent;

    if (isKeyboardEvent === true){
        btnId = key;
        btnContent = key;
    }else{
        btnId = this.id;
        btnContent = this.innerText;
    }

    buttonActions();

    function buttonActions(){
        let isNumericBtn = Number.isInteger(parseInt(btnContent));
        let isOperatorBtn = isOperator(btnContent);
        let isEraseOperatorBtn = btnId == 'delete';
        let isEraseAllOperatorBtn = btnId == 'delete-all';
        let isCommaBtn = btnContent == ',';
        let isParenthesesBtn = btnContent == '(' || btnContent == ')';
        let isEqualityOperatorBtn = btnContent == '=';
        let lastArgumentOfAccont = account.substr(account.length - 1, 1);
        let resultIsTithe = false;

        if(isNumericBtn){
            accountCalc += btnContent;
            account += btnContent;
        }
        else if(isOperatorBtn){
            if (noRepeatedOperator()){
                if(btnContent == 'x'){
                    accountCalc += '*';
                }
                else if(btnContent == '÷'){
                    accountCalc += '/' ;
                }
                else{
                    accountCalc += btnContent;
                }
                account += btnContent;
            }
        }
        else if(isCommaBtn){
            if (noRepeatedComma()){
                accountCalc += '.';
                account += btnContent;
            }
        }
        else if(isParenthesesBtn){
            accountCalc += btnContent;
            account += btnContent;
            flipParentheses()
        }
        else if(isEraseOperatorBtn){
            accountCalc = account.substring(0, account.length - 1);
            account = account.substring(0, account.length - 1);
            refreshVisor(false, true);
            result = undefined;
        }
        else if(isEraseAllOperatorBtn){
            accountCalc = '';
            account = '';
            result = undefined;
            refreshVisor(true, true);
        }
        else if(isEqualityOperatorBtn){
            if (isLastValueValid()){   
                calculateResult();
            }
        }
        else{
            result = undefined;
            refreshVisor(false, true);
        }
        refreshVisor(false, false, resultIsTithe);

        function calculateResult(){
            result = eval(accountCalc);
            console.log('calculo: ' + accountCalc);
            console.log('resultado: ' + result);
            if (result % 1 !== 0){
                resultIsTithe = false;
            }
        }
        function deleteLastArgument(val){
            return val.substring(0, account.length - 1);
        }
        function noRepeatedOperator(){
            return !(isOperator(lastArgumentOfAccont) && isOperator(btnContent));
        }
        function noRepeatedComma(){
            return !(lastArgumentOfAccont == ',' && btnContent == ',');
        }
        function isLastValueValid(){
            isValid = (!isOperator(lastArgumentOfAccont) && lastArgumentOfAccont != '(') && lastArgumentOfAccont != ',';

            if (isValid){
                return true;
            }
            else{
                accountCalc = deleteLastArgument(accountCalc);
                account = deleteLastArgument(account);
                return false;
            }
        }
        function isOperator(val){
            return val == '+' || val == '-' || val == 'x' || val == '÷';
        }
        function flipParentheses(){
            btnContent == ')' ? btn.innerText = '(' : btn.innerText = ')';
        }
        function refreshVisor(cleanAccount=false, cleanResult=false, resultIsTithe=false){
            const visorAccount = document.getElementById('calc');
            const visorResult = document.getElementById('result');

            if(cleanResult){
                visorResult.innerText = '';
            }
            if(cleanAccount){
                visorAccount.innerText = '';
            }
            if(result != undefined){
                visorResult.innerText = result;
                if (resultIsTithe){
                    visorResult.innerText += '... ';
                    console.log(visorResult.innerText);
                }
            }
            else{
                visorResult.innerText = '';
            }

            visorAccount.innerText = account;
        }
    }
}
function KeyboardListener(key){
    let keyPressed = key.key;
    
    if (keyPressed == '*'){
        keyPressed = 'x';
    }
    else if (keyPressed == '/'){
        keyPressed = '÷';
    }
    else if (keyPressed == 'Backspace'){
        keyPressed = 'delete';
    }
    else if (keyPressed == 'Delete'){
        keyPressed = 'delete-all';
    }
    else if (keyPressed == 'Enter'){
        keyPressed = '=';
    }

    calculator(true, keyPressed);
}

