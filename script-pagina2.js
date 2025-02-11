const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página cargada. Cargando presupuestos...");
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch(`${API_URL}?action=getPresupuestos`, {
        method: 'GET',
        mode: 'no-cors'
    })
        .then(response => response.text())
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                return [];
            }
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            const container = document.getElementById("presupuestos-container");
            if (!container) {
                console.error("No se encontró el contenedor de presupuestos.");
                return;
            }
            container.innerHTML = "";
            if (!data || data.length === 0) {
                container.innerHTML = "<p>No hay presupuestos disponibles.</p>";
                return;
            }
            data.forEach(evento => {
                const eventoDiv = document.createElement("div");
                eventoDiv.classList.add("presupuesto-box");
                eventoDiv.innerHTML = `
                    <div class="evento-nombre" onclick="toggleDetalles('${evento.id}')">
                        ${evento.nombreEvento}
                    </div>
                    <div id="detalles-${evento.id}" class="evento-detalle">
                        <p><strong>Precio:</strong> $${evento.precio}</p>
                        <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
                        <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
                        <p><strong>Fecha:</strong> ${evento.fechaEvento}</p>
                        <button class="btn-confirmar" onclick="confirmarPresupuesto('${evento.id}')">Confirmar</button>
                        <button class="btn-eliminar" onclick="eliminarPresupuesto('${evento.id}')">Eliminar</button>
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
        detalles.classList.toggle("mostrar");
    }
}

function confirmarPresupuesto(id) {
    const formData = new FormData();
    formData.append('action', 'confirmarPresupuesto');
    formData.append('id', id);

    fetch(API_URL, {
        method: "POST",
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        alert("Presupuesto confirmado");
        cargarPresupuestos();
    })
    .catch(error => console.error("Error al confirmar:", error));
}

function eliminarPresupuesto(id) {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
        const formData = new FormData();
        formData.append('action', 'eliminarPresupuesto');
        formData.append('id', id);

        fetch(API_URL, {
            method: "POST",
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            alert("Presupuesto eliminado");
            cargarPresupuestos();
        })
        .catch(error => console.error("Error al eliminar:", error));
    }
}
