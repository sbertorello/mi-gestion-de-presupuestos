const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", () => {
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("presupuestos-container");
            container.innerHTML = "";

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
    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
}

function confirmarPresupuesto(id) {
    fetch(`${API_URL}?action=confirmarPresupuesto&id=${id}`, { method: "POST" })
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
        fetch(`${API_URL}?action=eliminarPresupuesto&id=${id}`, { method: "POST" })
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
