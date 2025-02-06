const API_URL = "https://script.google.com/macros/s/AKfycbxK9AeNgjZml5szfRhpQ1jC-OCZx6WqQ7dZKbCzN7FejnlQRsYit4rMyd5T9c-WeRjT/exec"; // Reemplaza con la URL de tu API

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
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((result) => {
        alert("Datos guardados correctamente");
        document.getElementById("formPresupuesto").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos");
      });
  });
