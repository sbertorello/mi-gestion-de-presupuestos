document.addEventListener("DOMContentLoaded", cargarPresupuestosPendientes);

async function cargarPresupuestosPendientes() {
    const lista = document.getElementById("lista-presupuestos");
    lista.innerHTML = "";
    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxtF-PyqeFnvv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec?action=obtenerPendientes");
        const data = await response.json();

        document.getElementById("loading").style.display = "none";

        if (data.success && data.presupuestos.length > 0) {
            data.presupuestos.forEach(presupuesto => {
                const item = document.createElement("div");
                item.classList.add("presupuesto-item");
                item.innerHTML = `<h3>${presupuesto.nombreEvento}</h3>`;
                const detalles = document.createElement("div");
                detalles.classList.add("detalles");
                detalles.innerHTML = `
                    <p>Tipo: ${presupuesto.tipoEvento}</p>
                    <p>Precio: $${presupuesto.precio}</p>
                    <p>Cuotas: ${presupuesto.cuotas}</p>
                    <p>Fecha: ${presupuesto.fechaEvento}</p>
                    <button class="confirmar" onclick="confirmarPresupuesto('${presupuesto.id}')">✅ Confirmar</button>
                    <button class="eliminar" onclick="eliminarPresupuesto('${presupuesto.id}')">❌ Eliminar</button>
                `;
                detalles.style.display = "none";
                item.appendChild(detalles);
                item.addEventListener("click", () => {
                    detalles.style.display = detalles.style.display === "none" ? "block" : "none";
                });
                lista.appendChild(item);
            });
        } else {
            lista.innerHTML = "<p>No hay presupuestos pendientes.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los presupuestos:", error);
        lista.innerHTML = "<p>Error al cargar los presupuestos.</p>";
    }
}

async function confirmarPresupuesto(id) {
    await actualizarEstadoPresupuesto(id, "confirmar");
}

async function eliminarPresupuesto(id) {
    await actualizarEstadoPresupuesto(id, "eliminar");
}

async function actualizarEstadoPresupuesto(id, accion) {
    try {
        await fetch(`https://script.google.com/macros/s/AKfycbxtF-PyqeFnvv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec?action=${accion}&id=${id}`);
        location.reload();
    } catch (error) {
        console.error(`Error al ${accion} el presupuesto:`, error);
    }
}
