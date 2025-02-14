// URL del Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec';

// Elemento contenedor principal
const contenedorEventos = document.getElementById('eventos-container');

// Función para cargar los eventos pendientes
async function cargarEventosPendientes() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=obtenerEventosPendientes`);
        const data = await response.json();
        
        if (data.success) {
            mostrarEventos(data.eventos);
        } else {
            console.error('Error al cargar eventos:', data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para mostrar los eventos en el DOM
function mostrarEventos(eventos) {
    contenedorEventos.innerHTML = '';
    
    eventos.forEach(evento => {
        const elementoEvento = document.createElement('div');
        elementoEvento.className = 'evento';
        
        const nombreEvento = document.createElement('h3');
        nombreEvento.textContent = evento.nombre;
        nombreEvento.className = 'evento-titulo';
        
        const detallesEvento = document.createElement('div');
        detallesEvento.className = 'evento-detalles oculto';
        detallesEvento.innerHTML = `
            <p><strong>Tipo de Evento:</strong> ${evento.tipo}</p>
            <p><strong>Precio:</strong> $${evento.precio}</p>
            <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
            <p><strong>Fecha:</strong> ${evento.fecha}</p>
            <div class="botones-accion">
                <button class="btn-confirmar" data-id="${evento.id}">✅ Confirmar</button>
                <button class="btn-eliminar" data-id="${evento.id}">❌ Eliminar</button>
            </div>
        `;
        
        // Evento para mostrar/ocultar detalles
        nombreEvento.addEventListener('click', () => {
            detallesEvento.classList.toggle('oculto');
        });
        
        elementoEvento.appendChild(nombreEvento);
        elementoEvento.appendChild(detallesEvento);
        contenedorEventos.appendChild(elementoEvento);
    });
    
    // Agregar event listeners para los botones
    document.querySelectorAll('.btn-confirmar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            await manejarAccionEvento(id, 'confirmar');
        });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            await manejarAccionEvento(id, 'eliminar');
        });
    });
}

// Función para manejar las acciones de confirmar/eliminar
async function manejarAccionEvento(id, accion) {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=${accion}Evento&id=${id}`);
        const data = await response.json();
        
        if (data.success) {
            // Recargar la lista de eventos
            await cargarEventosPendientes();
        } else {
            console.error(`Error al ${accion} evento:`, data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Cargar eventos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarEventosPendientes);
