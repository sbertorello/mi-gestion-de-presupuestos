const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", function() {
    console.log("Cargando presupuestos...");
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            const container = document.getElementById("presupuestos-container");
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<p>No hay presupuestos disponibles.</p>";
                return;
            }

            data.forEach(evento => {
                const eventoDiv = document.createElement("div");
                eventoDiv.classList.add("presupuesto-box");
                eventoDiv.innerHTML = `
                    <h3 class="evento-nombre" data-id="${evento.id}">${evento.nombreEvento}</h3>
                    <div id="detalles-${evento.id}" class="detalles" style="display: none;">
                        <p><strong>Precio:</strong> ${evento.precio}</p>
                        <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
                        <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
                        <p><strong>Fecha:</strong> ${evento.fechaEvento}</p>
                        <button class="btn-confirmar" data-id="${evento.id}">Confirmar</button>
                        <button class="btn-eliminar" data-id="${evento.id}">Eliminar</button>
                    </div>
                `;
                container.appendChild(eventoDiv);
            });

            // Agregar eventos de clic para desplegar detalles
            document.querySelectorAll(".evento-nombre").forEach(item => {
                item.addEventListener("click", function() {
                    const id = this.dataset.id;
                    const detalles = document.getElementById(`detalles-${id}`);
                    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
                });
            });

            // Agregar eventos de clic para botones
            document.querySelectorAll(".btn-confirmar").forEach(btn => {
                btn.addEventListener("click", function() {
                    confirmarPresupuesto(this.dataset.id);
                });
            });

            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", function() {
                    eliminarPresupuesto(this.dataset.id);
                });
            });

        })
        .catch(error => console.error("Error al cargar los presupuestos:", error));
}

function confirmarPresupuesto(id) {
    fetch(API_URL, {
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
        fetch(API_URL, {
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
