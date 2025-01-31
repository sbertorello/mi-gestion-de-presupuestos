// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
    const formulario = document.getElementById('presupuestoForm');

    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

            // Obtener los valores del formulario
            const nombreEvento = document.getElementById('nombreEvento').value;
            const precio = document.getElementById('precio').value;
            const tipoEvento = document.getElementById('tipoEvento').value;
            const cuotas = document.getElementById('cuotas').value;
            const fechaEvento = document.getElementById('fechaEvento').value;

            // Crear un objeto con los datos
            const data = {
                nombreEvento: nombreEvento,
                precio: precio,
                tipoEvento: tipoEvento,
                cuotas: cuotas,
                fechaEvento: fechaEvento
            };

            // Enviar los datos a Google Sheets
            guardarEnGoogleSheets(data);
        });
    } else {
        console.error('El formulario con ID "presupuestoForm" no fue encontrado.');
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
        document.getElementById('presupuestoForm').reset(); // Limpiar el formulario
    })
    .catch(error => {
        console.error('Error:', error); // Mostrar el error en la consola
        alert('Hubo un error al guardar los datos'); // Mostrar un mensaje de error
    });
}
