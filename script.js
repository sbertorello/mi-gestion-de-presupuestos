document.addEventListener('DOMContentLoaded', () => {
    const formularioPresupuesto = document.getElementById('presupuesto-form');
    const listaPrecupuestos = document.getElementById('lista-presupuestos');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

    // Configuración de la URL del proyecto de Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw2PEySWpXViI5gLRrsN-Evf3kPFJlyxSDs9N8Tfxm04VbyZrSRrZvU7TGzvCQK5awk/exec';

    // Función para mostrar/ocultar secciones
    window.mostrarSeccion = function(seccionId) {
        const secciones = document.querySelectorAll('section');
        secciones.forEach(seccion => {
            seccion.style.display = seccion.id === seccionId ? 'block' : 'none';
        });

        if (seccionId === 'presupuestos-enviados') {
            cargarPresupuestos();
        }
    };

    // Guardar nuevo presupuesto
    formularioPresupuesto.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombreEvento = document.getElementById('nombre-evento').value;
        const precioEvento = document.getElementById('precio-evento').value;
        const tipoEvento = document.getElementById('tipo-evento').value;
        const cuotasEvento = document.getElementById('cuotas-evento').value;
        const fechaEvento = document.getElementById('fecha-evento').value;

        const datos = {
            nombreEvento,
            precio: precioEvento,
            tipoEvento,
            cuotas: cuotasEvento,
            fechaEvento
        };

        // Llamada al backend de Google Apps Script
        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            formularioPresupuesto.reset();
            mensajeConfirmacion.style.display = 'block';
            setTimeout(() => {
                mensajeConfirmacion.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al guardar el presupuesto');
        });
    });

    // Cargar presupuestos en la página de Presupuestos Enviados
    function cargarPresupuestos() {
        fetch(scriptURL)
        .then(response => response.json())
        .then(presupuestos => {
            listaPrecupuestos.innerHTML = ''; // Limpiar lista anterior
            
            presupuestos.forEach((presupuesto, index) => {
                const [nombreEvento, precio, tipoEvento, cuotas, fechaEvento] = presupuesto;
                
                const eventoDiv = document.createElement('div');
                eventoDiv.classList.add('evento');
                eventoDiv.innerHTML = `
                    <h3>${nombreEvento}</h3>
                    <div class="detalles">
                        <p>Precio: $${precio}</p>
                        <p>Tipo de Evento: ${tipoEvento}</p>
                        <p>Cuotas: ${cuotas}</p>
                        <p>Fecha: ${fechaEvento}</p>
                        <button onclick="confirmarEvento(${index})">Confirmar</button>
                        <button onclick="eliminarEvento(${index})">Eliminar</button>
                    </div>
                `;

                eventoDiv.addEventListener('click', function() {
                    this.classList.toggle('active');
                });

                listaPrecupuestos.appendChild(eventoDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los presupuestos');
        });
    }

    // Función global para confirmar evento
    window.confirmarEvento = function(indice) {
        fetch(`${scriptURL}?action=confirmar&index=${indice}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(() => {
            cargarPresupuestos();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo confirmar el evento');
        });
    };

    // Función global para eliminar evento
    window.eliminarEvento = function(indice) {
        fetch(`${scriptURL}?action=eliminar&index=${indice}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(() => {
            cargarPresupuestos();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo eliminar el evento');
        });
    };
});
