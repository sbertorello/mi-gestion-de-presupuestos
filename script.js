document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("presupuesto-form").addEventListener("submit", guardarPresupuesto);
});

function guardarPresupuesto(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

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

    // Enviar los datos a Google Sheets
    let urlAppScript = "URL_DE_TU_APPS_SCRIPT"; // Reemplázala con la URL de tu implementación de Apps Script
    let datos = {
        nombreEvento: nombreEvento,
        precioEvento: precioEvento,
        tipoEvento: tipoEvento,
        cuotasEvento: cuotasEvento,
        fechaEvento: fechaEvento
    };

    fetch(urlAppScript, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("presupuesto-form").reset();
            document.getElementById("mensaje-confirmacion").style.display = "block";
            setTimeout(() => {
                document.getElementById("mensaje-confirmacion").style.display = "none";
            }, 3000);
        } else {
            alert("Error al guardar los datos.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    });
}
