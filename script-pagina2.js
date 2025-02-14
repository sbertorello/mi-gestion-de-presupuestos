// URL del Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIxBOkWqhvjIBocmR8ZGljvyJDl5m3cZOaz4qAr-BXmsOvplcN_crmKawKy_nhsnGuxQ/exec';

// Elementos del DOM
const contenedorEventos = document.getElementById('eventos-container');
const loadingElement = document.getElementById('loading');

// Función para mostrar/ocultar el indicador de carga
function toggleLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

// Función para cargar los eventos pendientes
async function cargarEventosPendientes() {
    try {
        toggleLoading(true);
        const response = await fetch(`${SCRIPT_URL}?action=obtenerEventosPendientes`);
        const data = await response.json();
        
        if (!data) {
            throw new Error('No se recibieron datos del servidor');
        }
        
        if (data.success) {
            mostrarEventos(data.eventos || []);
        } else {
            throw new Error(data.error || 'Error al cargar eventos');
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        contenedorEventos.innerHTML = `<p class="error">Error al cargar los eventos: ${error.message}</p>`;
    } finally {
        toggleLoading(false);
    }
}

// Función para mostrar los eventos en el DOM
function mostrarEventos(eventos) {
    if (eventos.length === 0) {
        contenedorEventos.innerHTML = '<p>No hay eventos pendientes</p>';
        return;
    }

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
            if (confirm('¿Deseas confirmar este evento?')) {
                const id = e.target.dataset.id;
                await manejarAccionEvento(id, 'confirmar');
            }
        });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
                const id = e.target.dataset.id;
                await manejarAccionEvento(id, 'eliminar');
            }
        });
    });
}

// Función para manejar las acciones de confirmar/eliminar
async function manejarAccionEvento(id, accion) {
    try {
        toggleLoading(true);
        const response = await fetch(`${SCRIPT_URL}?action=${accion}Evento&id=${id}`);
        const data = await response.json();
        
        if (data.success) {
            await cargarEventosPendientes();
        } else {
            throw new Error(data.error || `Error al ${accion} el evento`);
        }
    } catch (error) {
        console.error(`Error al ${accion} evento:`, error);
        alert(`Error al ${accion} el evento: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Cargar eventos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarEventosPendientes);
