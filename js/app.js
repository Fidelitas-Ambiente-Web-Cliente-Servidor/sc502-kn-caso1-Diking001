// ======================================================
// ARRAY DEL MENÚ (dato obligatorio del enunciado)
// ======================================================
const menu = [
  { nombre: 'Bruschetta Clásica', descripcion: 'Pan tostado con tomate y albahaca fresca', precio: 4500, categoria: 'Entrada' },
  { nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos importados con mermelada', precio: 7800, categoria: 'Entrada' },
  { nombre: 'Lomo al Vino Tinto', descripcion: 'Lomo de res en reducción de vino tinto', precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara', descripcion: 'Pasta con tocino, huevo y queso parmesano', precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha', descripcion: 'Filete de salmón con vegetales al vapor', precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 5200, categoria: 'Postre' },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá', precio: 4800, categoria: 'Postre' },
];

// Arreglo donde se guardarán todas las reservas creadas
const reservas = [];


// ======================================================
// FUNCIÓN: renderMenu()
// Renderiza dinámicamente todas las cards del menú
// ======================================================
function renderMenu(lista = menu) {
  const contenedor = document.getElementById("contenedor-menu");
  contenedor.innerHTML = ""; // Limpia el contenedor antes de renderizar

  // Recorre cada plato y crea su card en el DOM
  lista.forEach(plato => {
    const card = document.createElement("div");
    card.classList.add("card-plato");

    // Estructura interna de la card
    card.innerHTML = `
      <h3>${plato.nombre}</h3>
      <p>${plato.descripcion}</p>
      <p><strong>₡${plato.precio.toLocaleString()}</strong></p>
      <p><em>${plato.categoria}</em></p>
    `;

    contenedor.appendChild(card);
  });
}


// ======================================================
// FUNCIÓN: filtrarCategoria(categoria)
// Filtra el menú según la categoría seleccionada
// ======================================================
function filtrarCategoria(categoria) {
  const botones = document.querySelectorAll(".btn-filtro");

  // Quita el estilo activo de todos los botones
  botones.forEach(b => b.classList.remove("activo"));

  // Activa visualmente el botón seleccionado
  document.querySelector(`[data-cat="${categoria}"]`).classList.add("activo");

  // Si es "Todos", se muestra el menú completo
  if (categoria === "Todos") {
    renderMenu(menu);
  } else {
    // Filtra los platos por categoría
    const filtrados = menu.filter(p => p.categoria === categoria);
    renderMenu(filtrados);
  }
}


// ======================================================
// FUNCIÓN: validarFormulario()
// Valida todos los campos del formulario en tiempo real
// ======================================================
function validarFormulario() {

  document.getElementById("mensaje-confirmacion").textContent = "";

  let valido = true;

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const personas = document.getElementById("personas").value;

  // Validación del nombre
  if (nombre.length < 5 || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(nombre)) {
    document.getElementById("error-nombre").textContent = "Ingrese un nombre válido.";
    valido = false;
  } else {
    document.getElementById("error-nombre").textContent = "";
  }

  // Validación del correo con regex
  const regexCorreo = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
  if (!regexCorreo.test(correo)) {
    document.getElementById("error-correo").textContent = "Correo inválido.";
    valido = false;
  } else {
    document.getElementById("error-correo").textContent = "";
  }

  // Validación de fecha (no puede ser pasada)
  const hoy = new Date().toISOString().split("T")[0];
  if (!fecha || fecha < hoy) {
    document.getElementById("error-fecha").textContent = "Seleccione una fecha válida.";
    valido = false;
  } else {
    document.getElementById("error-fecha").textContent = "";
  }

  // Validación de hora
  if (!hora) {
    document.getElementById("error-hora").textContent = "Seleccione una hora.";
    valido = false;
  } else {
    document.getElementById("error-hora").textContent = "";
  }

  // Validación de número de personas
  if (personas < 1 || personas > 20) {
    document.getElementById("error-personas").textContent = "Debe ser entre 1 y 20.";
    valido = false;
  } else {
    document.getElementById("error-personas").textContent = "";
  }

  // Habilita o deshabilita el botón según la validez
  document.getElementById("btn-enviar").disabled = !valido;

  return valido;
}


// ======================================================
// FUNCIÓN: agregarReserva()
// Agrega una nueva reserva a la tabla y actualiza el resumen
// ======================================================
function agregarReserva() {
  // Obtiene los valores del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const personas = Number(document.getElementById("personas").value);

  // Crea el objeto reserva
  const nueva = { nombre, correo, fecha, hora, personas };
  reservas.push(nueva);

  const tbody = document.querySelector("#tabla-reservas tbody");

  // Crea la fila de la tabla
  const fila = document.createElement("tr");
  fila.classList.add("fila-reserva");

  // Si es un grupo grande, se marca visualmente
  if (personas >= 6) fila.classList.add("grupo-grande");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${correo}</td>
    <td>${fecha}</td>
    <td>${hora}</td>
    <td>${personas}</td>
  `;

  tbody.appendChild(fila);

  document.getElementById("mensaje-confirmacion").textContent = "Reserva agregada correctamente.";


  // Limpia el formulario y deshabilita el botón
  document.getElementById("form-reserva").reset();
  document.getElementById("btn-enviar").disabled = true;

  // Actualiza el resumen de reservas
  actualizarResumen();
}


// ======================================================
// FUNCIÓN: actualizarResumen()
// Muestra estadísticas de las reservas registradas
// ======================================================
function actualizarResumen() {
  const resumen = document.getElementById("resumen");

  // Si no hay reservas, se limpia el resumen
  if (reservas.length === 0) {
    resumen.innerHTML = "";
    return;
  }

  // Cálculos requeridos
  const totalReservas = reservas.length;
  const totalPersonas = reservas.reduce((acc, r) => acc + r.personas, 0);
  const mayor = reservas.reduce((max, r) => r.personas > max.personas ? r : max);

  // Renderiza el resumen
  resumen.innerHTML = `
    <p><strong>Total de reservas:</strong> ${totalReservas}</p>
    <p><strong>Total de personas:</strong> ${totalPersonas}</p>
    <p><strong>Reserva más grande:</strong> ${mayor.nombre} (${mayor.personas} personas)</p>
  `;
}


// ======================================================
// EVENTOS PRINCIPALES
// ======================================================
document.addEventListener('DOMContentLoaded', function () {
  renderMenu(); // Muestra el menú al cargar la página

  // Eventos de los botones de filtro
  document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => filtrarCategoria(btn.dataset.cat));
  });

  // Validación en tiempo real
  document.getElementById("form-reserva").addEventListener("input", validarFormulario);

  // Envío del formulario
  document.getElementById("form-reserva").addEventListener("submit", function (e) {
    e.preventDefault();
    if (validarFormulario()) agregarReserva();
  });
});
