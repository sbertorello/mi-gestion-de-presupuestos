const API_URL = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec"; // URL de tu Apps Script

document.getElementById("presupuestoForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombreEvento = document.getElementById("nombreEvento").value;
    const precio = document.getElementById("precio").value;
    const tipoEvento = document.getElementById("tipoEvento").value;
    const cuotas = document.getElementById("cuotas").value;
    const fechaEvento = document.getElementById("fechaEvento").value;

    const datos = {
        action: "guardar",
        nombreEvento,
        precio,
        tipoEvento,
        cuotas,
        fechaEvento
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(datos),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        alert(result.message);
        cargarPresupuestos();
        document.getElementById("presupuestoForm").reset();
    } catch (error) {
        alert("Error al guardar: " + error);
    }
});

async function cargarPresupuestos() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "obtener" }),
            headers: { "Content-Type": "application/json" }
        });

        const presupuestos = await response.json();
        const lista = document.getElementById("listaPresupuestos");
        lista.innerHTML = "";

        presupuestos.forEach((presupuesto) => {
            const item = document.createElement("li");
            item.innerHTML = `
                <strong>${presupuesto.nombreEvento}</strong> - ${presupuesto.tipoEvento} - $${presupuesto.precio} - ${presupuesto.fechaEvento} 
                <button onclick="eliminarPresupuesto('${presupuesto.nombreEvento}')">Eliminar</button>
            `;
            lista.appendChild(item);
        });

    } catch (error) {
        alert("Error al cargar los presupuestos: " + error);
    }
}

async function eliminarPresupuesto(nombreEvento) {
    if (!confirm(`¿Eliminar "${nombreEvento}"?`)) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "eliminar", nombreEvento }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        alert(result.message);
        cargarPresupuestos();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

// Cargar la lista de presupuestos al abrir la página
cargarPresupuestos();
