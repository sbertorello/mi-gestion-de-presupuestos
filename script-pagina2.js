const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página cargada. Cargando presupuestos...");
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            const container = document.getElementById("presupuestos-container");

            if (!container) {
                console.error("No se encontró el contenedor de presupuestos.");
                return;
            }

            container.innerHTML = data.length === 0 ? "<p>No hay presupuestos disponibles.</p>" : "";

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
        .catch(error => console.error("Error al cargar los presupuestos:", error));
}

function toggleDetalles(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    if (detalles) {
        detalles.style.display = detalles.style.display === "none" ? "block" : "none";
    }
}

function confirmarPresupuesto(id) {
    if (confirm("¿Estás seguro de confirmar este presupuesto?")) {
        actualizarEstado(id, "confirmarPresupuesto");
    }
}

function eliminarPresupuesto(id) {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
        actualizarEstado(id, "eliminarPresupuesto");
    }
}

function actualizarEstado(id, action) {
    fetch(API_URL, {
        method: "POST",
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            cargarPresupuestos(); // Actualiza la página
        }
    })
    .catch(error => console.error(`Error al ${action}:`, error));
}
