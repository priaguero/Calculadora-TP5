/* =====================================================================
   CALCULADORA INTERACTIVA - TP5
   ---------------------------------------------------------------------
   Todo el contenido de la página (barra de navegación, calculadora,
   historial y sección "acerca de") se genera desde este archivo usando
   JavaScript, para no repetir código HTML y poder reutilizar la misma
   página al cambiar de sección (sin recargarla).
   ===================================================================== */


/* ---------------------------------------------------------------------
   ESTRUCTURAS DE DATOS GLOBALES
   --------------------------------------------------------------------- */

// Array: guarda cada operación realizada (expresión + resultado + hora)
let historial = [];

// Map: cuenta cuántas veces se usó cada operador (+, -, *, /)
let contadorOperadores = new Map([
    ['+', 0],
    ['-', 0],
    ['*', 0],
    ['/', 0]
]);

// Set: guarda los operadores distintos que el usuario ya utilizó
// (un Set no permite valores repetidos, ideal para saber cuáles se usaron)
let operadoresUsados = new Set();

// Cantidad máxima de operaciones que se guardan en el historial
const MAX_HISTORIAL = 8;

// Valor que se muestra actualmente en la pantalla de la calculadora
let displayValue = "";

// Sección actualmente visible ('calculadora' | 'historial' | 'acerca')
let seccionActual = 'calculadora';

// Configuración de las secciones -> usada para armar la barra de navegación con un for
const SECCIONES = [
    { id: 'calculadora', etiqueta: 'Calculadora' },
    { id: 'historial', etiqueta: 'Historial' },
    { id: 'acerca', etiqueta: 'Acerca de' }
];

// Configuración de los botones numéricos/operadores -> se recorre con un for
// para no tener que escribir cada <button> a mano en el HTML
const BOTONES = [
    { texto: '7', tipo: 'numero' },   { texto: '8', tipo: 'numero' },   { texto: '9', tipo: 'numero' },   { texto: '/', tipo: 'operador' },
    { texto: '4', tipo: 'numero' },   { texto: '5', tipo: 'numero' },   { texto: '6', tipo: 'numero' },   { texto: '*', tipo: 'operador' },
    { texto: '1', tipo: 'numero' },   { texto: '2', tipo: 'numero' },   { texto: '3', tipo: 'numero' },   { texto: '-', tipo: 'operador' },
    { texto: '0', tipo: 'numero' },   { texto: '.', tipo: 'numero' },   { texto: 'C', tipo: 'borrar' },   { texto: '+', tipo: 'operador' }
];


/* ---------------------------------------------------------------------
   LÓGICA DE LA CALCULADORA (misma lógica original del TP anterior)
   --------------------------------------------------------------------- */

function agregar(number) {
    displayValue += number;
    updateDisplay();
}

function operacion(operation) {
    if (displayValue === "") return;
    const lastChar = displayValue.slice(-1);
    if ("+-*/".includes(lastChar)) return;
    displayValue += " " + operation + " ";
    updateDisplay();

    // Actualizamos las estructuras de datos que llevan estadísticas de uso
    if (contadorOperadores.has(operation)) {
        contadorOperadores.set(operation, contadorOperadores.get(operation) + 1);
    }
    operadoresUsados.add(operation);
}

function calcular() {
    const expresionOriginal = displayValue; // se guarda antes de sobreescribirla
    try {
        displayValue = eval(displayValue).toString();
        updateDisplay();
        registrarOperacion(expresionOriginal, displayValue); // guarda la operación en el historial
    } catch {
        displayValue = "Error";
        updateDisplay();
    }
}

function borrar() {
    displayValue = '';
    updateDisplay();
}

function updateDisplay() {
    const pantalla = document.getElementById('resultado');
    // if: la pantalla solo existe en el DOM cuando la sección "calculadora" está activa
    if (pantalla) {
        pantalla.value = displayValue;
    }
}


/* ---------------------------------------------------------------------
   HISTORIAL DE OPERACIONES (usa Array, if y while)
   --------------------------------------------------------------------- */

function registrarOperacion(expresion, resultado) {
    // if: evita guardar operaciones vacías o resultados con error
    if (expresion.trim() === "" || resultado === "Error") return;

    historial.push({
        expresion: expresion.trim(),
        resultado: resultado,
        hora: new Date().toLocaleTimeString()
    });

    // while: si el historial supera el máximo permitido, se van descartando las más viejas
    while (historial.length > MAX_HISTORIAL) {
        historial.shift();
    }
}


/* ---------------------------------------------------------------------
   NAVEGACIÓN ENTRE SECCIONES (usa for y switch)
   --------------------------------------------------------------------- */

// Genera dinámicamente los botones de la barra de navegación (for sobre SECCIONES)
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

// Cambia qué sección se muestra, sin recargar la página (switch decide qué renderizar)
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

// Resalta visualmente el link activo en la barra de navegación
function marcarLinkActivo(idSeccion) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.dataset.seccion === idSeccion) {
            link.classList.add('activo');
        } else {
            link.classList.remove('activo');
        }
    });
}


/* ---------------------------------------------------------------------
   RENDER: SECCIÓN CALCULADORA (usa for e if)
   --------------------------------------------------------------------- */

function renderCalculadora() {
    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '';

    const pantallaDiv = document.createElement('div');
    pantallaDiv.classList.add('pantalla');

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'resultado';
    input.readOnly = true;
    pantallaDiv.appendChild(input);

    const botonesDiv = document.createElement('div');
    botonesDiv.classList.add('botones');

    // for: recorre la configuración BOTONES y crea cada botón dinámicamente
    for (let i = 0; i < BOTONES.length; i++) {
        const config = BOTONES[i];
        const btn = document.createElement('button');
        btn.textContent = config.texto;

        // if / else if: según el tipo de botón, se le asigna clase y evento distinto
        if (config.tipo === 'numero') {
            btn.addEventListener('click', () => agregar(config.texto));
        } else if (config.tipo === 'operador') {
            btn.classList.add('calculate-operator');
            btn.addEventListener('click', () => operacion(config.texto));
        } else if (config.tipo === 'borrar') {
            btn.classList.add('borrar');
            btn.addEventListener('click', () => borrar());
        }

        botonesDiv.appendChild(btn);
    }

    // El botón "=" se agrega aparte porque ocupa toda la fila (igual que en el HTML original)
    const btnIgual = document.createElement('button');
    btnIgual.textContent = '=';
    btnIgual.id = 'botoncalcular';
    btnIgual.addEventListener('click', () => calcular());
    botonesDiv.appendChild(btnIgual);

    pantallaDiv.appendChild(botonesDiv);
    contenedor.appendChild(pantallaDiv);

    updateDisplay(); // sincroniza la pantalla recién creada con el valor actual
}


/* ---------------------------------------------------------------------
   RENDER: SECCIÓN HISTORIAL (usa Array, Map, Set, if y for)
   --------------------------------------------------------------------- */

function renderHistorial() {
    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '';

    const seccion = document.createElement('div');
    seccion.classList.add('seccion-historial');

    const titulo = document.createElement('h2');
    titulo.textContent = 'Historial de operaciones';
    seccion.appendChild(titulo);

    // if: si todavía no hay operaciones, se muestra un mensaje en vez de una lista vacía
    if (historial.length === 0) {
        const vacio = document.createElement('p');
        vacio.textContent = 'Todavía no realizaste ninguna operación.';
        seccion.appendChild(vacio);
    } else {
        const lista = document.createElement('ul');
        lista.classList.add('lista-historial');

        // for: recorre el array "historial" (de más reciente a más antigua) generando un <li> por cada una
        for (let i = historial.length - 1; i >= 0; i--) {
            const item = historial[i];
            const li = document.createElement('li');
            li.textContent = `${item.expresion} = ${item.resultado}  (${item.hora})`;
            lista.appendChild(li);
        }
        seccion.appendChild(lista);
    }

    // --- Estadísticas de uso de operadores, usando el Map ---
    const statsTitulo = document.createElement('h3');
    statsTitulo.textContent = 'Uso de operadores';
    seccion.appendChild(statsTitulo);

    const statsLista = document.createElement('ul');
    statsLista.classList.add('lista-stats');

    // forEach sobre el Map: recorre cada par [operador, cantidad]
    contadorOperadores.forEach((cantidad, operador) => {
        const li = document.createElement('li');
        li.textContent = `${operador}  →  ${cantidad} ${cantidad === 1 ? 'vez' : 'veces'}`;
        statsLista.appendChild(li);
    });
    seccion.appendChild(statsLista);

    // --- Operadores distintos utilizados, usando el Set ---
    const setTitulo = document.createElement('h3');
    setTitulo.textContent = 'Operadores distintos utilizados';
    seccion.appendChild(setTitulo);

    const setTexto = document.createElement('p');
    // Array.from convierte el Set en un array para poder mostrarlo con join
    setTexto.textContent = operadoresUsados.size > 0
        ? Array.from(operadoresUsados).join('   ')
        : 'Ninguno todavía';
    seccion.appendChild(setTexto);

    // Botón para vaciar el historial
    const btnLimpiar = document.createElement('button');
    btnLimpiar.textContent = 'Vaciar historial';
    btnLimpiar.classList.add('btn-limpiar');
    btnLimpiar.addEventListener('click', () => {
        historial = [];
        renderHistorial(); // se vuelve a dibujar la sección, ahora vacía
    });
    seccion.appendChild(btnLimpiar);

    contenedor.appendChild(seccion);
}


/* ---------------------------------------------------------------------
   RENDER: SECCIÓN "ACERCA DE" (usa while)
   --------------------------------------------------------------------- */

function renderAcerca() {
    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '';

    const seccion = document.createElement('div');
    seccion.classList.add('seccion-acerca');

    const titulo = document.createElement('h2');
    titulo.textContent = 'Acerca de esta calculadora';
    seccion.appendChild(titulo);

    const parrafo = document.createElement('p');
    parrafo.textContent = 'Calculadora interactiva hecha con HTML, CSS y JavaScript puro. ' +
        'La barra de navegación cambia el contenido de la página sin recargarla.';
    seccion.appendChild(parrafo);

    const caracteristicas = [
        'Suma, resta, multiplicación y división',
        'Historial de las últimas operaciones realizadas',
        'Estadísticas de uso de cada operador',
        'Navegación dinámica entre secciones'
    ];

    const listaCaract = document.createElement('ul');

    // while: recorre el array "caracteristicas" generando un <li> por cada elemento
    let indice = 0;
    while (indice < caracteristicas.length) {
        const li = document.createElement('li');
        li.textContent = caracteristicas[indice];
        listaCaract.appendChild(li);
        indice++;
    }

    seccion.appendChild(listaCaract);
    contenedor.appendChild(seccion);
}


document.addEventListener('DOMContentLoaded', () => {
    generarNavbar();
    cambiarSeccion('calculadora'); // sección con la que arranca la página
});
