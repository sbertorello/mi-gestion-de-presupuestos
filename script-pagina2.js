// Configuración global
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbzIxBOkWqhvjIBocmR8ZGljvyJDl5m3cZOaz4qAr-BXmsOvplcN_crmKawKy_nhsnGuxQ/exec'
};

// Elementos del DOM
const elements = {
    container: document.getElementById('eventos-container')
};

// Funciones de API
const api = {
    async fetchData(action, params = {}) {
        const queryString = new URLSearchParams({ action, ...params }).toString();
        const url = `${CONFIG.API_URL}?${queryString}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Error en la respuesta del servidor');

            console.log('Datos recibidos:', data.data);  // Depuración
            return data.data;
        } catch (error) {
            console.error('Error en fetchData:', error);
            return [];
        }
    },

    async getEventos() {
        return this.fetchData('obtenerEventosPendientes');
    }
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
        detalles.className = 'evento-detalles';
        detalles.innerHTML = `
            <p><strong>Tipo de Evento:</strong> ${evento.tipo}</p>
            <p><strong>Precio:</strong> $${parseFloat(evento.precio).toLocaleString()}</p>
            <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
            <p><strong>Fecha:</strong> ${new Date(evento.fecha).toLocaleDateString()}</p>
        `;

        elemento.appendChild(titulo);
        elemento.appendChild(detalles);
        return elemento;
    },

    mostrarEventosVacios() {
        elements.container.innerHTML = '<p class="sin-eventos">No hay eventos pendientes</p>';
    }
};

// Aplicación principal
const app = {
    async cargarEventos() {
        try {
            const eventos = await api.getEventos();

            if (!eventos || eventos.length === 0) {
                console.warn('No hay eventos pendientes.');
                ui.mostrarEventosVacios();
                return;
            }

            elements.container.innerHTML = '';
            eventos.forEach(evento => {
                elements.container.appendChild(ui.crearElementoEvento(evento));
            });

        } catch (error) {
            console.error('Error al cargar eventos:', error);
            ui.mostrarEventosVacios();
        }
    },

    init() {
        this.cargarEventos();
    }
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => app.init());
