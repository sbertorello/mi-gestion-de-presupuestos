document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("presupuesto-form").addEventListener("submit", guardarPresupuesto);
});

function guardarPresupuesto(event) {
    event.preventDefault(); // Evita la recarga de la página

    // Capturar los datos del formulario
    let nombreEvento = document.getElementById("nombre-evento").value;
    let precioEvento = document.getElementById("precio-evento").value;
    let tipoEvento = document.getElementById("tipo-evento").value;
    let cuotasEvento = document.getElementById("cuotas-evento").value;
    let fechaEvento = document.getElementById("fecha-evento").value;

    // Validar que todos los campos estén completos
    if (!nombreEvento || !precioEvento || !tipoEvento || !cuotasEvento || !fechaEvento) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Construir objeto de datos
    let datos = {
        nombreEvento: nombreEvento,
        precioEvento: precioEvento,
        tipoEvento: tipoEvento,
        cuotasEvento: cuotasEvento,
        fechaEvento: fechaEvento
    };

    // URL de tu Apps Script
    let urlAppScript = "https://script.google.com/macros/s/AKfycbxHb7-QFyYks7xO6rkNqQpNRnyTZ6VDBsSa3_-D_2SJn5fcf-9bRahWe4Wz3sbqx4vQ/exec";

    fetch(urlAppScript, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("presupuesto-form").reset();
            alert("Presupuesto guardado correctamente.");
        } else {
            alert("Error al guardar el presupuesto: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    });
}
