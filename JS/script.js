let displayValue = "";

function agregar(number) {
    displayValue += number;
    updateDisplay();
}

function operacion(operation) {
    if (displayValue === "") return;
    const lastChar = displayValue.slice(-1);
    if ("+-*/".includes(lastChar)) return;
    displayValue+= " " + operation + " ";
    updateDisplay();
}

function calcular () {
    try {
        displayValue = eval(displayValue).toString();
        updateDisplay();
    } catch {
        displayValue = "Error";
        updateDisplay();
    }
}

function borrar () {
    displayValue = '';
    updateDisplay ();
}

function updateDisplay () {
    document.getElementById('resultado').value = displayValue;
}