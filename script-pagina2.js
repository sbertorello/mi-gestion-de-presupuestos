document.addEventListener("DOMContentLoaded", cargarPresupuestosPendientes);

const API_URL = "https://script.google.com/macros/s/AKfycbxtF-PyqeFnv8Qy1-sKPMj30H94m6lyQL4Zi9N7GUYljBk1qpJFnyTVAkdWR-TN9lAolQ/exec";

async function cargarPresupuestosPendientes() {
  try {
    const response = await fetch(`${API_URL}?action=obtenerPendientes`);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud (HTTP ${response.status})`);
    }

    const data = await response.json();
    
    if (!data || !data.presupuestos) {
      throw new Error(data.error || "No se recibieron datos válidos desde el servidor");
    }

    const lista = document.getElementById("lista-presupuestos");
    lista.innerHTML = "";

    if (data.presupuestos.length === 0) {
      lista.innerHTML = "<p>No hay presupuestos pendientes.</p>";
      return;
    }

    data.presupuestos.forEach(presupuesto => {
      const contenedor = document.createElement("div");
      contenedor.classList.add("presupuesto-item");

      const titulo = document.createElement("h3");
      titulo.textContent = presupuesto.nombre;
      titulo.onclick = () => {
        detalles.style.display = detalles.style.display === "none" ? "block" : "none";
      };

      const detalles = document.createElement("div");
      detalles.classList.add("detalles");
      detalles.style.display = "none";
      detalles.innerHTML = `
        <p><strong>Tipo:</strong> ${presupuesto.tipo}</p>
        <p><strong>Precio:</strong> $${presupuesto.precio}</p>
        <p><strong>Cuotas:</strong> ${presupuesto.cuotas}</p>
        <p><strong>Fecha:</strong> ${presupuesto.fecha}</p>
      `;

      const botonConfirmar = document.createElement("button");
      botonConfirmar.textContent = "✅ Confirmar";
      botonConfirmar.onclick = () => actualizarPresupuesto(presupuesto.id, "confirmarPresupuesto");

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "❌ Eliminar";
      botonEliminar.onclick = () => actualizarPresupuesto(presupuesto.id, "eliminarPresupuesto");

      detalles.appendChild(botonConfirmar);
      detalles.appendChild(botonEliminar);
      contenedor.appendChild(titulo);
      contenedor.appendChild(detalles);
      lista.appendChild(contenedor);
    });
  } catch (error) {
    console.error("Error al cargar los presupuestos:", error);
    document.getElementById("lista-presupuestos").innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

async function actualizarPresupuesto(id, accion) {
  try {
    const response = await fetch(`${API_URL}?action=${accion}&id=${id}`);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud (HTTP ${response.status})`);
    }

    const data = await response.json();
    
    if (data.success) {
      alert(`Presupuesto ${accion === "confirmarPresupuesto" ? "confirmado" : "eliminado"} correctamente`);
      location.reload();
    } else {
      throw new Error(data.error || "Hubo un problema, intenta nuevamente.");
    }
  } catch (error) {
    console.error(`Error al ${accion}:`, error);
    alert(error.message);
  }
}
