// Obtener presupuestos
function obtenerPresupuestos() {
  fetch(`${PI_URL}?action=getPresupuestos`)
    .then(response => response.json())
    .then(data => {
      // Aquí manejas la data para mostrar los presupuestos en la página
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

// Confirmar presupuesto
function confirmarPresupuesto(id) {
  fetch(`${PI_URL}?action=confirmarPresupuesto&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Actualizar la página o mostrar un mensaje de éxito
        console.log(data.message);
        obtenerPresupuestos(); // Refrescar la lista de presupuestos
      } else {
        console.error(data.error);
      }
    })
    .catch(error => console.error('Error:', error));
}

// Rechazar presupuesto
function rechazarPresupuesto(id) {
  fetch(`${PI_URL}?action=rechazarPresupuesto&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Actualizar la página o mostrar un mensaje de éxito
        console.log(data.message);
        obtenerPresupuestos(); // Refrescar la lista de presupuestos
      } else {
        console.error(data.error);
      }
    })
    .catch(error => console.error('Error:', error));
}
