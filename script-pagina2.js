const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
});

async function cargarEventos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        mostrarEventos(data);
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
}

function mostrarEventos(eventos) {
    const container = document.getElementById('eventos-container');
    container.innerHTML = ''; // Limpiar el contenedor

    eventos.forEach((evento, index) => {
        const eventoDiv = document.createElement('div');
        eventoDiv.className = 'evento';
        eventoDiv.innerHTML = `
            <h2>${evento.nombreEvento}</h2>
            <p>Precio: $${evento.precio}</p>
            <p>Tipo de Evento: ${evento.tipoEvento}</p>
            <p>Cuotas: ${evento.cuotas}</p>
            <p>Fecha del Evento: ${evento.fechaEvento}</p>
            <button onclick="confirmarEvento(${index})" class="btn-verde">Confirmar</button>
            <button onclick="eliminarEvento(${index})" class="btn-rojo">Eliminar</button>
        `;
        container.appendChild(eventoDiv);
    });
}

async function confirmarEvento(index) {
    try {
        const response = await fetch(`${API_URL}?action=confirmar&index=${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'confirmar', index: index })
        });
        const data = await response.json();
        if (data.success) {
            alert('Evento confirmado correctamente');
            cargarEventos();
        } else {
            alert('Error al confirmar el evento');
        }
    } catch (error) {
        console.error('Error al confirmar el evento:', error);
    }
}

async function eliminarEvento(index) {
    try {
        const response = await fetch(`${API_URL}?action=eliminar&index=${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'eliminar', index: index })
        });
        const data = await response.json();
        if (data.success) {
            alert('Evento eliminado correctamente');
            cargarEventos();
        } else {
            alert('Error al eliminar el evento');
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
    }
}
