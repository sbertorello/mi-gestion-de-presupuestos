const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxiDPfrHoWsjCZEza5KiAnSrAxAz0AuvE6rldevIeK5BvXd5T0A87J4nz80ondQMBVq/exec'; // Reemplaza con tu URL

function mostrarSeccion(seccion) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(seccion).style.display = 'block';

  // Si la sección es "Presupuestos Enviados", cargar los eventos
  if (seccion === 'presupuestos-enviados') {
    cargarPresupuestosEnviados();
  }
}

// Función para guardar un presupuesto
document.getElementById('presupuesto-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombreEvento = document.getElementById('nombre-evento').value;
  const precioEvento = document.getElementById('precio-evento').value;
  const tipoEvento = document.getElementById('tipo-evento').value;
  const cuotasEvento = document.getElementById('cuotas-evento').value;
  const fechaEvento = document.getElementById('fecha-evento').value;

  const data = {
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

// Función para cargar los presupuestos enviados
function cargarPresupuestosEnviados() {
  fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(data => {
      const listaPresupuestos = document.getElementById('lista-presupuestos');
      listaPresupuestos.innerHTML = ''; // Limpiar la lista antes de cargar

      data.forEach(evento => {
        if (evento.estado === 'Presupuesto Enviado') {
          const eventoHTML = `
            <div class="evento" data-id="${evento.id}">
              <strong>${evento.nombreEvento}</strong>
              <div class="detalles">
                <p>Precio: $${evento.precio}</p>
                <p>Tipo: ${evento.tipoEvento}</p>
                <p>Cuotas: ${evento.cuotas}</p>
                <p>Fecha: ${evento.fechaEvento}</p>
                <button onclick="eliminarEvento('${evento.id}')">Eliminar</button>
                <button onclick="confirmarEvento('${evento.id}')">Confirmar</button>
              </div>
            </div>
          `;
          listaPresupuestos.innerHTML += eventoHTML;
        }
      });

      // Agregar evento para mostrar/ocultar detalles
      document.querySelectorAll('.evento').forEach(evento => {
        evento.addEventListener('click', () => {
          evento.classList.toggle('active');
        });
      });
    })
    .catch(error => console.error('Error:', error));
}

// Función para eliminar un evento
function eliminarEvento(id) {
  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify({ accion: 'eliminar', id: id })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        cargarPresupuestosEnviados(); // Recargar la lista
      }
    })
    .catch(error => console.error('Error:', error));
}

// Función para confirmar un evento
function confirmarEvento(id) {
  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify({ accion: 'confirmar', id: id })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        cargarPresupuestosEnviados(); // Recargar la lista
      }
    })
    .catch(error => console.error('Error:', error));
}
