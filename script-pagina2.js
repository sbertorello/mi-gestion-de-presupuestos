const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

document.addEventListener("DOMContentLoaded", function() {
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
                    <div class="evento-nombre" onclick="toggleDetalles('${evento.timestamp}')">
                        ${evento.nombreEvento}
                    </div>
                    <div id="detalles-${evento.timestamp}" class="evento-detalle">
                        <p><strong>Precio:</strong> $${evento.precio}</p>
                        <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
                        <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
                        <p><strong>Fecha:</strong> ${evento.fechaEvento}</p>
                        <button class="btn-confirmar" onclick="confirmarPresupuesto('${evento.timestamp}')">Confirmar</button>
                        <button class="btn-eliminar" onclick="eliminarPresupuesto('${evento.timestamp}')">Eliminar</button>
                    </div>
                `;
                container.appendChild(eventoDiv);
            });
        })
        .catch(error => {
            console.error("Error al cargar los presupuestos:", error);
            const container = document.getElementById("presupuestos-container");
            if (container) {
                container.innerHTML = "<p>Error al cargar los presupuestos. Por favor, intente más tarde.</p>";
            }
        });
}

function toggleDetalles(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    if (detalles) {
        detalles.classList.toggle("mostrar");
    }
}

function confirmarPresupuesto(timestamp) {
    const formData = new URLSearchParams();
    formData.append('action', 'confirmarPresupuesto');
    formData.append('timestamp', timestamp);

    fetch(API_URL, {
        method: "POST",
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    })
    .then(() => {
        alert("Presupuesto confirmado exitosamente");
        setTimeout(cargarPresupuestos, 1000);
    })
    .catch(error => {
        console.error("Error al confirmar:", error);
        alert("Error al confirmar el presupuesto. Por favor, intente nuevamente.");
    });
}

function eliminarPresupuesto(timestamp) {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
        const formData = new URLSearchParams();
        formData.append('action', 'eliminarPresupuesto');
        formData.append('timestamp', timestamp);

        fetch(API_URL, {
            method: "POST",
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        })
        .then(() => {
            alert("Presupuesto eliminado exitosamente");
            setTimeout(cargarPresupuestos, 1000);
        })
        .catch(error => {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar el presupuesto. Por favor, intente nuevamente.");
        });
    }
}
