document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";
    const contenedorPresupuestos = document.getElementById("contenedorPresupuestos");

    // Obtener los datos de la hoja de cálculo
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contenedorPresupuestos.innerHTML = ""; // Limpiar contenedor

            data.forEach(evento => {
                const cajaEvento = document.createElement("div");
                cajaEvento.classList.add("caja-evento");
                cajaEvento.innerHTML = `
                    <h2 class="evento-nombre">${evento.nombreEvento}</h2>
                    <div class="evento-detalle oculto">
                        <p><strong>Precio:</strong> $${evento.precio}</p>
                        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento}</p>
                        <p><strong>Cuotas:</strong> ${evento.cuotas}</p>
                        <p><strong>Fecha del Evento:</strong> ${evento.fechaEvento}</p>
                        <button class="btn-confirmar">Confirmar</button>
                        <button class="btn-eliminar">Eliminar</button>
                    </div>
                `;

                // Evento para desplegar detalles
                cajaEvento.querySelector(".evento-nombre").addEventListener("click", function () {
                    const detalles = this.nextElementSibling;
                    detalles.classList.toggle("oculto");
                });

                // Evento para confirmar
                cajaEvento.querySelector(".btn-confirmar").addEventListener("click", function () {
                    fetch(API_URL, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nombreEvento: evento.nombreEvento })
                    })
                    .then(response => response.json())
                    .then(() => location.reload());
                });

                // Evento para eliminar
                cajaEvento.querySelector(".btn-eliminar").addEventListener("click", function () {
                    fetch(API_URL, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nombreEvento: evento.nombreEvento })
                    })
                    .then(response => response.json())
                    .then(() => location.reload());
                });

                contenedorPresupuestos.appendChild(cajaEvento);
            });
        })
        .catch(error => console.error("Error al obtener los presupuestos:", error));
});
