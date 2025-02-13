const API_URL = 'https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec';
const container = document.getElementById('presupuestos-container');
const loadingDiv = document.getElementById('loading');

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

function crearElementoPresupuesto(presupuesto) {
    const div = document.createElement('div');
    div.className = 'presupuesto-box';
    
    const nombreEvento = presupuesto['Nombre del Evento'] || 'Sin nombre';
    
    div.innerHTML = `
        <div class="evento-nombre" onclick="toggleEvento(this)">
            ${nombreEvento}
        </div>
        <div class="evento-detalle">
            <p><strong>ID:</strong> ${presupuesto.ID || 'No disponible'}</p>
            <p><strong>Precio:</strong> ${presupuesto.Precio || 'No disponible'}</p>
            <p><strong>Tipo de Evento:</strong> ${presupuesto['Tipo de Evento'] || 'No disponible'}</p>
            <p><strong>Cuotas:</strong> ${presupuesto.Cuotas || 'No disponible'}</p>
            <p><strong>Fecha del Evento:</strong> ${presupuesto['Fecha del Evento'] || 'No disponible'}</p>
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

function toggleEvento(elemento) {
    const detalles = elemento.nextElementSibling;
    detalles.classList.toggle('mostrar');
}

async function confirmarPresupuesto(id) {
    if (confirm('¿Está seguro de confirmar este presupuesto?')) {
        try {
            loadingDiv.style.display = 'block';
            const response = await fetch(`${API_URL}?action=confirmarPresupuesto&id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                alert('Presupuesto confirmado exitosamente');
                await cargarPresupuestos();
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

async function rechazarPresupuesto(id) {
    if (confirm('¿Está seguro de eliminar este presupuesto?')) {
        try {
            loadingDiv.style.display = 'block';
            const response = await fetch(`${API_URL}?action=rechazarPresupuesto&id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                alert('Presupuesto eliminado exitosamente');
                await cargarPresupuestos();
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

document.addEventListener('DOMContentLoaded', cargarPresupuestos);
