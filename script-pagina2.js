const API_URL = 'https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec';
const container = document.getElementById('presupuestos-container');
const loadingDiv = document.getElementById('loading');

async function cargarPresupuestos() {
    try {
        loadingDiv.style.display = 'block';
        container.innerHTML = '';

        const response = await fetch(`${API_URL}?action=getPresupuestos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(presupuesto => container.appendChild(crearElementoPresupuesto(presupuesto)));
        } else {
            container.innerHTML = '<p>No hay presupuestos pendientes.</p>';
        }
    } catch (error) {
        console.error('Error al cargar presupuestos:', error);
        container.innerHTML = '<p>Error al cargar los presupuestos. Intente más tarde.</p>';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function crearElementoPresupuesto(presupuesto) {
    const div = document.createElement('div');
    div.className = 'presupuesto-box';
    
    div.innerHTML = `
        <div class="evento-nombre" onclick="toggleEvento(this)" aria-expanded="false">
            ${presupuesto['Nombre del Evento']}
        </div>
        <div class="evento-detalle" aria-hidden="true">
            <p><strong>ID:</strong> ${presupuesto.ID}</p>
            <p><strong>Precio:</strong> ${presupuesto.Precio}</p>
            <p><strong>Tipo de Evento:</strong> ${presupuesto['Tipo de Evento']}</p>
            <p><strong>Cuotas:</strong> ${presupuesto.Cuotas}</p>
            <p><strong>Fecha del Evento:</strong> ${presupuesto['Fecha del Evento']}</p>
            <button class="btn-confirmar" onclick="gestionarPresupuesto('${presupuesto.ID}', 'confirmar')">Confirmar</button>
            <button class="btn-eliminar" onclick="gestionarPresupuesto('${presupuesto.ID}', 'rechazar')">Eliminar</button>
        </div>
    `;
    return div;
}

function toggleEvento(elemento) {
    const detalles = elemento.nextElementSibling;
    const isExpanded = elemento.getAttribute('aria-expanded') === 'true';
    
    detalles.classList.toggle('mostrar');
    elemento.setAttribute('aria-expanded', !isExpanded);
    detalles.setAttribute('aria-hidden', isExpanded);
}

async function gestionarPresupuesto(id, accion) {
    if (!id) return alert('Error: ID no válido');

    const confirmacion = confirm(`¿Está seguro de ${accion === 'confirmar' ? 'confirmar' : 'eliminar'} este presupuesto?`);
    if (!confirmacion) return;

    try {
        loadingDiv.style.display = 'block';
        const response = await fetch(`${API_URL}?action=${accion}Presupuesto&id=${id}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            alert(`Presupuesto ${accion === 'confirmar' ? 'confirmado' : 'eliminado'} exitosamente`);
            await cargarPresupuestos();
        } else {
            alert(data.error || `Error al ${accion === 'confirmar' ? 'confirmar' : 'eliminar'} el presupuesto`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al procesar la solicitud de ${accion} presupuesto`);
    } finally {
        loadingDiv.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', cargarPresupuestos);
