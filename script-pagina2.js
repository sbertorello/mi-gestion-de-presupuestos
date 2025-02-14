// Configuración global
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbzIxBOkWqhvjIBocmR8ZGljvyJDl5m3cZOaz4qAr-BXmsOvplcN_crmKawKy_nhsnGuxQ/exec',
    ESTADOS: {
        PENDIENTE: 'Pendiente',
        CONFIRMADO: 'Confirmado',
        RECHAZADO: 'Rechazado'
    }
};

// Elementos del DOM
const elements = {
    container: document.getElementById('eventos-container'),
    loading: document.getElementById('loading')
};

// Utilidades
const utils = {
    formatCurrency: (amount) => `$${parseFloat(amount).toLocaleString('es-AR')}`,
    formatDate: (date) => new Date(date).toLocaleDateString('es-AR'),
    toggleLoading: (show) => {
        elements.loading.style.display = show ? 'block' : 'none';
    }
};

// Funciones de API
const api = {
    async fetchData(action, params = {}) {
        const queryString = new URLSearchParams({ action, ...params }).toString();
        const url = `${CONFIG.API_URL}?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Error en la respuesta del servidor');
            }
            return data;
        } catch (error) {
            console.error('Error en fetchData:', error);
            throw error;
        }
    },

    getEventos: () => api.fetchData('obtenerEventosPendientes'),
    confirmarEvento: (id) => api.fetchData('confirmarEvento', { id }),
    eliminarEvento: (id) => api.fetchData('eliminarEvento', { id })
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
            <p><strong>Tipo de Evento:</strong> ${evento.tipo}</p>
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

    mostrarError(mensaje) {
        elements.container.innerHTML = `
            <div class="error-mensaje">
                <p>Error: ${mensaje}</p>
                <button onclick="app.cargarEventos()">Reintentar</button>
            </div>
        `;
    },

    mostrarEventosVacios() {
        elements.container.innerHTML = '<p class="sin-eventos">No hay eventos pendientes</p>';
    },

    async confirmarEvento(id) {
        if (await ui.confirmarAccion('¿Deseas confirmar este evento?')) {
            await app.manejarAccion(id, 'confirmar');
        }
    },

    async eliminarEvento(id) {
        if (await ui.confirmarAccion('¿Estás seguro de que deseas eliminar este evento?')) {
            await app.manejarAccion(id, 'eliminar');
        }
    },

    confirmarAccion(mensaje) {
        return new Promise(resolve => {
            resolve(window.confirm(mensaje));
        });
    }
};

// Aplicación principal
const app = {
    async cargarEventos() {
        utils.toggleLoading(true);
        try {
            const data = await api.getEventos();
            const eventos = data.eventos || [];

            if (eventos.length === 0) {
                ui.mostrarEventosVacios();
                return;
            }

            elements.container.innerHTML = '';
            eventos.forEach(evento => {
                elements.container.appendChild(ui.crearElementoEvento(evento));
            });

            this.agregarEventListeners();
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            ui.mostrarError(error.message);
        } finally {
            utils.toggleLoading(false);
        }
    },

    agregarEventListeners() {
        document.querySelectorAll('.btn-confirmar').forEach(btn => {
            btn.addEventListener('click', (e) => ui.confirmarEvento(e.target.dataset.id));
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => ui.eliminarEvento(e.target.dataset.id));
        });
    },

    async manejarAccion(id, tipo) {
        utils.toggleLoading(true);
        try {
            await api[tipo === 'confirmar' ? 'confirmarEvento' : 'eliminarEvento'](id);
            await this.cargarEventos();
        } catch (error) {
            console.error(`Error al ${tipo} evento:`, error);
            alert(`Error al ${tipo} el evento: ${error.message}`);
        } finally {
            utils.toggleLoading(false);
        }
    },

    init() {
        this.cargarEventos();
    }
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => app.init());
