document.addEventListener("DOMContentLoaded", function () {
    const eventosContainer = document.getElementById("eventos-container");
    const loading = document.getElementById("loading");

    // URL de Google Apps Script
    const URL_APP_SCRIPT = "https://script.google.com/macros/s/AKfycbzIxBOkWqhvjIBocmR8ZGljvyJDl5m3cZOaz4qAr-BXmsOvplcN_crmKawKy_nhsnGuxQ/exec";

    // Función para cargar los presupuestos enviados
    function cargarPresupuestos() {
        fetch(`${URL_APP_SCRIPT}?accion=obtenerPresupuestos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";
            eventosContainer.innerHTML = "";

            if (!data || data.length === 0) {
                eventosContainer.innerHTML = "<p>No hay presupuestos enviados.</p>";
                return;
            }

            data.forEach(presupuesto => {
                const item = document.createElement("div");
                item.classList.add("presupuesto-item");

                item.innerHTML = `
                    <div class="presupuesto-header">${presupuesto.cliente} - ${presupuesto.monto}</div>
                    <div class="presupuesto-detalles">
                        <p><strong>Fecha:</strong> ${presupuesto.fecha}</p>
                        <p><strong>Descripción:</strong> ${presupuesto.descripcion}</p>
                        <button class="btn-confirmar" data-id="${presupuesto.id}">Confirmar</button>
                        <button class="btn-rechazar" data-id="${presupuesto.id}">Rechazar</button>
                    </div>
                `;

                eventosContainer.appendChild(item);

                // Mostrar detalles al hacer clic en el encabezado
                item.querySelector(".presupuesto-header").addEventListener("click", () => {
                    const detalles = item.querySelector(".presupuesto-detalles");
                    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
                });

                // Eventos para confirmar y rechazar
                item.querySelector(".btn-confirmar").addEventListener("click", () => cambiarEstadoPresupuesto(presupuesto.id, "Confirmado"));
                item.querySelector(".btn-rechazar").addEventListener("click", () => cambiarEstadoPresupuesto(presupuesto.id, "Rechazado"));
            });
        })
        .catch(error => {
            console.error("Error al cargar los presupuestos:", error);
            loading.innerHTML = "Error al cargar los presupuestos.";
        });
    }

    // Función para cambiar estado de un presupuesto
    function cambiarEstadoPresupuesto(id, nuevoEstado) {
        fetch(`${URL_APP_SCRIPT}?accion=cambiarEstado&id=${id}&estado=${nuevoEstado}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            cargarPresupuestos();
        })
        .catch(error => console.error("Error al cambiar el estado:", error));
    }

    // Cargar los presupuestos al iniciar
    cargarPresupuestos();
});
