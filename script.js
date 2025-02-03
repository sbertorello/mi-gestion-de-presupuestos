// Código de script.js
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxiDPfrHoWsjCZEza5KiAnSrAxAz0AuvE6rldevIeK5BvXd5T0A87J4nz80ondQMBVq/exec';

function mostrarSeccion(seccion) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(seccion).style.display = 'block';

  if (seccion === 'presupuestos-enviados') {
    cargarPresupuestosEnviados();
  }
}

document.getElementById('presupuesto-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombreEvento = document.getElementById('nombre-evento').value;
  const precioEvento = document.getElementById('precio-evento').value;
  const tipoEvento = document.getElementById('tipo-evento').value;
  const cuotasEvento = document.getElementById('cuotas-evento').value;
  const fechaEvento = document.getElementById('fecha-evento').value;

  const data = {
    action: 'guardar',
    nombreEvento: nombreEvento,
    precio: precioEvento,
    tipoEvento: tipoEvento,
    cuotas: cuotasEvento,
    fechaEvento: fechaEvento
  };

  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        document.getElementById('mensaje-confirmacion').style.display = 'block';
        document.getElementById('presupuesto-form').reset();
        setTimeout(() => {
          document.getElementById('mensaje-confirmacion').style.display = 'none';
        }, 3000);
      }
    })
    .catch(error => console.error('Error:', error));
});

function cargarPresupuestosEnviados() {
  fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(data => {
      const listaPresupuestos = document.getElementById('lista-presupuestos');
      listaPresupuestos.innerHTML = '';

      data.forEach(evento => {
        if (evento.estado === 'Presupuesto Enviado') {
          const eventoDiv = document.createElement('div');
          eventoDiv.className = 'evento';
          eventoDiv.innerHTML = `
            <strong>${evento.nombreEvento}</strong>
            <div class="detalles">
              <p>Precio: $${evento.precio}</p>
              <p>Tipo: ${evento.tipoEvento}</p>
              <p>Cuotas: ${evento.cuotas}</p>
              <p>Fecha: ${evento.fechaEvento}</p>
              <button onclick="eliminarEvento('${evento.id}')">Eliminar</button>
              <button onclick="confirmarEvento('${evento.id}')">Confirmar</button>
            </div>
          `;
          listaPresupuestos.appendChild(eventoDiv);
        }
      });
    })
    .catch(error => console.error('Error:', error));
}

function eliminarEvento(id) {
  const data = {
    action: 'eliminar',
    id: id
  };

  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        cargarPresupuestosEnviados();
      }
    })
    .catch(error => console.error('Error:', error));
}

function confirmarEvento(id) {
  const data = {
    action: 'confirmar',
    id: id
  };

  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        cargarPresupuestosEnviados();
      }
    })
    .catch(error => console.error('Error:', error));
}
