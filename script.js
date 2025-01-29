// Reemplaza esta URL con la URL de tu Web App
const API_URL = 'https://script.google.com/macros/s/AKfycbyW1LuNTofuyQ4OL6tcTRKR09j9OBxQbBBevpQ7bVzRfDXcv1EPGmSbiqOA0FMAT6Hr/exec';

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
  
  // Actualizar la lista correspondiente
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

// Guardar datos del presupuesto
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
      <p>${presupuesto.Nombre} (${presupuesto.Tipo}) - $${presupuesto.Precio}</p>
      <div class="detalles">
        <p>Tipo de Evento: ${presupuesto.Tipo}</p>
        <p>Fecha: ${presupuesto.Fecha}</p>
        <p>Cuotas: ${presupuesto.Cuotas}</p>
        <button onclick="confirmarPresupuesto(${index})">Confirmar</button>
        <button onclick="eliminarPresupuesto(${index})">Eliminar</button>
      </div>
    `;
    div.addEventListener("click", (e) => {
      if (!e.target.matches('button')) {
        div.classList.toggle("active");
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

// Actualizar lista de pagos en curso
async function actualizarListaPagos() {
  const pagos = await fetchAPI('getPagosEnCurso');
  if (!pagos) return;

  const lista = document.getElementById("lista-pagos");
  lista.innerHTML = "";
  
  pagos.forEach((pago, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${pago.Nombre} (${pago.Tipo}) - $${pago.Precio}</p>
      <div class="detalles">
        <p>Cuotas: ${pago.Cuotas}</p>
        <p>Cuotas pagadas: <input type="number" min="0" max="${pago.Cuotas}" 
           value="${pago.CuotasPagadas || 0}" 
           onchange="actualizarCuotasPagadas(${index}, this.value)"></p>
        <p>Monto pagado: $${pago.MontoPagado || 0}</p>
        <p>Saldo restante: $${pago.SaldoRestante || pago.Precio}</p>
        <button onclick="completarPago(${index})">Completar</button>
      </div>
    `;
    div.addEventListener("click", (e) => {
      if (!e.target.matches('input, button')) {
        div.classList.toggle("active");
      }
    });
    lista.appendChild(div);
  });
}

async function actualizarCuotasPagadas(index, cuotasPagadas) {
  const resultado = await fetchAPI('actualizarPago', { 
    index, 
    cuotasPagadas: parseInt(cuotasPagadas) 
  });
  if (resultado !== null) {
    actualizarListaPagos();
  }
}

async function completarPago(index) {
  const resultado = await fetchAPI('completarPago', { index });
  if (resultado !== null) {
    actualizarListaPagos();
    actualizarListaCompletados();
  }
}

// Actualizar lista de pagos completados
async function actualizarListaCompletados() {
  const completados = await fetchAPI('getPagosCompletados');
  if (!completados) return;

  const lista = document.getElementById("lista-completados");
  lista.innerHTML = "";
  
  completados.forEach((completado) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${completado.Nombre} (${completado.Tipo}) - $${completado.Precio}</p>
      <div class="detalles">
        <p>Fecha de evento: ${completado.Fecha}</p>
        <p>Fecha de completado: ${completado.FechaCompletado}</p>
      </div>
    `;
    div.addEventListener("click", () => {
      div.classList.toggle("active");
    });
    lista.appendChild(div);
  });
}

// Inicializar las listas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarListaPresupuestos();
  actualizarListaPagos();
  actualizarListaCompletados();
});
