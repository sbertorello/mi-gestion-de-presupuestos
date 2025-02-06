document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestos();
});

function guardarPresupuesto(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre-evento").value;
    let precio = document.getElementById("precio-evento").value;
    let tipo = document.getElementById("tipo-evento").value;
    let cuotas = document.getElementById("cuotas-evento").value;
    let fecha = document.getElementById("fecha-evento").value;

    if (!nombre || !precio || !tipo || !cuotas || !fecha) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let presupuesto = {
        nombre: nombre,
        precio: precio,
        tipo: tipo,
        cuotas: cuotas,
        fecha: fecha
    };

    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presupuesto)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("presupuesto-form").reset();
            alert("Presupuesto guardado correctamente.");
            cargarPresupuestos();
        } else {
            alert("Error al guardar el presupuesto.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al conectar con el servidor.");
    });
}

function cargarPresupuestos() {
    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec")
    .then(response => response.json())
    .then(data => {
        let lista = document.getElementById("lista-presupuestos");
        lista.innerHTML = "";

        data.forEach((presupuesto, index) => {
            let div = document.createElement("div");
            div.classList.add("presupuesto-item");
            div.innerHTML = `
                <p><strong>Evento:</strong> ${presupuesto.nombre}</p>
                <p><strong>Precio:</strong> $${presupuesto.precio}</p>
                <p><strong>Tipo:</strong> ${presupuesto.tipo}</p>
                <p><strong>Cuotas:</strong> ${presupuesto.cuotas}</p>
                <p><strong>Fecha:</strong> ${presupuesto.fecha}</p>
                <button onclick="eliminarPresupuesto(${index})">Eliminar</button>
            `;
            lista.appendChild(div);
        });
    })
    .catch(error => {
        console.error("Error:", error);
        alert("No se pudo cargar la lista de presupuestos.");
    });
}

function eliminarPresupuesto(index) {
    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec?index=" + index, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Presupuesto eliminado correctamente.");
            cargarPresupuestos();
        } else {
            alert("Error al eliminar el presupuesto.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("No se pudo eliminar el presupuesto.");
    });
}
