const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec"; // Reemplaza con tu URL

document.addEventListener("DOMContentLoaded", function () {
  cargarEventos();
});

function cargarEventos() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const listaEventos = document.getElementById("listaEventos");
      listaEventos.innerHTML = "";

      data.forEach((evento) => {
        if (evento.estado === "Pendiente") {
          const eventoDiv = document.createElement("div");
          eventoDiv.className = "evento";

          eventoDiv.innerHTML = `
            <h3>${evento.nombreEvento}</h3>
            <div class="detalles" style="display: none;">
              <p><strong>Precio:</strong> $${evento.precio}</p>
              <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento}</p>
              <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
              <p><strong>Fecha del Evento:</strong> ${evento.fechaEvento}</p>
              <div class="botones">
                <button class="eliminar" onclick="eliminarEvento('${evento.id}')">Eliminar</button>
                <button class="confirmar" onclick="confirmarEvento('${evento.id}')">Confirmar</button>
              </div>
            </div>
          `;

          eventoDiv.querySelector("h3").addEventListener("click", function () {
            const detalles = eventoDiv.querySelector(".detalles");
            detalles.style.display =
              detalles.style.display === "none" ? "block" : "none";
          });

          listaEventos.appendChild(eventoDiv);
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function eliminarEvento(id) {
  fetch(`${API_URL}?action=eliminar&id=${id}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert(result.message);
        cargarEventos(); // Recargar la lista de eventos
      } else {
        throw new Error(result.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al eliminar el evento");
    });
}

function confirmarEvento(id) {
  fetch(`${API_URL}?action=confirmar&id=${id}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert(result.message);
        cargarEventos(); // Recargar la lista de eventos
      } else {
        throw new Error(result.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al confirmar el evento");
    });
}
