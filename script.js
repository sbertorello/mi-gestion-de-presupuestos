document.getElementById("presupuesto-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Obtener valores del formulario
  var nombre = document.getElementById("nombre-evento").value;
  var precio = document.getElementById("precio-evento").value;
  var tipo = document.getElementById("tipo-evento").value;
  var cuotas = document.getElementById("cuotas-evento").value;
  var fecha = document.getElementById("fecha-evento").value;

  // Verificar que todos los campos estén completos
  if (nombre === "" || precio === "" || fecha === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // URL de Google Apps Script
  var url = "TU_URL_DE_LA_APP_AQUÍ";

  // Enviar datos a Google Sheets
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: nombre,
      precio: precio,
      tipo: tipo,
      cuotas: cuotas,
      fecha: fecha
    })
  }).then(() => {
    // Mostrar mensaje de confirmación
    document.getElementById("mensaje-confirmacion").style.display = "block";

    // Limpiar formulario después de 2 segundos
    setTimeout(() => {
      document.getElementById("mensaje-confirmacion").style.display = "none";
      document.getElementById("presupuesto-form").reset();
    }, 2000);
  }).catch(error => console.log("Error:", error));
});
