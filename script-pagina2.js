const API_URL = 'https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec';
const container = document.getElementById('presupuestos-container');
const loadingDiv = document.getElementById('loading');

// Función para cargar los presupuestos
async function cargarPresupuestos() {
    try {
        loadingDiv.style.display = 'block';
        container.innerHTML = '';

        const response = await fetch(`${API_URL}?action=getPresupuestos`);
        const data = await response.json();

        if (Array.isArray(data)) {
            data.forEach(presupuesto => {
                const presupuestoElement = crearElementoPresupuesto(presupuesto);
                container.appendChild(presupuestoElement);
            });
        }
    } catch (error) {
        console.error('Error al cargar presupuestos:', error);
        container.innerHTML = '<p>Error al cargar los presupuestos. Por favor, intente más tarde.</p>';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Función para crear el elemento HTML de cada presupuesto
function crearElementoPresupuesto(presupuesto) {
    const div = document.createElement('div');
    div.className = 'presupuesto-container';
    div.innerHTML = `
        <div class="presupuesto-header" onclick="togglePresupuesto(this)">
            ${presupuesto['Nombre del Evento']}
        </div>
        <div class="presupuesto-content">
            <p><strong>ID:</strong> ${presupuesto.ID}</p>
            <p><strong>Precio:</strong> ${presupuesto.Precio}</p>
            <p><strong>Tipo de Evento:</strong> ${presupuesto['Tipo de Evento']}</p>
            <p><strong>Cuotas:</strong> ${presupuesto.Cuotas}</p>
            <p><strong>Fecha del Evento:</strong> ${presupuesto['Fecha del Evento']}</p>
            <button class="btn-confirmar" onclick="confirmarPresupuesto('${presupuesto.ID}')">
                Confirmar
            </button>
            <button class="btn-eliminar" onclick="rechazarPresupuesto('${presupuesto.ID}')">
                Eliminar
            </button>
        </div>
    `;
    return div;
}

// Función para expandir/contraer el contenido del presupuesto
function togglePresupuesto(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('active');
}

// Función para confirmar un presupuesto
async function confirmarPresupuesto(id) {
    if (confirm('¿Está seguro de confirmar este presupuesto?')) {
        try {
            loadingDiv.style.display = 'block';
            const response = await fetch(`${API_URL}?action=confirmarPresupuesto&id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                alert('Presupuesto confirmado exitosamente');
                cargarPresupuestos(); // Recargar la lista
            } else {
                alert(data.error || 'Error al confirmar el presupuesto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        } finally {
            loadingDiv.style.display = 'none';
        }
    }
}

// Función para rechazar un presupuesto
async function rechazarPresupuesto(id) {
    if (confirm('¿Está seguro de eliminar este presupuesto?')) {
        try {
            loadingDiv.style.display = 'block';
            const response = await fetch(`${API_URL}?action=rechazarPresupuesto&id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                alert('Presupuesto eliminado exitosamente');
                cargarPresupuestos(); // Recargar la lista
            } else {
                alert(data.error || 'Error al eliminar el presupuesto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        } finally {
            loadingDiv.style.display = 'none';
        }
    }
}

// Cargar presupuestos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarPresupuestos);
