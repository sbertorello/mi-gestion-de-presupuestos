// Código de script.js
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxiDPfrHoWsjCZEza5KiAnSrAxAz0AuvE6rldevIeK5BvXd5T0A87J4nz80ondQMBVq/exec'; // Reemplaza con la URL que copiaste

function mostrarSeccion(seccion) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(seccion).style.display = 'block';
}

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
