document.addEventListener("DOMContentLoaded", function () {
    cargarPresupuestosEnviados();
});

function guardarPresupuesto() {
    let fecha = document.getElementById("fecha").value;
    let cliente = document.getElementById("cliente").value;
    let detalle = document.getElementById("detalle").value;
    let monto = document.getElementById("monto").value;

    if (!fecha || !cliente || !detalle || !monto) {
        alert("Completa todos los campos.");
        return;
    }

    let data = { 
        action: "guardarPresupuesto", 
        fecha, 
        cliente, 
        detalle, 
        monto 
    };

    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec", {
        method: "POST",
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
        cargarPresupuestosEnviados();
    })
    .catch(error => console.error("Error:", error));
}

function cargarPresupuestosEnviados() {
    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec?action=obtenerPresupuestosEnviados")
    .then(response => response.json())
    .then(data => {
        let contenedor = document.getElementById("listaPresupuestosEnviados");
        contenedor.innerHTML = "";

        data.forEach(presupuesto => {
            let fila = document.createElement("div");
            fila.innerHTML = `
                <p><strong>Cliente:</strong> ${presupuesto.cliente}</p>
                <p><strong>Detalle:</strong> ${presupuesto.detalle}</p>
                <p><strong>Monto:</strong> ${presupuesto.monto}</p>
                <button onclick="confirmarPresupuesto('${presupuesto.id}')">Confirmar</button>
                <button onclick="eliminarPresupuesto('${presupuesto.id}')">Eliminar</button>
                <hr>
            `;
            contenedor.appendChild(fila);
        });
    })
    .catch(error => console.error("Error:", error));
}

function confirmarPresupuesto(id) {
    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec?action=confirmarPresupuesto&id=" + id)
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
        cargarPresupuestosEnviados();
    })
    .catch(error => console.error("Error:", error));
}

function eliminarPresupuesto(id) {
    fetch("https://script.google.com/macros/s/AKfycbykxo_v58ojAkxf50X6xpV49xyzC8CEKIOr-HAFTXVW7Nb5xCh3XjqqNrr2VWOez7HgDg/exec?action=eliminarPresupuesto&id=" + id)
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
        cargarPresupuestosEnviados();
    })
    .catch(error => console.error("Error:", error));
}
