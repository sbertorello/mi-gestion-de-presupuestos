const API_URL = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec"; // URL de tu Web App

// Función para cargar eventos desde Google Sheets
async function cargarEventos() {
  try {
    const respuesta = await fetch(API_URL);
    const eventos = await respuesta.json();

    const lista = document.getElementById("listaEventos");
    lista.innerHTML = ""; // Limpia la lista antes de agregar nuevos datos

    eventos.forEach(evento => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${evento.nombreEvento}</strong> - ${evento.tipoEvento} - $${evento.precio} 
        <br>Fecha: ${evento.fechaEvento} | Cuotas: ${evento.cuotas} | Estado: ${evento.estado}
        <br>
        <button onclick="confirmarEvento('${evento.id}')">Confirmar</button>
        <button onclick="eliminarEvento('${evento.id}')">Eliminar</button>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Error al cargar los eventos:", error);
  }
}

// Función para guardar un nuevo presupuesto
async function guardarEvento() {
  const id = Date.now().toString();
  const nombreEvento = document.getElementById("nombreEvento").value;
  const precio = document.getElementById("precio").value;
  const tipoEvento = document.getElementById("tipoEvento").value;
  const cuotas = document.getElementById("cuotas").value;
  const fechaEvento = document.getElementById("fechaEvento").value;

  const nuevoEvento = {
    id,
    nombreEvento,
    precio,
    tipoEvento,
    cuotas,
    fechaEvento,
    estado: "Pendiente"
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(nuevoEvento),
      headers: { "Content-Type": "application/json" }
    });

    alert("Evento guardado con éxito.");
    cargarEventos(); // Recargar la lista después de guardar
  } catch (error) {
    console.error("Error al guardar el evento:", error);
  }
}

// Función para confirmar evento (cambia el estado a "Confirmado")
async function confirmarEvento(id) {
  try {
    const respuesta = await fetch(API_URL);
    const eventos = await respuesta.json();

    const evento = eventos.find(e => e.id === id);
    if (!evento) return alert("Evento no encontrado.");

    evento.estado = "Confirmado";

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(evento),
      headers: { "Content-Type": "application/json" }
    });

    alert("Evento confirmado.");
    cargarEventos();
  } catch (error) {
    console.error("Error al confirmar evento:", error);
  }
}

// Función para eliminar evento
async function eliminarEvento(id) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ eliminar: id }),
      headers: { "Content-Type": "application/json" }
    });

    alert("Evento eliminado.");
    cargarEventos();
  } catch (error) {
    console.error("Error al eliminar evento:", error);
  }
}

// Cargar eventos al iniciar la página
document.addEventListener("DOMContentLoaded", cargarEventos);
