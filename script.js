document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestosEnviados();
});

// Función para guardar un presupuesto en Google Sheets
function guardarPresupuesto(event) {
    event.preventDefault(); // Evita el recargo de la página

    let nombreEvento = document.getElementById("nombre-evento").value;
    let precioEvento = document.getElementById("precio-evento").value;
    let tipoEvento = document.getElementById("tipo-evento").value;
    let cuotasEvento = document.getElementById("cuotas-evento").value;
    let fechaEvento = document.getElementById("fecha-evento").value;

    if (!nombreEvento || !precioEvento || !fechaEvento) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let datos = {
        nombre: nombreEvento,
        precio: precioEvento,
        tipo: tipoEvento,
        cuotas: cuotasEvento,
        fecha: fechaEvento,
    };

    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec", {
        method: "POST",
        body: JSON.stringify(datos),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto guardado correctamente.");
            document.getElementById("presupuesto-form").reset();
            cargarPresupuestosEnviados();
        } else {
            alert("Error al guardar el presupuesto.");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Función para cargar los presupuestos en la segunda página
function cargarPresupuestosEnviados() {
    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?action=leer")
    .then(response => response.json())
    .then(data => {
        let listaPresupuestos = document.getElementById("lista-presupuestos");
        listaPresupuestos.innerHTML = ""; // Limpia la lista antes de actualizar

        data.forEach(presupuesto => {
            let div = document.createElement("div");
            div.className = "presupuesto-item";
            div.innerHTML = `
                <p><strong>${presupuesto.nombre}</strong></p>
                <button onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
                <button onclick="eliminarPresupuesto('${presupuesto.id}')">Eliminar</button>
            `;
            listaPresupuestos.appendChild(div);
        });
    })
    .catch(error => console.error("Error:", error));
}

// Función para eliminar un presupuesto
function eliminarPresupuesto(id) {
    fetch(`https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?action=eliminar&id=${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto eliminado.");
            cargarPresupuestosEnviados();
        } else {
            alert("Error al eliminar el presupuesto.");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Función para confirmar un presupuesto (pasar a "Pagos en Curso")
function confirmarPresupuesto(id) {
    fetch(`https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?action=confirmar&id=${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto confirmado.");
            cargarPresupuestosEnviados();
        } else {
            alert("Error al confirmar el presupuesto.");
        }
    })
    .catch(error => console.error("Error:", error));
}
