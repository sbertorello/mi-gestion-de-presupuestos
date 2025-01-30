const API_URL = 'https://script.google.com/macros/s/AKfycbyW1LuNTofuyQ4OL6tcTRKR09j9OBxQbBBevpQ7bVzRfDXcv1EPGmSbiqOA0FMAT6Hr/exec';

async function fetchAPI(operation, data = null) {
    try {
        const url = new URL(API_URL);
        url.searchParams.append('operation', operation);
        if (data) {
            url.searchParams.append('data', JSON.stringify(data));
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

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

function mostrarSeccion(seccionId) {
    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    const seccionSeleccionada = document.getElementById(seccionId);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';

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
}

document.getElementById('presupuesto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const tipo = document.getElementById('tipo').value;
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
        const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
        mensajeConfirmacion.style.display = 'block';
        setTimeout(() => {
            mensajeConfirmacion.style.display = 'none';
        }, 3000);
        actualizarListaPresupuestos();
    }
});

async function actualizarListaPresupuestos() {
    const presupuestos = await fetchAPI('getPresupuestos');
    if (!presupuestos || !Array.isArray(presupuestos)) return;

    const lista = document.getElementById('lista-presupuestos');
    lista.innerHTML = '';

    presupuestos.forEach((presupuesto, index) => {
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${presupuesto.Nombre} (${presupuesto.Tipo}) - $${presupuesto.Precio}</p>
            <div class="detalles">
                <p>Tipo de Evento: ${presupuesto.Tipo}</p>
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
    if (typeof index !== 'number' || isNaN(index)) {
        console.error('Índice inválido:', index);
        return;
    }
    
    const resultado = await fetchAPI('confirmarPresupuesto', { index });
    if (resultado !== null) {
        actualizarListaPresupuestos();
        actualizarListaPagos();
    }
}

async function eliminarPresupuesto(index) {
    if (typeof index !== 'number' || isNaN(index)) {
        console.error('Índice inválido:', index);
        return;
    }
    
    const resultado = await fetchAPI('eliminarPresupuesto', { index });
    if (resultado !== null) {
        actualizarListaPresupuestos();
    }
}

async function actualizarListaPagos() {
    const pagos = await fetchAPI('getPagosEnCurso');
    if (!pagos || !Array.isArray(pagos)) return;

    const lista = document.getElementById('lista-pagos');
    lista.innerHTML = '';

    pagos.forEach((pago, index) => {
        const montoPorCuota = pago.Precio / pago.Cuotas;
        const saldoRestante = parseFloat(pago.SaldoRestante || pago.Precio);
        const montoPagado = parseFloat(pago.MontoPagado || 0);
        
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${pago.Nombre} (${pago.Tipo}) - $${pago.Precio}</p>
            <div class="detalles">
                <p>Fecha: ${pago.Fecha}</p>
                <p>Cuotas: ${pago.Cuotas}</p>
                <p>Monto por cuota: $${montoPorCuota.toFixed(2)}</p>
                <p>Monto pagado: $${montoPagado.toFixed(2)}</p>
                <p>Saldo restante: $${saldoRestante.toFixed(2)}</p>
                <div class="cuota-input">
                    <label>Agregar pago:</label>
                    <input type="number" min="0" max="${saldoRestante}" step="0.01">
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
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
        alert('Por favor ingresa un monto válido');
        return;
    }

    try {
        const resultado = await fetchAPI('actualizarCuota', {
            index: parseInt(index),
            monto: montoNumerico
        });

        if (resultado !== null) {
            actualizarListaPagos();
        }
    } catch (error) {
        console.error('Error al registrar pago:', error);
        alert('Error al registrar el pago. Por favor, intenta nuevamente.');
    }
}

async function confirmarPago(index) {
    if (typeof index !== 'number' || isNaN(index)) {
        console.error('Índice inválido:', index);
        return;
    }

    const resultado = await fetchAPI('confirmarPago', { index });
    if (resultado !== null) {
        actualizarListaPagos();
        actualizarListaCompletados();
    }
}

async function eliminarPago(index) {
    if (typeof index !== 'number' || isNaN(index)) {
        console.error('Índice inválido:', index);
        return;
    }

    const resultado = await fetchAPI('eliminarPago', { index });
    if (resultado !== null) {
        actualizarListaPagos();
    }
}

async function actualizarListaCompletados() {
    const completados = await fetchAPI('getPagosCompletados');
    if (!completados || !Array.isArray(completados)) return;

    const lista = document.getElementById('lista-completados');
    lista.innerHTML = '';

    completados.forEach((completado, index) => {
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
            <p>${completado.Nombre} (${completado.Tipo}) - $${completado.Precio}</p>
            <div class="detalles">
                <p>Fecha de evento: ${completado.Fecha}</p>
                <p>Fecha de completado: ${completado.FechaCompletado}</p>
                <button onclick="eliminarPagoCompletado(${index})">Eliminar</button>
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

async function eliminarPagoCompletado(index) {
    if (typeof index !== 'number' || isNaN(index)) {
        console.error('Índice inválido:', index);
        return;
    }

    const resultado = await fetchAPI('eliminarPagoCompletado', { index });
    if (resultado !== null) {
        actualizarListaCompletados();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarListaPresupuestos();
    actualizarListaPagos();
    actualizarListaCompletados();
});
