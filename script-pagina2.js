document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestos();
});

function cargarPresupuestos() {
    fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec")
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.warn("No hay presupuestos guardados.");
                return;
            }

            let contenedor = document.getElementById("lista-presupuestos");
            contenedor.innerHTML = ""; // Limpiar contenido previo

            data.forEach(presupuesto => {
                let divEvento = document.createElement("div");
                divEvento.classList.add("caja-evento");

                let nombreEvento = document.createElement("div");
                nombreEvento.classList.add("evento-nombre");
                nombreEvento.textContent = presupuesto.nombre;

                let detallesEvento = document.createElement("div");
                detallesEvento.classList.add("evento-detalle", "oculto");

                // Agregamos detalles del evento
                detallesEvento.innerHTML = `
                    <p><strong>Fecha:</strong> ${presupuesto.fecha}</p>
                    <p><strong>Monto:</strong> $${presupuesto.monto}</p>
                    <div class="botones">
                        <button class="btn-confirmar" onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
                        <button class="btn-eliminar" onclick="eliminarPresupuesto('${presupuesto.id}')">Eliminar</button>
                    </div>
                `;

                // Agregar evento para desplegar detalles
                nombreEvento.addEventListener("click", function () {
                    detallesEvento.classList.toggle("oculto");
                });

                divEvento.appendChild(nombreEvento);
                divEvento.appendChild(detallesEvento);
                contenedor.appendChild(divEvento);
            });
        })
        .catch(error => console.error("Error al cargar presupuestos:", error));
}

function confirmarPresupuesto(id) {
    alert(`Presupuesto ${id} confirmado.`);
    // Aquí podrías hacer un fetch para actualizar el estado en la base de datos
}

function eliminarPresupuesto(id) {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
        alert(`Presupuesto ${id} eliminado.`);
        // Aquí podrías hacer un fetch para eliminarlo de la base de datos
    }
}
