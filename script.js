const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec"; // Tu URL

function mostrarSeccion(seccion) {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(seccion).style.display = "block";
  
  if (seccion === "presupuestos-enviados") {
    cargarPresupuestosEnviados();
  }
}

// Guardar presupuesto
document.getElementById("presupuesto-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nombreEvento: document.getElementById("nombre-evento").value,
    precio: document.getElementById("precio-evento").value,
    tipoEvento: document.getElementById("tipo-evento").value,
    cuotas: document.getElementById("cuotas-evento").value,
    fechaEvento: document.getElementById("fecha-evento").value,
  };

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        document.getElementById("mensaje-confirmacion").style.display = "block";
        document.getElementById("presupuesto-form").reset();
        setTimeout(() => {
          document.getElementById("mensaje-confirmacion").style.display = "none";
        }, 3000);
      }
    })
    .catch((error) => console.error("Error:", error));
});

// Cargar presupuestos enviados
function cargarPresupuestosEnviados() {
  fetch(URL_APPS_SCRIPT)
    .then((response) => response.json())
    .then((data) => {
      const listaPresupuestos = document.getElementById("lista-presupuestos");
      listaPresupuestos.innerHTML = ""; // Limpiar lista

      data.forEach((evento) => {
        const presupuestoDiv = document.createElement("div");
        presupuestoDiv.classList.add("evento");

        presupuestoDiv.innerHTML = `
          <strong>${evento.nombreEvento}</strong> - ${evento.tipoEvento} - $${evento.precio}
          <div class="detalles">
            <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
            <p><strong>Fecha:</strong> ${evento.fechaEvento}</p>
          </div>
        `;

        presupuestoDiv.addEventListener("click", function () {
          this.classList.toggle("active");
        });

        listaPresupuestos.appendChild(presupuestoDiv);
      });
    })
    .catch((error) => console.error("Error:", error));
}
