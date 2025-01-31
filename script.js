const url = 'https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec';

// Mostrar secciones según la navegación
function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll('main section');
  secciones.forEach((seccion) => {
    seccion.style.display = 'none';
  });
  
  // Mostrar la sección seleccionada
  const seccionSeleccionada = document.getElementById(seccion);
  if (seccionSeleccionada) {
    seccionSeleccionada.style.display = 'block';
  }
}

// Enviar datos del formulario a la hoja de cálculo
document.getElementById('presupuesto-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombreEvento = document.getElementById('nombre-evento').value;
  const precioEvento = document.getElementById('precio-evento').value;
  const tipoEvento = document.getElementById('tipo-evento').value;
  const cuotasEvento = document.getElementById('cuotas-evento').value;
  const fechaEvento = document.getElementById('fecha-evento').value;

  const data = {
    nombre: nombreEvento,
    precio: precioEvento,
    tipo: tipoEvento,
    cuotas: cuotasEvento,
    fecha: fechaEvento
  };

  // Llamar a Google Apps Script para guardar los datos en la hoja de cálculo
  fetch(url + '?action=guardar_presupuesto', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('mensaje-confirmacion').style.display = 'block';
      document.getElementById('presupuesto-form').reset();
    }
  })
  .catch(error => console.error('Error:', error));
});
