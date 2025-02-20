document.addEventListener("DOMContentLoaded", async function () {
    await cargarPresupuestosEnviados();
});

async function cargarPresupuestosEnviados() {
    const contenedor = document.getElementById("eventos-container");
    contenedor.innerHTML = "<p>Cargando presupuestos...</p>";

    try {
        const respuesta = await fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?accion=obtenerPresupuestos");
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ""; // Limpiar la pantalla

        if (datos.length === 0) {
            contenedor.innerHTML = "<p>No hay presupuestos enviados.</p>";
            return;
        }

        datos.forEach((presupuesto, index) => {
            const presupuestoElemento = document.createElement("div");
            presupuestoElemento.classList.add("presupuesto");
            presupuestoElemento.innerHTML = `
                <p><strong>Cliente:</strong> ${presupuesto.cliente}</p>
                <p><strong>Monto:</strong> $${presupuesto.monto}</p>
                <p><strong>Estado:</strong> ${presupuesto.estado}</p>
                <button onclick="cambiarEstado(${index}, 'Confirmado')">Confirmar</button>
                <button onclick="cambiarEstado(${index}, 'Rechazado')">Rechazar</button>
            `;
            contenedor.appendChild(presupuestoElemento);
        });
    } catch (error) {
        console.error("Error al cargar los presupuestos:", error);
        contenedor.innerHTML = "<p>Error al cargar los presupuestos.</p>";
    }
}

async function cambiarEstado(indice, nuevoEstado) {
    try {
        const respuesta = await fetch("https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec?accion=actualizarEstado", {
            method: "POST",
            body: JSON.stringify({ indice, nuevoEstado }),
            headers: { "Content-Type": "application/json" }
        });

        const resultado = await respuesta.json();
        if (resultado.success) {
            alert("Estado actualizado correctamente.");
            await cargarPresupuestosEnviados(); // Recargar la lista para reflejar los cambios
        } else {
            alert("Error al actualizar el estado.");
        }
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert("No se pudo actualizar el estado.");
    }
}
