// URL de tu Google Apps Script Web App (reemplazar con tu URL cuando la tengas)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHXNrzr3X7xf46Eo78m5rc5K_IvNuEO2o84oAMgSyISpJTDBjJ3GPAmOhSvHpYRNhVrg/exec';

// Funciones de navegación
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones y páginas
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        // Agregar clase active al botón clickeado y su página correspondiente
        button.classList.add('active');
        document.getElementById(button.dataset.page).classList.add('active');
        
        // Cargar datos según la página
        if (button.dataset.page === 'presupuestos-enviados') {
            cargarPresupuestosEnviados();
        } else if (button.dataset.page === 'pagos-curso') {
            cargarPagosEnCurso();
        } else if (button.dataset.page === 'pagos-completados') {
            cargarPagosCompletados();
        }
    });
});

// Manejo del formulario de presupuestos
document.getElementById('presupuestoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombreEvento: document.getElementById('nombreEvento').value,
        precio: parseFloat(document.getElementById('precio').value),
        tipoEvento: document.getElementById('tipoEvento').value,
        cuotas: parseInt(document.getElementById('cuotas').value),
        fechaEvento: document.getElementById('fechaEvento').value,
        fechaCreacion: new Date().toISOString(),
        estado: 'Nuevo'
    };
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'guardarPresupuesto',
                datos: datos
            })
        });
        
        if (response.ok) {
            alert('Presupuesto guardado exitosamente');
            e.target.reset();
        } else {
            throw new Error('Error al guardar el presupuesto');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Función para crear tarjeta de evento
function crearTarjetaEvento(evento, tipo) {
    const template = document.getElementById('evento-template');
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('.evento-nombre').textContent = evento.nombreEvento;
    clone.querySelector('.evento-precio').textContent = `$${evento.precio.toLocaleString()}`;
    clone.querySelector('.evento-tipo').textContent = evento.tipoEvento;
    clone.querySelector('.evento-cuotas').textContent = evento.cuotas;
    clone.querySelector('.evento-fecha').textContent = new Date(evento.fechaEvento).toLocaleDateString();
    
    const accionesDiv = clone.querySelector('.evento-acciones');
    
    if (tipo === 'presupuestos-enviados') {
        const btnConfirmar = document.createElement('button');
        btnConfirmar.textContent = 'Confirmar';
        btnConfirmar.className = 'btn-confirmar';
        btnConfirmar.onclick = () => confirmarPresupuesto(evento.id);
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = () => eliminarPresupuesto(evento.id);
        
        accionesDiv.appendChild(btnConfirmar);
        accionesDiv.appendChild(btnEliminar);
    } else if (tipo === 'pagos-curso') {
        const cuotasContainer = document.createElement('div');
        cuotasContainer.className = 'cuotas-container';
        
        for (let i = 1; i <= evento.cuotas; i++) {
            const cuotaDiv = document.createElement('div');
            cuotaDiv.className = 'cuota-input';
            
            const label = document.createElement('label');
            label.textContent = `Cuota ${i}:`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.value = evento[`cuota${i}`] || '';
            input.onchange = (e) => actualizarCuota(evento.id, i, e.target.value);
            
            cuotaDiv.appendChild(label);
            cuotaDiv.appendChild(input);
            cuotasContainer.appendChild(cuotaDiv);
        }
        
        const saldoDiv = document.createElement('div');
        saldoDiv.className = 'saldo-restante';
        saldoDiv.textContent = `Saldo restante: $${calcularSaldoRestante(evento).toLocaleString()}`;
        
        accionesDiv.appendChild(cuotasContainer);
        accionesDiv.appendChild(saldoDiv);
    } else if (tipo === 'pagos-completados') {
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = () => eliminarEventoCompletado(evento.id);
        
        accionesDiv.appendChild(btnEliminar);
    }
    
    return clone;
}

// Funciones para cargar datos
async function cargarPresupuestosEnviados() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=obtenerPresupuestosEnviados`);
        const datos = await response.json();
        
        const container = document.getElementById('presupuestosEnviadosContainer');
        container.innerHTML = '';
        
        datos.forEach(evento => {
            container.appendChild(crearTarjetaEvento(evento, 'presupuestos-enviados'));
        });
    } catch (error) {
        alert('Error al cargar presupuestos enviados');
    }
}

async function cargarPagosEnCurso() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=obtenerPagosEnCurso`);
        const datos = await response.json();
        
        const container = document.getElementById('pagosEnCursoContainer');
        container.innerHTML = '';
        
        datos.forEach(evento => {
            container.appendChild(crearTarjetaEvento(evento, 'pagos-curso'));
        });
    } catch (error) {
        alert('Error al cargar pagos en curso');
    }
}

async function cargarPagosCompletados() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=obtenerPagosCompletados`);
        const datos = await response.json();
        
        const container = document.getElementById('pagosCompletadosContainer');
        container.innerHTML = '';
        
        datos.forEach(evento => {
            container.appendChild(crearTarjetaEvento(evento, 'pagos-completados'));
        });
    } catch (error) {
        alert('Error al cargar pagos completados');
    }
}

// Funciones de acción
async function confirmarPresupuesto(id) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'confirmarPresupuesto',
                id: id
            })
        });
        
        if (response.ok) {
            alert('Presupuesto confirmado exitosamente');
            cargarPresupuestosEnviados();
            cargarPagosEnCurso();
        } else {
            throw new Error('Error al confirmar el presupuesto');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function eliminarPresupuesto(id) {
    if (confirm('¿Está seguro de eliminar este presupuesto?')) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'eliminarPresupuesto',
                    id: id
                })
            });
            
            if (response.ok) {
                alert('Presupuesto eliminado exitosamente');
                cargarPresupuestosEnviados();
            } else {
                throw new Error('Error al eliminar el presupuesto');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function actualizarCuota(id, numeroCuota, valor) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'actualizarCuota',
                id: id,
                numeroCuota: numeroCuota,
                valor: parseFloat(valor)
            })
        });
        
        if (response.ok) {
            cargarPagosEnCurso();
        } else {
            throw new Error('Error al actualizar la cuota');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function eliminarEventoCompletado(id) {
    if (confirm('¿Está seguro de eliminar este evento completado?')) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'eliminarEventoCompletado',
                    id: id
                })
            });
            
            if (response.ok) {
                alert('Evento eliminado exitosamente');
                cargarPagosCompletados();
            } else {
                throw new Error('Error al eliminar el evento');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Función auxiliar para calcular saldo restante
function calcularSaldoRestante(evento) {
    let pagado = 0;
    for (let i = 1; i <= evento.cuotas; i++) {
        if (evento[`cuota${i}`]) {
            pagado += parseFloat(evento[`cuota${i}`]);
        }
    }
    return evento.precio - pagado;
}

// Cargar datos iniciales cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const paginaActiva = document.querySelector('.page.active').id;
    if (paginaActiva === 'presupuestos-enviados') {
        cargarPresupuestosEnviados();
    } else if (paginaActiva === 'pagos-curso') {
        cargarPagosEnCurso();
    } else if (paginaActiva === 'pagos-completados') {
        cargarPagosCompletados();
    }
});
