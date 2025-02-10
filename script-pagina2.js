const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", () => {
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(API_URL + "?action=getPresupuestos")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarPresupuestos(data.presupuestos);
            }
        })
        .catch(error => console.error("Error cargando presupuestos:", error));
}

function mostrarPresupuestos(presupuestos) {
    const container = document.getElementById("presupuestos-container");
    container.innerHTML = "";

    presupuestos.forEach(presupuesto => {
        const div = document.createElement("div");
        div.classList.add("presupuesto-item");

        div.innerHTML = `
            <p><strong>${presupuesto.nombreEvento}</strong></p>
            <p>Precio: ${presupuesto.precio}</p>
            <p>Tipo: ${presupuesto.tipoEvento}</p>
            <p>Cuotas: ${presupuesto.cuotas}</p>
            <p>Fecha: ${presupuesto.fechaEvento}</p>
            <button class="confirmar" onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
            <button class="eliminar" onclick="eliminarPresupuesto('${presupuesto.id}')">Eliminar</button>
        `;

        container.appendChild(div);
    });
}

function confirmarPresupuesto(id) {
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "confirmarPresupuesto", id }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto confirmado");
            cargarPresupuestos();
        }
    })
    .catch(error => console.error("Error confirmando presupuesto:", error));
}

function eliminarPresupuesto(id) {
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "eliminarPresupuesto", id }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto eliminado");
            cargarPresupuestos();
        }
    })
    .catch(error => console.error("Error eliminando presupuesto:", error));
}
