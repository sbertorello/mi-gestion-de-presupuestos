// script.js

// Función para mostrar u ocultar secciones
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('main section').forEach(seccion => {
        seccion.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    const seccion = document.getElementById(seccionId);
    if (seccion) {
        seccion.style.display = 'block';
    }
}

// Mostrar la sección de "Presupuestos" por defecto al cargar la página
mostrarSeccion('presupuestos');

// Lógica para enviar datos del formulario a Google Sheets
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('presupuesto-form');

    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

            // Obtener los valores del formulario
            const nombreEvento = document.getElementById('nombre-evento').value;
            const precioEvento = document.getElementById('precio-evento').value;
            const tipoEvento = document.getElementById('tipo-evento').value;
            const cuotasEvento = document.getElementById('cuotas-evento').value;
            const fechaEvento = document.getElementById('fecha-evento').value;

            // Crear un objeto con los datos
            const data = {
                nombreEvento: nombreEvento,
                precioEvento: precioEvento,
                tipoEvento: tipoEvento,
                cuotasEvento: cuotasEvento,
                fechaEvento: fechaEvento
            };

            // Enviar los datos a Google Sheets
            guardarEnGoogleSheets(data);
        });
    } else {
        console.error('El formulario con ID "presupuesto-form" no fue encontrado.');
    }
});

function guardarEnGoogleSheets(data) {
    const url = 'https://script.google.com/macros/s/AKfycbw6Fgd2nifAe3E5Ao36HhH6M1ifFS6k9I3NK_94HhG1oYj895YwF4EIGQk2CrjGLAIU/exec'; // URL de tu Apps Script

    // Enviar los datos usando fetch
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(result => {
        console.log(result); // Mostrar el resultado en la consola
        alert('Datos guardados correctamente'); // Mostrar un mensaje de éxito
        document.getElementById('presupuesto-form').reset(); // Limpiar el formulario

        // Mostrar el mensaje de confirmación
        const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
        if (mensajeConfirmacion) {
            mensajeConfirmacion.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error); // Mostrar el error en la consola
        alert('Hubo un error al guardar los datos'); // Mostrar un mensaje de error
    });
}
