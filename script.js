document.addEventListener("DOMContentLoaded", function () {
  cargarPresupuestosEnviados();
});

function guardarPresupuesto(event) {
  event.preventDefault();

  let nombre = document.getElementById("nombre-evento").value;
  let precio = document.getElementById("precio-evento").value;
  let tipo = document.getElementById("tipo-evento").value;
  let cuotas = document.getElementById("cuotas-evento").value;
  let fecha = document.getElementById("fecha-evento").value;

  let url = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      action: "guardarPresupuesto",
      nombre,
      precio,
      tipo,
      cuotas,
      fecha,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("presupuesto-form").reset();
        alert("Presupuesto guardado correctamente.");
        cargarPresupuestosEnviados(); // Actualizar la lista automáticamente
      } else {
        alert("Error al guardar el presupuesto.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function cargarPresupuestosEnviados() {
  let url = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec";

  fetch(url + "?action=obtenerPresupuestosEnviados")
    .then((response) => response.json())
    .then((data) => {
      let lista = document.getElementById("lista-presupuestos");
      lista.innerHTML = "";

      data.forEach((evento) => {
        let div = document.createElement("div");
        div.classList.add("presupuesto-item");
        div.innerHTML = `
          <p><strong>${evento.nombre}</strong></p>
          <p>Precio: $${evento.precio}</p>
          <p>Tipo: ${evento.tipo}</p>
          <p>Cuotas: ${evento.cuotas}</p>
          <p>Fecha: ${evento.fecha}</p>
          <button onclick="confirmarPresupuesto('${evento.id}')">✅ Confirmar</button>
          <button onclick="eliminarPresupuesto('${evento.id}')">❌ Eliminar</button>
        `;
        lista.appendChild(div);
      });
    })
    .catch((error) => console.error("Error:", error));
}

function confirmarPresupuesto(id) {
  let url = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      action: "confirmarPresupuesto",
      id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Presupuesto confirmado.");
        cargarPresupuestosEnviados();
      } else {
        alert("Error al confirmar.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function eliminarPresupuesto(id) {
  let url = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      action: "eliminarPresupuesto",
      id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Presupuesto eliminado.");
        cargarPresupuestosEnviados();
      } else {
        alert("Error al eliminar.");
      }
    })
    .catch((error) => console.error("Error:", error));
}
