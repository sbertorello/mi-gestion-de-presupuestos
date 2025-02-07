const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec"; // Reemplaza con tu URL

document.addEventListener("DOMContentLoaded", () => {
  cargarEventos();
});

function cargarEventos() {
  fetch(`${API_URL}?action=obtener`)
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
                <button onclick="eliminarEvento('${evento.id}')">Eliminar</button>
                <button onclick="confirmarEvento('${evento.id}')">Confirmar</button>
              </div>
            </div>
          `;

          eventoDiv.querySelector("h3").addEventListener("click", () => {
            const detalles = eventoDiv.querySelector(".detalles");
            detalles.style.display = detalles.style.display === "none" ? "block" : "none";
          });

          listaEventos.appendChild(eventoDiv);
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar eventos:", error);
      alert("Hubo un problema al obtener los eventos.");
    });
}

function eliminarEvento(id) {
  if (!confirm("¿Estás seguro de eliminar este evento?")) return;

  fetch(`${API_URL}?action=eliminar&id=${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      if (result.success) cargarEventos();
    })
    .catch(error => {
      console.error("Error al eliminar evento:", error);
      alert("No se pudo eliminar el evento.");
    });
}

function confirmarEvento(id) {
  if (!confirm("¿Confirmar este evento como 'En Curso'?")) return;

  fetch(`${API_URL}?action=confirmar&id=${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      if (result.success) cargarEventos();
    })
    .catch(error => {
      console.error("Error al confirmar evento:", error);
      alert("No se pudo confirmar el evento.");
    });
}
