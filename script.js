document.addEventListener("DOMContentLoaded", function () {
    mostrarSeccion('presupuestos'); // Mostrar sección por defecto

    document.getElementById("presupuesto-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Capturar datos del formulario
        let nombreEvento = document.getElementById("nombre-evento").value;
        let precioEvento = document.getElementById("precio-evento").value;
        let tipoEvento = document.getElementById("tipo-evento").value;
        let cuotasEvento = document.getElementById("cuotas-evento").value;
        let fechaEvento = document.getElementById("fecha-evento").value;

        // Enviar datos a Google Apps Script
        fetch("TU_URL_WEB_APP", {
            method: "POST",
            body: JSON.stringify({
                nombre: nombreEvento,
                precio: precioEvento,
                tipo: tipoEvento,
                cuotas: cuotasEvento,
                fecha: fechaEvento,
                estado: "Pendiente"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById("mensaje-confirmacion").style.display = "block";
                document.getElementById("presupuesto-form").reset();
            } else {
                alert("Error al guardar el presupuesto.");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Cargar presupuestos guardados al abrir la página
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch("TU_URL_WEB_APP")
        .then(response => response.json())
        .then(data => {
            let lista = document.getElementById("lista-presupuestos");
            lista.innerHTML = "";

            data.presupuestos.forEach(presupuesto => {
                let div = document.createElement("div");
                div.classList.add("evento");
                div.innerHTML = `
                    <strong>${presupuesto.nombre}</strong> - ${presupuesto.tipo} - $${presupuesto.precio} 
                    <br> ${presupuesto.cuotas} cuota(s) - Fecha: ${presupuesto.fecha}
                    <br> Estado: ${presupuesto.estado}
                `;
                lista.appendChild(div);
            });
        })
        .catch(error => console.error("Error al cargar presupuestos:", error));
}
