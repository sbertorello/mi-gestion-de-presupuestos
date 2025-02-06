const API_URL = "https://script.google.com/macros/s/AKfycbxK9AeNgjZml5szfRhpQ1jC-OCZx6WqQ7dZKbCzN7FejnlQRsYit4rMyd5T9c-WeRjT/exec";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("formPresupuesto")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nombreEvento = document.getElementById("nombreEvento").value;
      const precio = document.getElementById("precio").value;
      const tipoEvento = document.getElementById("tipoEvento").value;
      const cuotas = document.getElementById("cuotas").value;
      const fechaEvento = document.getElementById("fechaEvento").value;

      const data = {
        nombreEvento,
        precio,
        tipoEvento,
        cuotas,
        fechaEvento,
      };

      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((response) => response.text())
        .then((result) => {
          alert("Datos guardados correctamente");
          document.getElementById("formPresupuesto").reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un error al guardar los datos");
        });
    });
});

function mostrarPresupuestosEnviados() {
  document.getElementById("paginaPresupuestos").style.display = "none";
  document.getElementById("paginaPresupuestosEnviados").style.display = "block";
  cargarEventos();
}

function mostrarPaginaPresupuestos() {
  document.getElementById("paginaPresupuestosEnviados").style.display = "none";
  document.getElementById("paginaPagosEnCurso").style.display = "none";
  document.getElementById("paginaPagosCompletados").style.display = "none";
  document.getElementById("paginaPresupuestos").style.display = "block";
}

function cargarEventos() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const listaEventos = document.getElementById("listaEventos");
      listaEventos.innerHTML = "";

      data.forEach((evento, index) => {
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
    .then((response) => response.text())
    .then((result) => {
      alert("Evento eliminado correctamente");
      cargarEventos();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al eliminar el evento");
    });
}

function confirmarEvento(id) {
  fetch(`${API_URL}?action=confirmar&id=${id}`)
    .then((response) => response.text())
    .then((result) => {
      alert("Evento confirmado correctamente");
      cargarEventos();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al confirmar el evento");
    });
}
