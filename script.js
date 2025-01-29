// 🔥 Configuración de Firebase (reemplaza con tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyDG6ftn5hJpMilh1y0cPjBOikpRjLj5aX8",
  authDomain: "gestion-de-presupuestos.firebaseapp.com",
  databaseURL: "https://gestion-de-presupuestos-default-rtdb.firebaseio.com",
  projectId: "gestion-de-presupuestos",
  storageBucket: "gestion-de-presupuestos.firebasestorage.app",
  messagingSenderId: "511780646984",
  appId: "1:511780646984:web:384b3cc8359df4e25ba87d",
  measurementId: "G-0KBP0PPQZS"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Mostrar secciones
function mostrarSeccion(seccionId) {
  document.querySelectorAll("section").forEach((seccion) => {
    seccion.style.display = "none";
  });
  document.getElementById(seccionId).style.display = "block";
}

// Guardar datos del presupuesto en Firebase
document.getElementById("presupuesto-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre-evento").value;
  const precio = parseFloat(document.getElementById("precio-evento").value);
  const tipo = document.getElementById("tipo-evento").value;
  const cuotas = parseInt(document.getElementById("cuotas-evento").value);
  const fecha = document.getElementById("fecha-evento").value;

  if (nombre && precio && tipo && cuotas && fecha) {
    db.collection("presupuestos").add({
      nombre,
      precio,
      tipo,
      cuotas,
      fecha,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      document.getElementById("presupuesto-form").reset();
      document.getElementById("mensaje-confirmacion").style.display = "block";
      setTimeout(() => {
        document.getElementById("mensaje-confirmacion").style.display = "none";
      }, 3000);
      actualizarListaPresupuestos();
    })
    .catch(error => console.error("Error al guardar: ", error));
  } else {
    alert("Por favor, completa todos los campos.");
  }
});

// Actualizar lista de presupuestos desde Firebase
function actualizarListaPresupuestos() {
  const lista = document.getElementById("lista-presupuestos");
  lista.innerHTML = "";

  db.collection("presupuestos").orderBy("timestamp", "desc").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const presupuesto = doc.data();
        const div = document.createElement("div");
        div.classList.add("evento");
        div.innerHTML = `
          <p>${presupuesto.nombre} (${presupuesto.tipo}) - $${presupuesto.precio}</p>
          <div class="detalles">
            <p>Fecha: ${presupuesto.fecha}</p>
            <p>Cuotas: ${presupuesto.cuotas}</p>
            <button onclick="confirmarPresupuesto('${doc.id}')">Confirmar</button>
            <button onclick="eliminarPresupuesto('${doc.id}')">Eliminar</button>
          </div>
        `;
        lista.appendChild(div);
      });
    })
    .catch(error => console.error("Error al obtener presupuestos: ", error));
}

// Confirmar presupuesto y moverlo a "Pagos en Curso"
function confirmarPresupuesto(id) {
  db.collection("presupuestos").doc(id).get()
    .then((doc) => {
      if (doc.exists) {
        db.collection("pagosEnCurso").add(doc.data()).then(() => {
          db.collection("presupuestos").doc(id).delete();
          actualizarListaPresupuestos();
          actualizarListaPagos();
        });
      }
    });
}

// Eliminar un presupuesto
function eliminarPresupuesto(id) {
  db.collection("presupuestos").doc(id).delete()
    .then(() => actualizarListaPresupuestos())
    .catch(error => console.error("Error al eliminar: ", error));
}

// Actualizar lista de pagos en curso desde Firebase
function actualizarListaPagos() {
  const lista = document.getElementById("lista-pagos");
  lista.innerHTML = "";

  db.collection("pagosEnCurso").orderBy("timestamp", "desc").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const pago = doc.data();
        const div = document.createElement("div");
        div.classList.add("evento");
        div.innerHTML = `
          <p>${pago.nombre} (${pago.tipo})</p>
          <button onclick="completarPago('${doc.id}')">Completar Pago</button>
        `;
        lista.appendChild(div);
      });
    })
    .catch(error => console.error("Error al obtener pagos en curso: ", error));
}

// Completar un pago y moverlo a "Pagos Completados"
function completarPago(id) {
  db.collection("pagosEnCurso").doc(id).get()
    .then((doc) => {
      if (doc.exists) {
        db.collection("pagosCompletados").add(doc.data()).then(() => {
          db.collection("pagosEnCurso").doc(id).delete();
          actualizarListaPagos();
          actualizarListaCompletados();
        });
      }
    });
}

// Actualizar lista de pagos completados desde Firebase
function actualizarListaCompletados() {
  const lista = document.getElementById("lista-completados");
  lista.innerHTML = "";

  db.collection("pagosCompletados").orderBy("timestamp", "desc").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const completado = doc.data();
        const div = document.createElement("div");
        div.classList.add("evento");
        div.innerHTML = `
          <p>${completado.nombre} (${completado.tipo}) - $${completado.precio}</p>
          <button onclick="eliminarCompletado('${doc.id}')">Eliminar</button>
        `;
        lista.appendChild(div);
      });
    })
    .catch(error => console.error("Error al obtener pagos completados: ", error));
}

// Eliminar un pago completado
function eliminarCompletado(id) {
  db.collection("pagosCompletados").doc(id).delete()
    .then(() => actualizarListaCompletados())
    .catch(error => console.error("Error al eliminar: ", error));
}

// Inicializar listas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarListaPresupuestos();
  actualizarListaPagos();
  actualizarListaCompletados();
});
