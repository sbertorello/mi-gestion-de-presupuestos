const API_URL = 'https://script.google.com/macros/s/AKfycbyW1LuNTofuyQ4OL6tcTRKR09j9OBxQbBBevpQ7bVzRfDXcv1EPGmSbiqOA0FMAT6Hr/exec';

/**
 * Función genérica para realizar solicitudes a la API.
 * @param {string} operation - La operación a ejecutar en la API.
 * @param {object} data - Los datos a enviar (opcional).
 * @returns {Promise<any>} - Respuesta de la API o null en caso de error.
 */
async function fetchAPI(operation, data = null) {
    try {
        const url = new URL(API_URL);
        url.searchParams.append('operation', operation);
        if (data) {
            url.searchParams.append('data', JSON.stringify(data));
        }

        const response = await fetch(url);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Error en la operación');
        }

        return result.data;
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        alert('Error al procesar la operación. Por favor, intenta nuevamente.');
        return null;
    }
}

/**
 * Muestra la sección seleccionada y actualiza las listas según corresponda.
 * @param {string} seccionId - ID de la sección a mostrar.
 */
function mostrarSeccion(seccionId) {
    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.display = 'none';
    });

    const seccionSeleccionada = document.getElementById(seccionId);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }

    switch (seccionId) {
        case 'presupuestos-enviados':
            actualizarListaPresupuestos();
            break;
        case 'pagos-en-curso':
            actualizarListaPagos();
            break;
        case 'pagos-completados':
            actualizarListaCompletados();
            break;
    }
}

// Manejador del formulario de presupuestos
document.getElementById('presupuesto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const tipo = document.getElementById('tipo').value.trim();
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const fecha = document.getElementById('fecha').value;

    if (!nombre || isNaN(precio) || !tipo || isNaN(cuotas) || !fecha) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const nuevoPresupuesto = {
        Nombre: nombre,
        Precio: precio,
        Tipo: tipo,
        Cuotas: cuotas,
        Fecha: fecha,
        SaldoRestante: precio,
        MontoPagado: 0
    };

    const resultado = await fetchAPI('addPresupuesto', nuevoPresupuesto);

    if (resultado !== null) {
        document.getElementById('presupuesto-form').reset();
        mostrarMensaje('Presupuesto agregado correctamente.');
        actualizarListaPresupuestos();
    }
});

async function actualizarListaPresupuestos() {
    const presupuestos = await fetchAPI('getPresupuestos');
    if (!presupuestos) return;

    const lista = document.getElementById('lista-presupuestos');
    lista.innerHTML = '';

    presupuestos.forEach((presupuesto, index) => {
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${presupuesto.Nombre} (${presupuesto.Tipo}) - $${presupuesto.Precio}</p>
            <div class="detalles">
                <p>Fecha: ${presupuesto.Fecha}</p>
                <p>Cuotas: ${presupuesto.Cuotas}</p>
                <button onclick="confirmarPresupuesto(${index})">Confirmar</button>
                <button onclick="eliminarPresupuesto(${index})">Eliminar</button>
            </div>
        `;

        div.addEventListener('click', (e) => {
            if (!e.target.matches('button')) {
                div.classList.toggle('active');
            }
        });

        lista.appendChild(div);
    });
}

async function confirmarPresupuesto(index) {
    const resultado = await fetchAPI('confirmarPresupuesto', { index });
    if (resultado !== null) {
        actualizarListaPresupuestos();
        actualizarListaPagos();
    }
}

async function eliminarPresupuesto(index) {
    const resultado = await fetchAPI('eliminarPresupuesto', { index });
    if (resultado !== null) {
        actualizarListaPresupuestos();
    }
}

async function actualizarListaPagos() {
    const pagos = await fetchAPI('getPagosEnCurso');
    if (!pagos) return;

    const lista = document.getElementById('lista-pagos');
    lista.innerHTML = '';

    pagos.forEach((pago, index) => {
        const montoPorCuota = pago.Precio / pago.Cuotas;
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${pago.Nombre} (${pago.Tipo}) - $${pago.Precio}</p>
            <div class="detalles">
                <p>Saldo restante: $${pago.SaldoRestante || pago.Precio}</p>
                <div class="cuota-input">
                    <label>Agregar pago:</label>
                    <input type="number" min="0" max="${pago.SaldoRestante || pago.Precio}" step="0.01">
                    <button onclick="registrarPago(${index}, this.previousElementSibling.value)">Registrar pago</button>
                </div>
                <button onclick="confirmarPago(${index})">Finalizar pago</button>
                <button onclick="eliminarPago(${index})">Eliminar</button>
            </div>
        `;

        div.addEventListener('click', (e) => {
            if (!e.target.matches('input, button')) {
                div.classList.toggle('active');
            }
        });

        lista.appendChild(div);
    });
}

async function registrarPago(index, monto) {
    monto = parseFloat(monto);
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingresa un monto válido.');
        return;
    }

    const resultado = await fetchAPI('actualizarCuota', { index, monto });
    if (resultado !== null) {
        actualizarListaPagos();
    }
}

async function confirmarPago(index) {
    const resultado = await fetchAPI('confirmarPago', { index });
    if (resultado !== null) {
        actualizarListaPagos();
        actualizarListaCompletados();
    }
}

async function actualizarListaCompletados() {
    const completados = await fetchAPI('getPagosCompletados');
    if (!completados) return;

    const lista = document.getElementById('lista-completados');
    lista.innerHTML = '';

    completados.forEach((completado, index) => {
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${completado.Nombre} (${completado.Tipo}) - $${completado.Precio}</p>
            <button onclick="eliminarPagoCompletado(${index})">Eliminar</button>
        `;

        lista.appendChild(div);
    });
}

async function eliminarPagoCompletado(index) {
    const resultado = await fetchAPI('eliminarPagoCompletado', { index });
    if (resultado !== null) {
        actualizarListaCompletados();
    }
}

function mostrarMensaje(mensaje) {
    alert(mensaje);
}

// Inicializar las listas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarListaPresupuestos();
    actualizarListaPagos();
    actualizarListaCompletados();
});
