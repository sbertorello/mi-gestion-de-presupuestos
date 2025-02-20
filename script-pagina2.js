document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestosEnviados();
});

const API_URL = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec";

async function cargarPresupuestosEnviados() {
    const contenedor = document.getElementById("eventos-container");
    const loading = document.getElementById("loading");

    if (!contenedor) {
        console.error("Elemento 'eventos-container' no encontrado.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?accion=obtenerPresupuestosEnviados`);
        const data = await response.json();

        contenedor.innerHTML = "";
        loading.style.display = "none";

        if (!data || data.length === 0) {
            contenedor.innerHTML = "<p>No hay presupuestos enviados.</p>";
            return;
        }

        data.forEach((presupuesto, index) => {
            const item = document.createElement("div");
            item.classList.add("presupuesto-item");

            item.innerHTML = `
                <div class="presupuesto-header" onclick="toggleDetalles(${index})">
                    ${presupuesto.nombre} - ${presupuesto.fecha}
                </div>
                <div class="presupuesto-detalles" id="detalles-${index}">
                    <p><strong>Cliente:</strong> ${presupuesto.cliente}</p>
                    <p><strong>Monto:</strong> ${presupuesto.monto}</p>
                    <button class="btn-confirmar" onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
                    <button class="btn-rechazar" onclick="rechazarPresupuesto('${presupuesto.id}')">Rechazar</button>
                </div>
            `;

            contenedor.appendChild(item);
        });
    } catch (error) {
        console.error("Error al cargar los presupuestos:", error);
        contenedor.innerHTML = "<p>Error al cargar los presupuestos.</p>";
    }
}

function toggleDetalles(index) {
    const detalles = document.getElementById(`detalles-${index}`);
    if (detalles) {
        detalles.style.display = detalles.style.display === "none" ? "block" : "none";
    }
}

async function confirmarPresupuesto(id) {
    try {
        await fetch(`${API_URL}?accion=confirmarPresupuesto&id=${id}`);
        alert("Presupuesto confirmado.");
        cargarPresupuestosEnviados();
    } catch (error) {
        console.error("Error al confirmar presupuesto:", error);
    }
}

async function rechazarPresupuesto(id) {
    try {
        await fetch(`${API_URL}?accion=rechazarPresupuesto&id=${id}`);
        alert("Presupuesto rechazado.");
        cargarPresupuestosEnviados();
    } catch (error) {
        console.error("Error al rechazar presupuesto:", error);
    }
}
