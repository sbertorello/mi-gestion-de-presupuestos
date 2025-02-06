const API_URL = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec";

// 🚀 Función para cargar los presupuestos desde Google Sheets
async function cargarPresupuestos() {
    try {
        const respuesta = await fetch(`${API_URL}?action=read`);
        const presupuestos = await respuesta.json();

        const lista = document.getElementById("listaPresupuestos");
        lista.innerHTML = ""; // Limpia la lista antes de agregar nuevos datos

        presupuestos.forEach(p => {
            const item = document.createElement("div");
            item.className = "presupuesto-item";
            item.innerHTML = `
                <p><strong>${p.nombreEvento}</strong> - ${p.tipoEvento} - $${p.precio}</p>
                <p>Fecha: ${p.fechaEvento} | Cuotas: ${p.cuotas} | Estado: <strong>${p.estado}</strong></p>
                <button onclick="confirmarPresupuesto('${p.id}')">Confirmar</button>
                <button onclick="eliminarPresupuesto('${p.id}')">Eliminar</button>
            `;
            lista.appendChild(item);
        });
    } catch (error) {
        console.error("Error al cargar los presupuestos:", error);
    }
}

// 📝 Función para guardar un nuevo presupuesto en Google Sheets
async function guardarPresupuesto() {
    const id = Date.now().toString();
    const nombreEvento = document.getElementById("nombreEvento").value;
    const precio = document.getElementById("precio").value;
    const tipoEvento = document.getElementById("tipoEvento").value;
    const cuotas = document.getElementById("cuotas").value;
    const fechaEvento = document.getElementById("fechaEvento").value;

    const nuevoPresupuesto = { id, nombreEvento, precio, tipoEvento, cuotas, fechaEvento, estado: "Pendiente" };

    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "create", presupuesto: nuevoPresupuesto }),
            headers: { "Content-Type": "application/json" }
        });

        alert("Presupuesto guardado con éxito.");
        cargarPresupuestos(); // Recargar la lista después de guardar
    } catch (error) {
        console.error("Error al guardar el presupuesto:", error);
    }
}

// ✅ Función para confirmar un presupuesto (cambia estado a "Confirmado")
async function confirmarPresupuesto(id) {
    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "update", id, estado: "Confirmado" }),
            headers: { "Content-Type": "application/json" }
        });

        alert("Presupuesto confirmado.");
        cargarPresupuestos();
    } catch (error) {
        console.error("Error al confirmar presupuesto:", error);
    }
}

// ❌ Función para eliminar un presupuesto
async function eliminarPresupuesto(id) {
    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "delete", id }),
            headers: { "Content-Type": "application/json" }
        });

        alert("Presupuesto eliminado.");
        cargarPresupuestos();
    } catch (error) {
        console.error("Error al eliminar presupuesto:", error);
    }
}

// 📌 Evento para capturar el botón de guardar
document.getElementById("guardarPresupuesto").addEventListener("click", guardarPresupuesto);

// 📌 Cargar presupuestos al iniciar la página
document.addEventListener("DOMContentLoaded", cargarPresupuestos);
