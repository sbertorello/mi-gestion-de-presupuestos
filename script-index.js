const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec"; // Reemplaza con tu URL

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("formPresupuesto")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nombreEvento = document.getElementById("nombreEvento").value;
      const precio = document.getElementById("precio").value;
      const tipoEvento = document.getElementById("tipoEvento").value;
      const cuotas = document.getElementById("cuotas").value;
      const fechaEvento = document.getElementById("fechaEvento").value;

      const data = {
        nombreEvento,
        precio,
        tipoEvento,
        cuotas,
        fechaEvento,
      };

      fetch(API_URL, {
        method: "POST",
        mode: "cors", // Asegúrate de que el modo sea "cors"
        body: JSON.stringify(data),
      })
        .then((response) => response.json()) // Convertir la respuesta a JSON
        .then((result) => {
          if (result.success) {
            alert(result.message); // Mostrar mensaje de éxito
            document.getElementById("formPresupuesto").reset(); // Borrar el formulario
          } else {
            throw new Error("Error al guardar los datos");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un error al guardar los datos");
        });
    });
});
