const tipoEleccion = 1; // PASO
const tipoRecuento = 1; // Recuento definitivo

var cargosGlobal = [];
var distritosGlobal = [];
var seccionesGlobal = [];
const valorDistritoVacio = "Distrito";
const seleccionDeAño = document.getElementById("seleccion-año");
const seleccionDeCargo = document.getElementById("seleccion-cargo");
const seleccionDeDistrito = document.getElementById("seleccion-distrito");
const seleccionDeSeccion = document.getElementById("seleccion-seccion");

async function fetchDatos() {
  try {
    // Solicitud a la URL
    const response = await fetch(
      "https://resultados.mininterior.gob.ar/api/menu/periodos"
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const años = await response.json();
    return años; // Devuelve los datos de años
  } catch (error) {
    console.error("Error en fetchDatos:", error);
    throw error; // Lanza el error
  }
}

function cargarAños(años) {
  let selectElement = document.getElementById("seleccion-año");

  let selectHTML = '<option value="0">Año</option>';

  selectHTML += años.map((año) => {
    return `<option value="${año}">${año}</option>`;
  });

  selectElement.innerHTML = selectHTML;
}

// Llamo a las funciones secuencialmente. fetch, luego cargarAños.
fetchDatos()
  .then((años) => {
    cargarAños(años);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function seleccionAño(event) {
  let añoSeleccionado = event.target.value; // Asigno el elemento del evento

  if (añoSeleccionado && añoSeleccionado != 0) {
    // Verifico que no es nulo
    fetchCargos(añoSeleccionado); //Llamo a fetchCargos con el año seleccionado
  }
}

async function fetchCargos(selectedValue) {
  try {
    const response = await fetch(
      "https://resultados.mininterior.gob.ar/api/menu?año=" + selectedValue
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json(); // Almaceno en data
    // console.log(data);

    const eleccion = data.find(
      (elemento) => elemento.IdEleccion === tipoEleccion
    ); // Encuentro el tipo de elección (PASO)

    console.log(
      "Año eleccion:",
      eleccion.Año,
      "Tipo eleccion: (1-PASO 2-GENERAL)",
      eleccion.IdEleccion
    );

    cargarCargos(eleccion.Cargos);

    cargosGlobal = eleccion.Cargos; // Almaceno los cargos en variable global
  } catch (error) {
    console.error("Error en fetchCargos:", error);
  }
}

function cargarCargos(cargos) {
  let selectElement = document.getElementById("seleccion-cargo");
  let primerValor = '<option value="0">Cargo</option>';

  const cargosDisponibles = [
    primerValor,
    ...cargos.map((cargo) => {
      return `<option value="${cargo.IdCargo}">${cargo.Cargo}</option>`;
    }),
  ]; // Devuelvo un nuevo array

  selectElement.innerHTML = cargosDisponibles;
}

function obtenerCargo(event) {
  // Obtiene el cargo seleccionado para mostrar los distritos disponibles
  const idCargo = event.target.value;

  if (idCargo != 0 && idCargo) {
    const cargoSeleccionado = cargosGlobal.find(
      // Busco en el array global el ID del cargo seleccionado, lo almaceno en nueva constante.
      (cargo) => cargo.IdCargo === idCargo
    );

    console.log(
      "ID Cargo seleccionado:",
      cargoSeleccionado.IdCargo,
      "Nombre cargo seleccionado:",
      cargoSeleccionado.Cargo
    );

    distritosGlobal = cargoSeleccionado.Distritos; // Variable global con los distritos disponibles del cargo seleccionado

    mostrarDistritos(distritosGlobal);
  }
}

function mostrarDistritos(distritos) {
  let selectElement = document.getElementById("seleccion-distrito");
  selectElement.innerHTML = null; // Limpio opciones anteriores

  const placeHolderVacio = document.createElement("option");
  placeHolderVacio.value = valorDistritoVacio;
  placeHolderVacio.text = "Distrito";
  selectElement.appendChild(placeHolderVacio); // Genero un primer valor vacio

  distritos.forEach((distrito) => {
    const opcionDistrito = document.createElement("option");
    opcionDistrito.value = distrito.IdDistrito;
    opcionDistrito.text = distrito.Distrito;
    selectElement.appendChild(opcionDistrito);
  });
}

function obtenerDistrito(event) {
  const idDistrito = Number(event.target.value);

  if (idDistrito != valorDistritoVacio && idDistrito) {
    const distritoSeleccionado = distritosGlobal.find((distrito) => {
      return distrito.IdDistrito === idDistrito;
    });

    console.log(
      "ID Distrito seleccionado:",
      distritoSeleccionado.IdDistrito,
      "Nombre distrito seleccionado:",
      distritoSeleccionado.Distrito
    );

    seccionesGlobal = distritoSeleccionado.SeccionesProvinciales; // Almaceno las secciones provinciales

    const seccionesAMostrar = seccionesGlobal
      .map((seccion) => {
        return seccion.Secciones;
      })
      .flat(); // Transformo el array en unidimensional con las secciones.

    // console.log("Secciones provinciales: ", seccionesAMostrar);

    mostrarSecciones(seccionesAMostrar);
  }
}

function mostrarSecciones(secciones) {
  let selectElement = document.getElementById("seleccion-seccion");
  selectElement.innerHTML = null; // Limpio opciones anteriores

  const placeHolderOption = document.createElement("option");
  placeHolderOption.value = "Sección vacia";
  placeHolderOption.text = "Sección";
  selectElement.appendChild(placeHolderOption);

  secciones.forEach((seccion) => {
    const opcionSeccion = document.createElement("option");
    opcionSeccion.value = seccion.IdSeccion;
    opcionSeccion.text = seccion.Seccion;
    selectElement.appendChild(opcionSeccion);
  }); // Recorro el array y creo seleccionables por cada elemento del mismo
}

function obtenerSeccion(event) {
  // Obtiene la seccion seleccionada
  const idSeccion = Number(event.target.value);

  const seccionSeleccionada = seccionesGlobal.find(
    (seccion) => seccion.IdSeccion === idSeccion
  ); // Busco y almaceno el ID de la seccion que elegi

  const idSeccionProvincial = seccionesGlobal.find((secProv) => {
    const existeSeccion = secProv.Secciones.some(
      (seccion) => seccion.IdSeccion === idSeccion
    );
    return existeSeccion;
  }).IDSeccionProvincial;
  // Busco en seccionesGlobal si hay un elemento cuyo ID sea igual al seleccionado.
  // Almaceno el valor de su propiedad IDSeccionProvincial en la constante

  console.log("El ID de la seccion provincial es:", idSeccionProvincial);

  let selectElement = document.getElementById("hdSeccionProvincial");
  selectElement.value = idSeccionProvincial; // Asigno el valor
}

var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";

async function filtrarDatos() {
  // Obtener los valores de los campos de selección
  var anioEleccion = document.getElementById("seleccion-año").value;
  var categoriaId = 2;
  var distritoId = document.getElementById("seleccion-distrito").value;
  var seccionProvincialId = document.getElementById(
    "hdSeccionProvincial"
  ).value;
  var seccionId = document.getElementById("seleccion-seccion").value;
  var circuitoId = "";
  var mesaId = "";

  console.log(
    "Año:",
    anioEleccion,
    "Categoria:",
    categoriaId,
    "Tipo de elección:",
    tipoEleccion,
    "Tipo de recuento:",
    tipoRecuento,
    "ID Distrito:",
    distritoId,
    "ID Sección Provincial:",
    seccionProvincialId,
    "ID Sección:",
    seccionId
  );

  // https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=2019&tipoRecuento=1&tipoEleccion=2&categoriaId=2

  // Construir la URL con los valores de los campos
  let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();

    // Obtengo datos para cuadros
    mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
    electores = data.estadoRecuento.cantidadElectores;
    participacionSobreEscrutado = data.estadoRecuento.participacionPorcentaje;

    console.log(
      "Mesas totalizadas:",
      mesasEscrutadas,
      "Electores:",
      electores,
      "Participacion sobre escrutado:",
      participacionSobreEscrutado
    );

    // Si la respuesta fue correcta, imprimir en la consola
    console.log("Resultados obtenidos: ", data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const botonFiltrar = document.getElementById("boton-filtrar");

const mensajeExito = document.querySelector(".mensaje-exito");
const mensajeError = document.querySelector(".mensaje-error");
const mensajeIncompleto = document.querySelector(".mensaje-incompleto");

mensajeExito.style.display = "none";
mensajeError.style.display = "none";
mensajeIncompleto.style.display = "none";

// Ocultar sectores antes de presionar filtrar
const sectorTitulos = document.getElementById("sector-titulos");
const agregarInforme = document.getElementById("agregar-informe-boton");
const cartasPrincipales = document.getElementById("main-cards");
const agrupacionesContainer = document.getElementById("agrupaciones-container");
const mapa = document.getElementById("mapa");
const chartWrap = document.getElementById("chart-wrap");

const displayOriginal = {
  sectorTitulos: sectorTitulos.style.display,
  agregarInforme: agregarInforme.style.display,
  cartasPrincipales: cartasPrincipales.style.display,
  agrupacionesContainer: agrupacionesContainer.style.display,
  mapa: mapa.style.display,
  chartWrap: chartWrap.style.display,
};

sectorTitulos.style.display = "none";
agregarInforme.style.display = "none";
cartasPrincipales.style.display = "none";
agrupacionesContainer.style.display = "none";
mapa.style.display = "none";
chartWrap.style.display = "none";

var mensajeInicioFiltrar = document.getElementById("mensaje-inicio");
mensajeInicioFiltrar.textContent =
  "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR";

function volverVisiblesMensajes() {
  mensajeInicioFiltrar.style.display = "none";
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  agregarInforme.style.display = displayOriginal.agregarInforme;
  cartasPrincipales.style.display = displayOriginal.cartasPrincipales;
  agrupacionesContainer.style.display = displayOriginal.agrupacionesContainer;
  mapa.style.display = displayOriginal.mapa;
  chartWrap.style.display = displayOriginal.chartWrap;
}

botonFiltrar.addEventListener("click", async function () {
  // Validaciones iniciales

  if (
    seleccionDeAño.value == "0" ||
    seleccionDeCargo.value == "0" ||
    seleccionDeDistrito.value == "Distrito" ||
    seleccionDeSeccion.value == "Sección vacia" ||
    mesasEscrutadas == "0"
  ) {
    sectorTitulos.style.display = displayOriginal.sectorTitulos;
    mensajeInicioFiltrar.textContent = "Error: ERROR?";
    mensajeInicioFiltrar.style.backgroundColor = "red";
    return; // Salir de la función si las validaciones fallan
  }

  try {
    await filtrarDatos();
    actualizarInformacionTituloYSubtitulo();
    volverVisiblesMensajes();
    mostrarInformacionCuadros();
  } catch (error) {
    console.error("Error:", error);
  }
});

function actualizarInformacionTituloYSubtitulo() {
  let tipoEleccion = "PASO";
  let selectAnioValue = seleccionDeAño.value;
  let selectCargoValue =
    seleccionDeCargo.options[seleccionDeCargo.selectedIndex].text;
  let selectDistritoValue =
    seleccionDeDistrito.options[seleccionDeDistrito.selectedIndex].text;
  let selectSeccionValue =
    seleccionDeSeccion.options[seleccionDeSeccion.selectedIndex].text;

  // Actualizar los elementos con el título y subtítulo
  document.getElementById(
    "titulo-principal"
  ).textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
  document.getElementById(
    "subtitulo"
  ).textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
}

function mostrarInformacionCuadros() {
  // Actualizar elementos con la información
  document.getElementById("mesas-escrutadas-porcentaje").textContent =
    mesasEscrutadas;
  document.getElementById("electores-porcentaje").textContent = electores;
  document.getElementById("participacion-porcentaje").textContent =
    participacionSobreEscrutado + "%";
}
