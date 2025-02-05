const API_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // Reemplaza con la URL de AppScript

// Función para mostrar la sección correspondiente
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll("section").forEach(function(section) {
        section.style.display = "none";
    });

    // Mostrar la sección seleccionada
    document.getElementById(seccion).style.display = "block";

    // Si estamos en la página "Presupuestos Enviados", cargar los eventos
    if (seccion === 'presupuestos-enviados') {
        cargarPresupuestosEnviados();
    }
}

// Función para cargar los presupuestos desde la hoja de Google Sheets
function cargarPresupuestosEnviados() {
    // Hacer una solicitud GET al servidor para obtener los datos
    fetch(API_URL + "?action=getPresupuestos")
        .then(response => response.json())
        .then(data => {
            // Limpiar la lista antes de cargar los nuevos presupuestos
            const listaPresupuestos = document.getElementById("lista-presupuestos");
            listaPresupuestos.innerHTML = "";

            // Recorrer los datos y mostrar cada presupuesto
            data.forEach(presupuesto => {
                const divEvento = document.createElement("div");
                divEvento.classList.add("evento");

                // Mostrar los detalles del evento
                divEvento.innerHTML = `
                    <h3>${presupuesto.nombreEvento}</h3>
                    <p>Precio: $${presupuesto.precio}</p>
                    <p>Tipo de Evento: ${presupuesto.tipoEvento}</p>
                    <p>Cuotas: ${presupuesto.cuotas}</p>
                    <p>Fecha: ${presupuesto.fechaEvento}</p>
                    <button onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
                    <button onclick="confirmarPresupuesto(${presupuesto.id})">Confirmar</button>
                `;
                
                // Agregar el evento a la lista
                listaPresupuestos.appendChild(divEvento);
            });
        })
        .catch(error => console.error("Error al cargar presupuestos:", error));
}

// Función para eliminar un presupuesto
function eliminarPresupuesto(id) {
    fetch(API_URL + "?action=eliminarPresupuesto&id=" + id, { method: 'GET' })
        .then(response => response.text())
        .then(() => {
            cargarPresupuestosEnviados(); // Recargar la lista de presupuestos
        })
        .catch(error => console.error("Error al eliminar el presupuesto:", error));
}

// Función para confirmar un presupuesto
function confirmarPresupuesto(id) {
    fetch(API_URL + "?action=confirmarPresupuesto&id=" + id, { method: 'GET' })
        .then(response => response.text())
        .then(() => {
            cargarPresupuestosEnviados(); // Recargar la lista de presupuestos
        })
        .catch(error => console.error("Error al confirmar el presupuesto:", error));
}

// Código de la página "Presupuestos" (no cambia)
document.getElementById("presupuesto-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el recargo de la página

    // Capturar los valores del formulario
    let nombreEvento = document.getElementById("nombre-evento").value;
    let precio = document.getElementById("precio-evento").value;
    let tipoEvento = document.getElementById("tipo-evento").value;
    let cuotas = document.getElementById("cuotas-evento").value;
    let fechaEvento = document.getElementById("fecha-evento").value;

    // Crear el objeto de datos
    let presupuesto = {
        nombreEvento: nombreEvento,
        precio: precio,
        tipoEvento: tipoEvento,
        cuotas: cuotas,
        fechaEvento: fechaEvento
    };

    // Enviar los datos a AppScript
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",  // Evita errores CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(presupuesto)
    }).then(() => {
        // Mostrar mensaje de confirmación
        document.getElementById("mensaje-confirmacion").style.display = "block";
        
        // Limpiar el formulario
        document.getElementById("presupuesto-form").reset();

        // Ocultar el mensaje después de 2 segundos
        setTimeout(() => {
            document.getElementById("mensaje-confirmacion").style.display = "none";
        }, 2000);
    }).catch(error => console.error("Error:", error));
});
