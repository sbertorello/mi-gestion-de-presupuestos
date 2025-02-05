const API_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // Reemplaza con la URL de AppScript

// Función para mostrar la sección seleccionada
function mostrarSeccion(seccion) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(seccion).style.display = 'block';

    // Si la sección es "presupuestos-enviados", cargar los presupuestos
    if (seccion === 'presupuestos-enviados') {
        cargarPresupuestos();
    }
}

// Función para guardar el presupuesto
function guardarPresupuesto(event) {
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
}

// Asignar la función guardarPresupuesto al formulario
document.getElementById("presupuesto-form").addEventListener("submit", guardarPresupuesto);

// Función para cargar los presupuestos desde Google Sheets
function cargarPresupuestos() {
    fetch(API_URL + "?action=getPresupuestos", {
        method: "GET",
        mode: "no-cors"
    })
    .then(response => response.json())
    .then(data => {
        let listaPresupuestos = document.getElementById("lista-presupuestos");
        listaPresupuestos.innerHTML = ""; // Limpiar la lista antes de agregar los nuevos elementos

        data.forEach(presupuesto => {
            let div = document.createElement("div");
            div.className = "presupuesto-item";
            div.innerHTML = `
                <h3>${presupuesto.nombreEvento}</h3>
                <p>Precio: $${presupuesto.precio}</p>
                <p>Tipo de Evento: ${presupuesto.tipoEvento}</p>
                <p>Cuotas: ${presupuesto.cuotas}</p>
                <p>Fecha del Evento: ${presupuesto.fechaEvento}</p>
                <button onclick="eliminarPresupuesto(${presupuesto.ID})">Eliminar</button>
                <button onclick="confirmarPresupuesto(${presupuesto.ID})">Confirmar</button>
            `;
            listaPresupuestos.appendChild(div);
        });
    })
    .catch(error => console.error("Error al cargar presupuestos:", error));
}

// Función para eliminar un presupuesto
function eliminarPresupuesto(id) {
    fetch(API_URL + "?action=eliminarPresupuesto&id=" + id, {
        method: "GET",
        mode: "no-cors"
    })
    .then(() => {
        cargarPresupuestos(); // Recargar la lista después de eliminar
    })
    .catch(error => console.error("Error:", error));
}

// Función para confirmar un presupuesto
function confirmarPresupuesto(id) {
    fetch(API_URL + "?action=confirmarPresupuesto&id=" + id, {
        method: "GET",
        mode: "no-cors"
    })
    .then(() => {
        cargarPresupuestos(); // Recargar la lista después de confirmar
    })
    .catch(error => console.error("Error:", error));
}
