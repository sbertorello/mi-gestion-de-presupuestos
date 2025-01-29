// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDG6ftn5hJpMilh1y0cPjBOikpRjLj5aX8",
  authDomain: "gestion-de-presupuestos.firebaseapp.com",
  projectId: "gestion-de-presupuestos",
  storageBucket: "gestion-de-presupuestos.appspot.com",
  messagingSenderId: "511780646984",
  appId: "1:511780646984:web:384b3cc8359df4e25ba87d",
  measurementId: "G-0KBP0PPQZS"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para mostrar secciones
function mostrarSeccion(seccionId) {
  document.querySelectorAll("section").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(seccionId).style.display = "block";
}

// Guardar datos en Firestore
document.getElementById("presupuesto-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre-evento").value;
  const precio = document.getElementById("precio-evento").value;
  const tipo = document.getElementById("tipo-evento").value;
  const cuotas = document.getElementById("cuotas-evento").value;
  const fecha = document.getElementById("fecha-evento").value;

  if (nombre && precio && tipo && cuotas && fecha) {
    db.collection("presupuestos").add({
      nombre,
      precio: Number(precio),
      tipo,
      cuotas: Number(cuotas),
      fecha,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      document.getElementById("presupuesto-form").reset();
      document.getElementById("mensaje-confirmacion").style.display = "block";
      setTimeout(() => {
        document.getElementById("mensaje-confirmacion").style.display = "none";
      }, 3000);
    })
    .catch(error => console.error("Error al guardar en Firestore:", error));
  } else {
    alert("Por favor, completa todos los campos.");
  }
});
