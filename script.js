const API_URL = "https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec"; // Reemplaza con la URL de AppScript

document.getElementById("presupuesto-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el recargo de la página

    // Capturar los valores del formulario
    let nombreEvento = document.getElementById("nombre-evento").value;
    let precio = document.getElementById("precio-evento").value;
    let tipoEvento = document.getElementById("tipo-evento").value;
    let cuotas = document.getElementById("cuotas-evento").value;
    let fechaEvento = document.getElementById("fecha-evento").value;

    // Crear el objeto de datos
    let presupuesto = {
        nombreEvento: nombreEvento,
        precio: precio,
        tipoEvento: tipoEvento,
        cuotas: cuotas,
        fechaEvento: fechaEvento
    };

    // Enviar los datos a AppScript
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",  // Evita errores CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(presupuesto)
    }).then(() => {
        // Mostrar mensaje de confirmación
        document.getElementById("mensaje-confirmacion").style.display = "block";
        
        // Limpiar el formulario
        document.getElementById("presupuesto-form").reset();

        // Ocultar el mensaje después de 2 segundos
        setTimeout(() => {
            document.getElementById("mensaje-confirmacion").style.display = "none";
        }, 2000);
    }).catch(error => console.error("Error:", error));
});
