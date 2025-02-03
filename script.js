document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("presupuesto-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let datos = {
      nombre: document.getElementById("nombre-evento").value,
      precio: document.getElementById("precio-evento").value,
      tipo: document.getElementById("tipo-evento").value,
      cuotas: document.getElementById("cuotas-evento").value,
      fecha: document.getElementById("fecha-evento").value
    };

    let url = "https://script.google.com/macros/s/AKfycbw9GpfSFGtd0AAhnhfaczhvq_TBa25-Cjjl5QUshgf6cEnh_ussv_i9_JJr7xYDnhYO/exec";

    try {
      let response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      let mensaje = await response.text();
      document.getElementById("mensaje-confirmacion").innerText = mensaje;
      document.getElementById("mensaje-confirmacion").style.display = "block";

      setTimeout(() => {
        document.getElementById("mensaje-confirmacion").style.display = "none";
        document.getElementById("presupuesto-form").reset();
      }, 2000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos. Revisa la consola.");
    }
  });
});
