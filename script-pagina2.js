const API_URL = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec";

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página cargada. Cargando presupuestos...");
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`, { mode: 'cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);

            const container = document.getElementById("presupuestos-container");
            if (!container) {
                console.error("No se encontró el contenedor de presupuestos.");
                return;
            }

            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<p>No hay presupuestos disponibles.</p>";
                return;
            }

            data.forEach(evento => {
                const eventoDiv = document.createElement("div");
                eventoDiv.classList.add("presupuesto-box");
                eventoDiv.innerHTML = `
                    <h3 onclick="toggleDetalles(${evento.id})">${evento.nombreEvento}</h3>
                    <div id="detalles-${evento.id}" class="detalles" style="display: none;">
                        <p><strong>Precio:</strong> ${evento.precio}</p>
                        <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
                        <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
                        <p><strong>Fecha:</strong> ${evento.fechaEvento}</p>
                        <button class="btn-confirmar" onclick="confirmarPresupuesto(${evento.id})">Confirmar</button>
                        <button class="btn-eliminar" onclick="eliminarPresupuesto(${evento.id})">Eliminar</button>
                    </div>
                `;
                container.appendChild(eventoDiv);
            });
        })
        .catch(error => {
            console.error("Error al cargar los presupuestos:", error);
        });
}

function toggleDetalles(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    if (detalles) {
        detalles.style.display = detalles.style.display === "none" ? "block" : "none";
    }
}

function confirmarPresupuesto(id) {
    fetch(`${API_URL}`, {
        method: "POST",
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirmarPresupuesto", id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto confirmado");
            cargarPresupuestos();
        }
    })
    .catch(error => console.error("Error al confirmar:", error));
}

function eliminarPresupuesto(id) {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
        fetch(`${API_URL}`, {
            method: "POST",
            mode: 'cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "eliminarPresupuesto", id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Presupuesto eliminado");
                cargarPresupuestos();
            }
        })
        .catch(error => console.error("Error al eliminar:", error));
    }
}
