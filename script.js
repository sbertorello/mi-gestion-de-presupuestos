// Código de Google Apps Script
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Presupuestos');
  const data = JSON.parse(e.postData.contents);

  // Si la acción es "eliminar", llamamos a la función eliminarEvento
  if (data.accion === "eliminar") {
    return eliminarEvento(data.id);
  }

  // Si la acción es "confirmar", llamamos a la función confirmarEvento
  if (data.accion === "confirmar") {
    return confirmarEvento(data.id);
  }

  // Si no hay acción, es un nuevo presupuesto
  const id = new Date().getTime().toString();
  sheet.appendRow([
    id,
    data.nombreEvento,
    data.precio,
    data.tipoEvento,
    data.cuotas,
    data.fechaEvento,
    'Presupuesto Enviado'
  ]);
  return ContentService.createTextOutput(JSON.stringify({ success: true, id: id })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Presupuestos');
  const data = sheet.getDataRange().getValues();
  const eventos = data.slice(1).map(row => ({
    id: row[0],
    nombreEvento: row[1],
    precio: row[2],
    tipoEvento: row[3],
    cuotas: row[4],
    fechaEvento: row[5],
    estado: row[6]
  }));
  return ContentService.createTextOutput(JSON.stringify(eventos)).setMimeType(ContentService.MimeType.JSON);
}

// Función para eliminar un evento
function eliminarEvento(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Presupuestos');
  const data = sheet.getDataRange().getValues();
  let filaAEliminar = -1;

  // Buscar la fila que contiene el ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) { // Comparar como string o número según corresponda
      filaAEliminar = i + 1; // Las filas en Sheets empiezan en 1, no en 0
      break;
    }
  }

  // Si se encontró la fila, eliminarla
  if (filaAEliminar !== -1) {
    sheet.deleteRow(filaAEliminar);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Evento no encontrado" })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para confirmar un evento (cambiar estado a "Pagos en Curso")
function confirmarEvento(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Presupuestos');
  const data = sheet.getDataRange().getValues();
  let filaAActualizar = -1;

  // Buscar la fila que contiene el ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) { // Comparar como string o número según corresponda
      filaAActualizar = i + 1; // Las filas en Sheets empiezan en 1, no en 0
      break;
    }
  }

  // Si se encontró la fila, actualizar el estado
  if (filaAActualizar !== -1) {
    sheet.getRange(filaAActualizar, 7).setValue('Pagos en Curso'); // Columna 7 es el estado
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Evento no encontrado" })).setMimeType(ContentService.MimeType.JSON);
  }
}
