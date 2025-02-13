document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestosEnviados();
});

function cargarPresupuestosEnviados() {
    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?action=obtenerPresupuestos")
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById("presupuestosEnviados");
            contenedor.innerHTML = "";
            
            data.forEach(presupuesto => {
                const div = document.createElement("div");
                div.classList.add("presupuesto-item");
                div.innerHTML = `
                    <h3>${presupuesto.nombre || "Sin nombre"}</h3>
                    <p><strong>ID:</strong> ${presupuesto.id || "Sin ID"}</p>
                    <p><strong>Precio:</strong> ${presupuesto.precio || "Sin precio"}</p>
                    <p><strong>Tipo de Evento:</strong> ${presupuesto.tipoEvento || "Sin tipo"}</p>
                    <p><strong>Cuotas:</strong> ${presupuesto.cuotas || "Sin cuotas"}</p>
                    <p><strong>Fecha del Evento:</strong> ${presupuesto.fechaEvento || "Sin fecha"}</p>
                    <button class="confirmar" onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
                    <button class="eliminar" onclick="eliminarPresupuesto('${presupuesto.id}')">Eliminar</button>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(error => console.error("Error al cargar los presupuestos", error));
}

function confirmarPresupuesto(id) {
    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirmarPresupuesto", id: id })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
        cargarPresupuestosEnviados();
    })
    .catch(error => console.error("Error al confirmar presupuesto", error));
}

function eliminarPresupuesto(id) {
    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarPresupuesto", id: id })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
        cargarPresupuestosEnviados();
    })
    .catch(error => console.error("Error al eliminar presupuesto", error));
}
