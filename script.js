// URL del Google Apps Script
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzsrsjEkEtHSJVpbt9wKtyOJHpreQSpa0gnYJXEW2g80mLbaIBVi5lrpZ5mJSXow73qyA/exec";

// Mostrar secciones
function mostrarSeccion(seccionId) {
  document.querySelectorAll("section").forEach((seccion) => {
    seccion.style.display = "none";
  });
  document.getElementById(seccionId).style.display = "block";
}

// Guardar datos en Google Sheets
document.getElementById("presupuesto-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre-evento").value;
  const precio = document.getElementById("precio-evento").value;
  const tipo = document.getElementById("tipo-evento").value;
  const cuotas = document.getElementById("cuotas-evento").value;
  const fecha = document.getElementById("fecha-evento").value;

  if (nombre && precio && tipo && cuotas && fecha) {
    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("precio", precio);
    datos.append("tipo", tipo);
    datos.append("cuotas", cuotas);
    datos.append("fecha", fecha);

    fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      body: datos
    })
    .then(response => response.text())
    .then(data => {
      console.log("Respuesta del servidor:", data);
      document.getElementById("presupuesto-form").reset();
      document.getElementById("mensaje-confirmacion").style.display = "block";
      setTimeout(() => {
        document.getElementById("mensaje-confirmacion").style.display = "none";
      }, 3000);
    })
    .catch(error => console.error("Error al enviar datos:", error));
  } else {
    alert("Por favor, completa todos los campos.");
  }
};
