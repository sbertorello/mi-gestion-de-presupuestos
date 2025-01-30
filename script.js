const API_URL = "https://script.google.com/macros/s/AKfycbyW1LuNTofuyQ4OL6tcTRKR09j9OBxQbBBevpQ7bVzRfDXcv1EPGmSbiqOA0FMAT6Hr/exec";

// Espera a que el contenido de la página esté completamente cargado
window.addEventListener("load", () => {
    // Agregar presupuesto
    document.getElementById("presupuesto-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            Nombre: document.getElementById("nombre").value,
            Precio: parseFloat(document.getElementById("precio").value),
            Tipo: document.getElementById("tipo").value,
            Cuotas: parseInt(document.getElementById("cuotas").value),
            Fecha: document.getElementById("fecha").value
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ operation: "addPresupuesto", data: data })
            });

            const result = await response.json();
            if (result.success) {
                alert("Presupuesto agregado correctamente.");
                document.getElementById("presupuesto-form").reset();
                cargarPresupuestos();
            } else {
                alert("Error al agregar presupuesto.");
            }
        } catch (error) {
            console.error("Error en fetch:", error);
        }
    });

    // Cargar presupuestos
    async function cargarPresupuestos() {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ operation: "getPresupuestos" })
            });

            const result = await response.json();
            if (result.success) {
                const lista = document.getElementById("lista-presupuestos");
                lista.innerHTML = "";
                result.data.forEach((presupuesto, index) => {
                    const item = document.createElement("li");
                    item.textContent = `${presupuesto.Nombre} - $${presupuesto.Precio}`;
                    
                    // Botón de eliminar
                    const btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.onclick = () => eliminarPresupuesto(index);
                    item.appendChild(btnEliminar);

                    lista.appendChild(item);
                });
            }
        } catch (error) {
            console.error("Error en fetch:", error);
        }
    }

    // Eliminar presupuesto
    async function eliminarPresupuesto(index) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ operation: "eliminarPresupuesto", data: { index } })
            });

            const result = await response.json();
            if (result.success) {
                alert("Presupuesto eliminado.");
                cargarPresupuestos();
            } else {
                alert("Error al eliminar.");
            }
        } catch (error) {
            console.error("Error en fetch:", error);
        }
    }

    // Cargar presupuestos al inicio
    cargarPresupuestos();
});
