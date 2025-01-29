const API_URL = 'https://script.google.com/macros/s/AKfycbyW1LuNTofuyQ4OL6tcTRKR09j9OBxQbBBevpQ7bVzRfDXcv1EPGmSbiqOA0FMAT6Hr/exec';

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
        <p>Fecha: ${pago.Fecha}</p>
        <p>Cuotas: ${pago.Cuotas}</p>
        ${Array.from({ length: pago.Cuotas }, (_, i) => `
          <p>Cuota ${i + 1}: <input type="number" min="0" max="${pago.Precio / pago.Cuotas}" 
             value="${pago[`Cuota${i + 1}`] || 0}" 
             onchange="actualizarCuota(${index}, ${i + 1}, this.value)"></p>
        `).join('')}
        <p>Monto pagado: $${pago.MontoPagado || 0}</p>
        <p>Saldo restante: $${pago.SaldoRestante || pago.Precio}</p>
        <button onclick="confirmarPago(${index})">Confirmar Pago</button>
        <button onclick="eliminarPago(${index})">Eliminar</button>
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

async function actualizarCuota(index, cuotaNumero, monto) {
  const resultado = await fetchAPI('actualizarCuota', { 
    index, 
    cuotaNumero, 
    monto: parseFloat(monto) 
  });
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

async function eliminarPago(index) {
  const resultado = await fetchAPI('eliminarPago', { index });
  if (resultado !== null) {
    actualizarListaPagos();
  }
}

async function actualizarListaCompletados() {
  const completados = await fetchAPI('getPagosCompletados');
  if (!completados) return;

  const lista = document.getElementById("lista-completados");
  lista.innerHTML = "";
  
  completados.forEach((completado, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${completado.Nombre} (${completado.Tipo}) - $${completado.Precio}</p>
      <div class="detalles">
        <p>Fecha de evento: ${completado.Fecha}</p>
        <p>Fecha de completado: ${completado.FechaCompletado}</p>
        <button onclick="eliminarPagoCompletado(${index})">Eliminar</button>
      </div>
    `;
    div.addEventListener("click", () => {
      div.classList.toggle("active");
    });
    lista.appendChild(div);
  });
}

async function eliminarPagoCompletado(index) {
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
