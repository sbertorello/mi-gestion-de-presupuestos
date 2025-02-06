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
  document.getElementById("paginaPresupuestos").style.display = "block";
}

function cargarEventos() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const listaEventos = document.getElementById("listaEventos");
      listaEventos.innerHTML = "";

      data.forEach((evento, index) => {
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
              <button class="eliminar" onclick="eliminarEvento(${index})">Eliminar</button>
              <button class="confirmar" onclick="confirmarEvento(${index})">Confirmar</button>
            </div>
          </div>
        `;

        eventoDiv.querySelector("h3").addEventListener("click", function () {
          const detalles = eventoDiv.querySelector(".detalles");
          detalles.style.display =
            detalles.style.display === "none" ? "block" : "none";
        });

        listaEventos.appendChild(eventoDiv);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function eliminarEvento(index) {
  alert(`Evento ${index} eliminado`);
  cargarEventos(); // Recargar la lista de eventos
}

function confirmarEvento(index) {
  alert(`Evento ${index} confirmado`);
  cargarEventos(); // Recargar la lista de eventos
}
