// Configuración global
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbzIxBOkWqhvjIBocmR8ZGljvyJDl5m3cZOaz4qAr-BXmsOvplcN_crmKawKy_nhsnGuxQ/exec'
};

// Elementos del DOM
const elements = {
    container: document.getElementById('eventos-container'),
    loading: document.getElementById('loading')
};

// Utilidades
const utils = {
    formatCurrency: amount => `$${parseFloat(amount).toLocaleString('es-AR')}`,
    formatDate: date => new Date(date).toLocaleDateString('es-AR'),
    toggleLoading: show => elements.loading.style.display = show ? 'block' : 'none'
};

// Funciones de API
const api = {
    async fetchData(action) {
        const url = `${CONFIG.API_URL}?action=${action}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Error en la respuesta del servidor');
            return data;
        } catch (error) {
            console.error('Error en fetchData:', error);
            throw error;
        }
    },

    getEventos: () => api.fetchData('obtenerEventosPendientes')
};

// Funciones de UI
const ui = {
    crearElementoEvento(evento) {
        const elemento = document.createElement('div');
        elemento.className = 'evento';

        const titulo = document.createElement('h3');
        titulo.className = 'evento-titulo';
        titulo.textContent = evento.nombre;

        const detalles = document.createElement('div');
        detalles.className = 'evento-detalles oculto';
        detalles.innerHTML = `
            <p><strong>Tipo:</strong> ${evento.tipo}</p>
            <p><strong>Precio:</strong> ${utils.formatCurrency(evento.precio)}</p>
            <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
            <p><strong>Fecha:</strong> ${evento.fecha}</p>
            <div class="botones-accion">
                <button class="btn-confirmar" data-id="${evento.id}">✅ Confirmar</button>
                <button class="btn-eliminar" data-id="${evento.id}">❌ Eliminar</button>
            </div>
        `;

        titulo.addEventListener('click', () => {
            detalles.classList.toggle('oculto');
        });

        elemento.appendChild(titulo);
        elemento.appendChild(detalles);
        return elemento;
    },

    mostrarEventos(eventos) {
        elements.container.innerHTML = eventos.length
            ? eventos.map(ui.crearElementoEvento).map(el => el.outerHTML).join('')
            : '<p class="sin-eventos">No hay eventos pendientes</p>';

        document.querySelectorAll('.btn-confirmar').forEach(btn =>
            btn.addEventListener('click', e => ui.cambiarEstado(e.target.dataset.id, 'Confirmado'))
        );

        document.querySelectorAll('.btn-eliminar').forEach(btn =>
            btn.addEventListener('click', e => ui.cambiarEstado(e.target.dataset.id, 'Rechazado'))
        );
    },

    async cambiarEstado(id, estado) {
        if (confirm(`¿Seguro que deseas marcar este evento como ${estado}?`)) {
            const fila = Array.from(document.querySelectorAll('.evento'))
                .find(el => el.querySelector('.btn-confirmar')?.dataset.id === id);

            if (fila) {
                fila.remove(); // Remueve el evento visualmente
            }

            await utils.actualizarEstadoEnSheets(id, estado);
        }
    }
};

// Aplicación principal
const app = {
    async cargarEventos() {
        utils.toggleLoading(true);
        try {
            const data = await api.getEventos();
            ui.mostrarEventos(data.eventos);
        } catch (error) {
            elements.container.innerHTML = `<p class="error-mensaje">Error: ${error.message}</p>`;
        } finally {
            utils.toggleLoading(false);
        }
    }
};

// Inicia la carga de eventos al cargar la página
document.addEventListener('DOMContentLoaded', app.cargarEventos);
