/* ==========================================
   SCRIPT.JS - CinePlus
   Funciones: menú responsive, selector de cine,
   tabs cartelera/estrenos, horarios dinámicos
   ========================================== */

function inicializarMenu() {
    const boton = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    if (!boton || !nav) return;

    boton.addEventListener('click', () => {
        nav.classList.toggle('nav-abierto');
        boton.textContent = nav.classList.contains('nav-abierto') ? '✕' : '☰';
    });
}


function irACartelera() {
    const select = document.getElementById('cineRapido');
    if (!select) return;
    localStorage.setItem('cineSeleccionado', select.value);
    window.location.href = 'peliculas.html';
}


function filtrarPorCine() {
    const select = document.getElementById('selectCine');
    if (!select) return;
    const cineElegido = select.value;

    const tabActiva = document.querySelector('.catalogo:not([style*="display: none"])');
    if (!tabActiva) return;

    const tarjetas = tabActiva.querySelectorAll('.pelicula[data-cines]');
    let visibles = 0;

    tarjetas.forEach(card => {
        const cinesDisponibles = card.dataset.cines.split(',');
        const coincide = cineElegido === 'todos' || cinesDisponibles.includes(cineElegido);
        card.style.display = coincide ? '' : 'none';
        if (coincide) visibles++;
    });

    const mensajeVacio = document.getElementById('mensajeVacio');
    if (mensajeVacio) mensajeVacio.style.display = visibles === 0 ? 'block' : 'none';

    localStorage.setItem('cineSeleccionado', cineElegido);
}

function aplicarCineGuardado() {
    const guardado = localStorage.getItem('cineSeleccionado');
    const select = document.getElementById('selectCine');
    if (guardado && select) {
        select.value = guardado;
        filtrarPorCine();
    }
}


function cambiarTab(tab, boton) {
    document.getElementById('cartelera').style.display = (tab === 'cartelera') ? 'grid' : 'none';
    document.getElementById('estrenos').style.display = (tab === 'estrenos') ? 'grid' : 'none';

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');

    // Si vuelve a cartelera, reaplica el filtro de cine
    if (tab === 'cartelera') filtrarPorCine();
}


// ---- SELECTOR DE DÍA Y HORARIOS (dinámico con Date()) ----

function generarSelectoresDeDia() {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();

    document.querySelectorAll('.horario-selector').forEach(selector => {
        const diasContainer = document.createElement('div');
        diasContainer.className = 'dias-container';

        for (let i = 0; i < 5; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'dia-btn' + (i === 0 ? ' activo' : '');
            boton.textContent = i === 0 ? 'Hoy' : `${diasSemana[fecha.getDay()]} ${fecha.getDate()}`;
            boton.dataset.dia = i;

            boton.addEventListener('click', () => {
                diasContainer.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('activo'));
                boton.classList.add('activo');
                mostrarHorarios(selector, i);
            });

            diasContainer.appendChild(boton);
        }

        const horariosContainer = document.createElement('div');
        horariosContainer.className = 'horarios-container';

        selector.appendChild(diasContainer);
        selector.appendChild(horariosContainer);

        mostrarHorarios(selector, 0);
    });
}


function mostrarHorarios(selector, diaIndex) {
    const contenedor = selector.querySelector('.horarios-container');
    let horarios = selector.dataset.horarios.split(',');

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diaIndex);
    const esFinDeSemana = [0, 5, 6].includes(fecha.getDay());

    if (esFinDeSemana) horarios = [...horarios, '23:30'];

    contenedor.innerHTML = '';
    horarios.forEach(hora => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'horario-btn';
        btn.textContent = hora;
        btn.addEventListener('click', () => {
            const titulo = selector.closest('.pelicula').querySelector('h3').textContent;
            alert(`🎬 ${titulo}\n📅 Función: ${hora} hrs.\n\nPróximamente: selección de asientos.`);
        });
        contenedor.appendChild(btn);
    });
}


function activarRecordatorio(boton) {
    boton.textContent = '✓ Te avisaremos';
    boton.disabled = true;
    boton.classList.add('recordatorio-activo');
}


document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    generarSelectoresDeDia();
    aplicarCineGuardado();
});