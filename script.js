document.getElementById("presupuesto-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  let datos = {
    nombre: document.getElementById("nombre-evento").value,
    precio: document.getElementById("precio-evento").value,
    tipo: document.getElementById("tipo-evento").value,
    cuotas: document.getElementById("cuotas-evento").value,
    fecha: document.getElementById("fecha-evento").value
  };

  let url = "https://script.google.com/macros/s/AKfycbysKn3fzo5IQ9Nnf5AeTI41dOyA2Sj-Az9_ARMUHKMzcnRHE4T0gcmh5ehZg-vB-0W8gw/exec";
  
  let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: { "Content-Type": "application/json" }
  });

  let mensaje = await response.text();
  document.getElementById("mensaje-confirmacion").innerText = mensaje;
  document.getElementById("mensaje-confirmacion").style.display = "block";

  setTimeout(() => {
    document.getElementById("mensaje-confirmacion").style.display = "none";
    document.getElementById("presupuesto-form").reset();
  }, 2000);
});
