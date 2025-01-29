// URL de la Web App
const API_URL = 'https://script.google.com/macros/s/TU-ID-DE-IMPLEMENTATION/exec';

// Función para hacer peticiones a la API
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
    console.error('Error:', error);
    alert('Error al procesar la operación. Por favor, intenta nuevamente.');
    return null;
  }
}

// Mostrar secciones
function mostrarSeccion(seccionId) {
  document.querySelectorAll("section").forEach((seccion) => {
    seccion.style.display = "none";
  });
  document.getElementById(seccionId).style.display = "block";
  
  switch(seccionId) {
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

// Manejar el formulario de presupuestos
document.getElementById("presupuesto-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const tipo = document.getElementById("tipo").value;
  const cuotas = parseInt(document.getElementById("cuotas").value);
  const fecha = document.getElementById("fecha").value;

  if (nombre && precio && tipo && cuotas && fecha) {
    const resultado = await fetchAPI('addPresupuesto', {
      Nombre: nombre,
      Precio: precio,
      Tipo: tipo,
      Cuotas: cuotas,
      Fecha: fecha
    });

    if (resultado !== null) {
      document.getElementById("presupuesto-form").reset();
      document.getElementById("mensaje-confirmacion").style.display = "block";
      setTimeout(() => {
        document.getElementById("mensaje-confirmacion").style.display = "none";
      }, 3000);
      actualizarListaPresupuestos();
    }
  } else {
    alert("Por favor, completa todos los campos.");
  }
});

// Actualizar lista de presupuestos enviados
async function actualizarListaPresupuestos() {
  const presupuestos = await fetchAPI('getPresupuestos');
  if (!presupuestos) return;

  const lista = document.getElementById("lista-presupuestos");
  lista.innerHTML = "";
  
  presupuestos.forEach((presupuesto, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${presupuesto.Nombre} - ${presupuesto.Tipo} - $${presupuesto.Precio} - Fecha: ${presupuesto.Fecha}</p>
      <div class="detalles">
        <p>Cuotas: ${presupuesto.Cuotas}</p>
        <button onclick="confirmarPresupuesto(${index})" class="confirmar">Confirmar</button>
        <button onclick="eliminarPresupuesto(${index})" class="eliminar">Eliminar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

// Funciones para manejar presupuestos
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

// Actualizar lista de pagos en curso
async function actualizarListaPagos() {
  const pagos = await fetchAPI('getPagosEnCurso');
  if (!pagos) return;

  const lista = document.getElementById("lista-pagos");
  lista.innerHTML = "";
  
  pagos.forEach((pago, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    
    // Calcular saldo restante
    const montoPorCuota = pago.Precio / pago.Cuotas;
    const montoPagado = (pago.CuotasPagadas || 0) * montoPorCuota;
    const saldoRestante = pago.Precio - montoPagado;
    
    // Crear inputs para cada cuota
    let cuotasHTML = '<div class="cuotas-container">';
    for (let i = 1; i <= pago.Cuotas; i++) {
      cuotasHTML += `
        <div class="cuota-input">
          <label>Cuota ${i}:</label>
          <input type="number" 
                 value="${i <= (pago.CuotasPagadas || 0) ? montoPorCuota : 0}"
                 onchange="actualizarCuota(${index}, ${i}, this.value)"
                 ${i <= (pago.CuotasPagadas || 0) ? 'disabled' : ''}>
        </div>
      `;
    }
    cuotasHTML += '</div>';
    
    div.innerHTML = `
      <p>${pago.Nombre} - ${pago.Tipo} - $${pago.Precio} - Fecha: ${pago.Fecha}</p>
      <div class="detalles">
        <p>Saldo Restante: $${saldoRestante}</p>
        <p>Monto Pagado: $${montoPagado}</p>
        ${cuotasHTML}
        <button onclick="confirmarPago(${index})" class="confirmar">Confirmar Pago</button>
        <button onclick="eliminarPago(${index})" class="eliminar">Eliminar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

// Función para actualizar una cuota individual
async function actualizarCuota(index, numeroCuota, valor) {
  const resultado = await fetchAPI('actualizarPago', { 
    index, 
    cuotasPagadas: numeroCuota,
    montoPagado: parseFloat(valor)
  });
  if (resultado !== null) {
    actualizarListaPagos();
  }
}

// Funciones para manejar pagos
async function confirmarPago(index) {
  const resultado = await fetchAPI('confirmarPago', { index });
  if (resultado !== null) {
    actualizarListaPagos();
    actualizarListaCompletados();
  }
}

async function eliminarPago(index) {
  const resultado = await fetchAPI('eliminarPago', { index });
  if (resultado !== null) {
    actualizarListaPagos();
  }
}

// Actualizar lista de pagos completados
async function actualizarListaCompletados() {
  const completados = await fetchAPI('getPagosCompletados');
  if (!completados) return;

  const lista = document.getElementById("lista-completados");
  lista.innerHTML = "";
  
  completados.forEach((completado, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${completado.Nombre} - ${completado.Tipo} - $${completado.Precio} - Fecha: ${completado.Fecha}</p>
      <div class="detalles">
        <p>Fecha de completado: ${completado.FechaCompletado}</p>
        <button onclick="eliminarPagoCompletado(${index})" class="eliminar">Eliminar</button>
      </div>
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

// Inicializar las listas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarListaPresupuestos();
  actualizarListaPagos();
  actualizarListaCompletados();
});
