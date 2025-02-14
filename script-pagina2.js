document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnvv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";
    cargarPresupuestosPendientes();

    async function cargarPresupuestosPendientes() {
        try {
            const response = await fetch(`${API_URL}?action=obtenerPendientes`);
            const data = await response.json();
            if (data.success) {
                mostrarPresupuestos(data.presupuestos);
            }
        } catch (error) {
            console.error("Error al cargar los presupuestos:", error);
        }
    }

    function mostrarPresupuestos(presupuestos) {
        const lista = document.getElementById("lista-presupuestos");
        lista.innerHTML = "";

        presupuestos.forEach(presupuesto => {
            const item = document.createElement("div");
            item.className = "presupuesto-item";
            item.innerHTML = `<h3 class="presupuesto-nombre">${presupuesto.nombreEvento}</h3>
                              <div class="presupuesto-detalle oculto">
                                  <p><strong>Tipo:</strong> ${presupuesto.tipoEvento}</p>
                                  <p><strong>Precio:</strong> $${presupuesto.precio}</p>
                                  <p><strong>Cuotas:</strong> ${presupuesto.cuotas}</p>
                                  <p><strong>Fecha:</strong> ${presupuesto.fechaEvento}</p>
                                  <button class="btn-confirmar" data-id="${presupuesto.id}">✅ Confirmar</button>
                                  <button class="btn-eliminar" data-id="${presupuesto.id}">❌ Eliminar</button>
                              </div>`;
            lista.appendChild(item);

            item.querySelector(".presupuesto-nombre").addEventListener("click", function () {
                item.querySelector(".presupuesto-detalle").classList.toggle("oculto");
            });

            item.querySelector(".btn-confirmar").addEventListener("click", function () {
                actualizarEstado(presupuesto.id, "Confirmado");
            });

            item.querySelector(".btn-eliminar").addEventListener("click", function () {
                actualizarEstado(presupuesto.id, "Rechazado");
            });
        });
    }

    async function actualizarEstado(id, estado) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "actualizarEstado", id, estado })
            });
            const data = await response.json();
            if (data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
        }
    }
});
