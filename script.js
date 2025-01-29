// Variables globales
let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
let pagosEnCurso = JSON.parse(localStorage.getItem('pagosEnCurso')) || [];
let pagosCompletados = JSON.parse(localStorage.getItem('pagosCompletados')) || [];

// Mostrar secciones
function mostrarSeccion(seccionId) {
  document.querySelectorAll("section").forEach((seccion) => {
    seccion.style.display = "none";
  });
  document.getElementById(seccionId).style.display = "block";
}

// Guardar datos del presupuesto
document.getElementById("presupuesto-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre-evento").value;
  const precio = parseFloat(document.getElementById("precio-evento").value);
  const tipo = document.getElementById("tipo-evento").value;
  const cuotas = parseInt(document.getElementById("cuotas-evento").value);
  const fecha = document.getElementById("fecha-evento").value;

  if (nombre && precio && tipo && cuotas && fecha) {
    presupuestos.push({ nombre, precio, tipo, cuotas, fecha });
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
    document.getElementById("presupuesto-form").reset();
    document.getElementById("mensaje-confirmacion").style.display = "block";
    setTimeout(() => {
      document.getElementById("mensaje-confirmacion").style.display = "none";
    }, 3000);
    actualizarListaPresupuestos();
  } else {
    alert("Por favor, completa todos los campos.");
  }
});

// Actualizar lista de presupuestos enviados
function actualizarListaPresupuestos() {
  const lista = document.getElementById("lista-presupuestos");
  lista.innerHTML = "";
  presupuestos.forEach((presupuesto, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${presupuesto.nombre} (${presupuesto.tipo}) - $${presupuesto.precio}</p>
      <div class="detalles">
        <p>Fecha: ${presupuesto.fecha}</p>
        <p>Cuotas: ${presupuesto.cuotas}</p>
        <button onclick="confirmarPresupuesto(${index})">Confirmar</button>
        <button onclick="eliminarPresupuesto(${index})">Eliminar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function confirmarPresupuesto(index) {
  pagosEnCurso.push(presupuestos[index]);
  localStorage.setItem('pagosEnCurso', JSON.stringify(pagosEnCurso));
  presupuestos.splice(index, 1);
  localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
  actualizarListaPresupuestos();
  actualizarListaPagos();
}

function eliminarPresupuesto(index) {
  presupuestos.splice(index, 1);
  localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
  actualizarListaPresupuestos();
}

// Actualizar lista de pagos en curso
function actualizarListaPagos() {
  const lista = document.getElementById("lista-pagos");
  lista.innerHTML = "";
  pagosEnCurso.forEach((pago, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${pago.nombre} (${pago.tipo})</p>
      <button onclick="completarPago(${index})">Completar Pago</button>
    `;
    lista.appendChild(div);
  });
}

function completarPago(index) {
  pagosCompletados.push(pagosEnCurso[index]);
  localStorage.setItem('pagosCompletados', JSON.stringify(pagosCompletados));
  pagosEnCurso.splice(index, 1);
  localStorage.setItem('pagosEnCurso', JSON.stringify(pagosEnCurso));
  actualizarListaPagos();
  actualizarListaCompletados();
}

// Actualizar lista de pagos completados
function actualizarListaCompletados() {
  const lista = document.getElementById("lista-completados");
  lista.innerHTML = "";
  pagosCompletados.forEach((completado, index) => {
    const div = document.createElement("div");
    div.classList.add("evento");
    div.innerHTML = `
      <p>${completado.nombre} (${completado.tipo}) - $${completado.precio}</p>
      <button onclick="eliminarCompletado(${index})">Eliminar</button>
    `;
    lista.appendChild(div);
  });
}

function eliminarCompletado(index) {
  pagosCompletados.splice(index, 1);
  localStorage.setItem('pagosCompletados', JSON.stringify(pagosCompletados));
  actualizarListaCompletados();
}

// Inicializar listas
actualizarListaPresupuestos();
actualizarListaPagos();
actualizarListaCompletados();
