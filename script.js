const API_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // Reemplaza con la URL de AppScript

// Agregar el evento para el formulario de presupuestos
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

        // Cargar la lista de presupuestos enviados
        cargarPresupuestosEnviados();
    }).catch(error => console.error("Error:", error));
});

// Función para cargar los presupuestos enviados
function cargarPresupuestosEnviados() {
    fetch(API_URL + "?action=getPresupuestos", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
      .then(data => {
          const listaPresupuestos = document.getElementById("lista-presupuestos");
          listaPresupuestos.innerHTML = ""; // Limpiar la lista

          data.forEach(evento => {
              const div = document.createElement("div");
              div.innerHTML = `
                <strong>${evento.nombreEvento}</strong>
                <button onclick="confirmarEvento(${evento.id})">Confirmar</button>
                <button onclick="eliminarEvento(${evento.id})">Eliminar</button>
              `;
              listaPresupuestos.appendChild(div);
          });
      }).catch(error => console.error("Error al cargar los presupuestos:", error));
}

// Funciones para confirmar y eliminar eventos
function confirmarEvento(id) {
    // Aquí deberías enviar el ID del evento a la siguiente página (Pagos en Curso)
    console.log("Confirmar evento con ID:", id);
    // Implementar la lógica para mover este evento a "Pagos en Curso"
}

function eliminarEvento(id) {
    // Aquí deberías enviar el ID del evento para eliminarlo
    console.log("Eliminar evento con ID:", id);
    // Implementar la lógica para eliminar este evento
}

// Cargar la lista de presupuestos enviados cuando la página se muestre
function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll("main > section");
    secciones.forEach(s => s.style.display = "none");
    document.getElementById(seccion).style.display = "block";

    if (seccion === "presupuestos-enviados") {
        cargarPresupuestosEnviados();
    }
}
