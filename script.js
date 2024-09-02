const calculator = {
    displayValue: '0',
    parenthesesCount: 0,
};

function inputDigit(digit) {
    const { displayValue } = calculator;
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { displayValue } = calculator;
    const lastChar = displayValue.slice(-1);

    // Replace operators if the last character is an operator
    if ("+-×÷".includes(lastChar)) {
        calculator.displayValue = displayValue.slice(0, -1) + nextOperator;
    } else {
        calculator.displayValue += nextOperator;
    }
}

function handleParentheses() {
    const { displayValue, parenthesesCount } = calculator;
    if (parenthesesCount > 0 && displayValue[displayValue.length - 1] !== "(") {
        calculator.displayValue += ")";
        calculator.parenthesesCount -= 1;
    } else {
        calculator.displayValue += "(";
        calculator.parenthesesCount += 1;
    }
}

function clearScreen() {
    calculator.displayValue = '0';
}

function backspace() {
    const { displayValue } = calculator;
    if (displayValue !== '0') {
        calculator.displayValue = displayValue.slice(0, -1) || '0';
        // Adjust parentheses count
        if (displayValue.slice(-1) === "(") {
            calculator.parenthesesCount -= 1;
        } else if (displayValue.slice(-1) === ")") {
            calculator.parenthesesCount += 1;
        }
    }
}

function evaluateExpression(expression) {
    const sanitizedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s+/g, '');

    try {
        const result = new Function('return ' + sanitizedExpression)();
        return result;
    } catch {
        return 'Error';
    }
}

function calculateExpression() {
    let { displayValue, parenthesesCount } = calculator;

    // Close any open parentheses
    while (parenthesesCount > 0) {
        displayValue += ")";
        parenthesesCount -= 1;
    }

    // Evaluate the expression
    const result = evaluateExpression(displayValue);

    // Handle special cases
    if (result === 2) {
        calculator.displayValue = 'I MISS YOU';
    } else {
        calculator.displayValue = `${result}`;
    }
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '×':
        case '÷':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'C':
            clearScreen();
            break;
        case 'backspace':
            backspace();
            break;
        case '( )':
            handleParentheses();
            break;
        case '=':
            calculateExpression();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

updateDisplay(); // Initial display update
