document.getElementById("formPresupuesto").addEventListener("submit", function(event) {
    event.preventDefault();

    let datos = {
        NombreEvento: document.getElementById("nombreEvento").value,
        Precio: document.getElementById("precio").value,
        TipoEvento: document.getElementById("tipoEvento").value,
        Cuotas: document.getElementById("cuotas").value,
        FechaEvento: document.getElementById("fechaEvento").value
    };

    fetch("https://script.google.com/macros/s/AKfycbxHb7-QFyYks7xO6rkNqQpNRnyTZ6VDBsSa3_-D_2SJn5fcf-9bRahWe4Wz3sbqx4vQ/exec", {
        method: "POST",
        mode: "cors", // Permitir CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Presupuesto guardado exitosamente.");
        } else {
            alert("Error al guardar el presupuesto.");
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
});
