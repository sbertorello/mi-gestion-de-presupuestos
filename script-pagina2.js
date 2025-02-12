const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada. Cargando presupuestos...");
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Presupuestos recibidos:", data);
            mostrarPresupuestos(data);
        })
        .catch(error => {
            console.error("Error al cargar los presupuestos:", error);
        });
}

function mostrarPresupuestos(presupuestos) {
    const lista = document.getElementById("lista-presupuestos");
    lista.innerHTML = ""; // Limpiar lista

    if (presupuestos.length === 0) {
        lista.innerHTML = "<p>No hay presupuestos disponibles.</p>";
        return;
    }

    presupuestos.forEach(presupuesto => {
        const item = document.createElement("div");
        item.classList.add("presupuesto-item");
        item.innerHTML = `
            <p><strong>ID:</strong> ${presupuesto.ID}</p>
            <p><strong>Cliente:</strong> ${presupuesto.Cliente}</p>
            <p><strong>Monto:</strong> ${presupuesto.Monto}</p>
            <p><strong>Estado:</strong> ${presupuesto.Estado}</p>
            <button onclick="confirmarPresupuesto('${presupuesto.ID}')">Confirmar</button>
            <button onclick="rechazarPresupuesto('${presupuesto.ID}')">Rechazar</button>
        `;
        lista.appendChild(item);
    });
}

function confirmarPresupuesto(id) {
    fetch(`${API_URL}?action=confirmarPresupuesto&id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cargarPresupuestos();
        })
        .catch(error => console.error("Error al confirmar presupuesto:", error));
}

function rechazarPresupuesto(id) {
    fetch(`${API_URL}?action=rechazarPresupuesto&id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cargarPresupuestos();
        })
        .catch(error => console.error("Error al rechazar presupuesto:", error));
}
