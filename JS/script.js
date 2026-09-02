let displayValue = "";
let historial = [];
let contadorOperadores = new Map([
    ['+', 0],
    ['-', 0],
    ['*', 0],
    ['/', 0]
]);

const SECCIONES = [
    { id: 'calculadora', etiqueta: 'Calculadora' },
    { id: 'historial', etiqueta: 'Historial' },
    { id: 'acerca', etiqueta: 'Acerca de' }
];

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

function registrarOperacion(expresion, resultado) {
    if (expresion.trim() === "" || resultado === "Error") return;

    historial.push({
        expresion: expresion.trim(),
        resultado: resultado,
        hora: new Date().toLocaleTimeString()
    });

    while (historial.length > MAX_HISTORIAL) {
        historial.shift();
    }
}

function generarNavbar() {
    const nav = document.getElementById('navbar');
    nav.innerHTML = '';

    for (let i = 0; i < SECCIONES.length; i++) {
        const seccion = SECCIONES[i];
        const boton = document.createElement('button');
        boton.textContent = seccion.etiqueta;
        boton.classList.add('nav-link');
        boton.dataset.seccion = seccion.id;
        boton.addEventListener('click', () => cambiarSeccion(seccion.id));
        nav.appendChild(boton);
    }
}

function cambiarSeccion(idSeccion) {
    seccionActual = idSeccion;

    switch (idSeccion) {
        case 'calculadora':
            renderCalculadora();
            break;
        case 'historial':
            renderHistorial();
            break;
        case 'acerca':
            renderAcerca();
            break;
        default:
            renderCalculadora();
    }

    marcarLinkActivo(idSeccion);
}

