// URL de tu Google Apps Script
const PI_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

// Función para obtener y mostrar los presupuestos
function obtenerPresupuestos() {
  fetch(`${PI_URL}?action=getPresupuestos`)
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById('presupuestos-contenedor');
      contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos elementos

      if (data.length === 0) {
        contenedor.innerHTML = '<p>No hay presupuestos pendientes.</p>';
        return;
      }

      data.forEach(presupuesto => {
        const presupuestoDiv = document.createElement('div');
        presupuestoDiv.className = 'presupuesto-item';
        presupuestoDiv.innerHTML = `
          <div class="presupuesto-header" onclick="toggleDetalles('${presupuesto.ID}')">
            ${presupuesto['Nombre del Evento']}
          </div>
          <div class="presupuesto-detalles" id="detalles-${presupuesto.ID}">
            <p><strong>Precio:</strong> ${presupuesto.Precio}</p>
            <p><strong>Tipo de Evento:</strong> ${presupuesto['Tipo de Evento']}</p>
            <p><strong>Cuotas:</strong> ${presupuesto.Cuotas}</p>
            <p><strong>Fecha del Evento:</strong> ${presupuesto['Fecha del Evento']}</p>
            <p><strong>Estado:</strong> ${presupuesto.Estado}</p>
            <button onclick="confirmarPresupuesto('${presupuesto.ID}')" class="btn-confirmar">Confirmar</button>
            <button onclick="rechazarPresupuesto('${presupuesto.ID}')" class="btn-rechazar">Rechazar</button>
          </div>
        `;
        contenedor.appendChild(presupuestoDiv);
      });
    })
    .catch(error => console.error('Error:', error));
}

// Función para confirmar un presupuesto
function confirmarPresupuesto(id) {
  fetch(`${PI_URL}?action=confirmarPresupuesto&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        obtenerPresupuestos(); // Refrescar la lista de presupuestos
      } else {
        alert(data.error);
      }
    })
    .catch(error => console.error('Error:', error));
}

// Función para rechazar un presupuesto
function rechazarPresupuesto(id) {
  fetch(`${PI_URL}?action=rechazarPresupuesto&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        obtenerPresupuestos(); // Refrescar la lista de presupuestos
      } else {
        alert(data.error);
      }
    })
    .catch(error => console.error('Error:', error));
}

// Función para expandir/contraer los detalles de un presupuesto
function toggleDetalles(id) {
  const detalles = document.getElementById(`detalles-${id}`);
  if (detalles.style.display === 'none' || detalles.style.display === '') {
    detalles.style.display = 'block';
  } else {
    detalles.style.display = 'none';
  }
}

// Cargar los presupuestos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerPresupuestos);
