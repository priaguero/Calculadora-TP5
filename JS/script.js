let displayValue = "";

function appendNumber(number) {
    displayValue += number;
    updateDisplay();
}

function appendOperator(operation) {
    if (displayValue === "") return;
    const lastChar = displayValue.slice(-1);
    if ("+-*/".includes(lastChar)) return;
    displayValue+= " " + operation + " ";
    updateDisplay();
}

function calculate () {
    try {
        displayValue = eval(displayValue).toString();
        updateDisplay();
    } catch {
        displayValue = "Error";
        updateDisplay();
    }
}

function clearDisplay () {
    displayValue = '';
    updateDisplay ();
}

function updateDisplay () {
    document.getElementById('calc-display').value = displayValue;
}