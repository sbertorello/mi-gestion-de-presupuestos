const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec"; // Reemplaza con tu URL

document.addEventListener("DOMContentLoaded", function () {
  cargarEventos();
});

function cargarEventos() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const listaEventos = document.getElementById("listaEventos");
      listaEventos.innerHTML = "";

      data.forEach(evento => {
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
                <button class="eliminar" data-id="${evento.id}">Eliminar</button>
                <button class="confirmar" data-id="${evento.id}">Confirmar</button>
              </div>
            </div>
          `;

          eventoDiv.querySelector("h3").addEventListener("click", function () {
            const detalles = eventoDiv.querySelector(".detalles");
            detalles.style.display = detalles.style.display === "none" ? "block" : "none";
          });

          listaEventos.appendChild(eventoDiv);
        }
      });

      document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", function () {
          eliminarEvento(this.dataset.id);
        });
      });

      document.querySelectorAll(".confirmar").forEach(btn => {
        btn.addEventListener("click", function () {
          confirmarEvento(this.dataset.id);
        });
      });
    })
    .catch(error => {
      console.error("Error al cargar eventos:", error);
    });
}

function eliminarEvento(id) {
  if (!id) {
    alert("Error: ID de evento no válido");
    return;
  }

  fetch(`${API_URL}?action=eliminar&id=${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert(result.message);
        cargarEventos();
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      console.error("Error al eliminar evento:", error);
      alert("Error al eliminar el evento");
    });
}

function confirmarEvento(id) {
  if (!id) {
    alert("Error: ID de evento no válido");
    return;
  }

  fetch(`${API_URL}?action=confirmar&id=${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert(result.message);
        cargarEventos();
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      console.error("Error al confirmar evento:", error);
      alert("Error al confirmar el evento");
    });
}
