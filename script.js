const API_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // URL de tu AppScript
const SHEET_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // URL para obtener datos

// Función para mostrar la página correspondiente
function mostrarSeccion(seccion) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(seccion).style.display = "block";
}

// Cargar los presupuestos desde Google Sheets y mostrar en la página "Presupuestos Enviados"
function cargarPresupuestos() {
    fetch(SHEET_URL, {
        method: "GET",
    }).then(response => response.json())
    .then(data => {
        const listaPresupuestos = document.getElementById("lista-presupuestos");
        listaPresupuestos.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

        // Crear los casilleros para cada presupuesto
        data.forEach(presupuesto => {
            const divEvento = document.createElement("div");
            divEvento.classList.add("evento");

            divEvento.innerHTML = `
                <h3>${presupuesto.nombreEvento}</h3>
                <p>Precio: $${presupuesto.precio}</p>
                <p>Tipo de Evento: ${presupuesto.tipoEvento}</p>
                <p>Cuotas: ${presupuesto.cuotas}</p>
                <p>Fecha: ${presupuesto.fechaEvento}</p>
                <button onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
                <button onclick="confirmarPresupuesto(${presupuesto.id})">Confirmar</button>
            `;
            
            listaPresupuestos.appendChild(divEvento);
        });
    }).catch(error => console.error("Error al cargar los presupuestos:", error));
}

// Función para eliminar un presupuesto
function eliminarPresupuesto(id) {
    fetch(`${API_URL}?action=eliminar&id=${id}`, {
        method: "GET",
    }).then(() => {
        cargarPresupuestos(); // Recargar la lista después de eliminar
    }).catch(error => console.error("Error al eliminar el presupuesto:", error));
}

// Función para confirmar un presupuesto (moverlo a "Pagos en Curso")
function confirmarPresupuesto(id) {
    fetch(`${API_URL}?action=confirmar&id=${id}`, {
        method: "GET",
    }).then(() => {
        cargarPresupuestos(); // Recargar la lista después de confirmar
    }).catch(error => console.error("Error al confirmar el presupuesto:", error));
}

// Llamar a la función para cargar los presupuestos cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarSeccion('presupuestos-enviados'); // Asegurarse de que estemos en la sección correcta
    cargarPresupuestos(); // Cargar los presupuestos al inicio
});
