const tipoEleccion = 2; // General
const tipoRecuento = 1; // Recuento definitivo

var cargosGlobal = [];
var distritosGlobal = [];
var seccionesGlobal = [];
const valorDistritoVacio = "Distrito";

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
  var selectElement = document.getElementById("seleccion-año");

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
    console.log(años);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function seleccionAño(event) {
  var añoSeleccionado = event.target.value;

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
  selectElement.appendChild(placeHolderVacio);

  distritos.forEach((distrito) => {
    const opcionDistricto = document.createElement("option");
    opcionDistricto.value = distrito.IdDistrito;
    opcionDistricto.text = distrito.Distrito;
    selectElement.appendChild(opcionDistricto);
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

// Arreglo general de todas las secciones a mostrar
// - conseguir el arreglo de secciones a partir del arreglo de seccionesProvinciales
// - cuando elegis una seccion ir a buscar en seccionesGlobal el id provincial

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
      (seccion) => seccion.IdSeccion === idSeccion // ARREGLO
    );
    return existeSeccion;
  }).IDSeccionProvincial;
  // Busco en seccionesGlobal si hay un elemento cuyo ID sea igual al seleccionado.
  // Almaceno el valor de su propiedad IDSeccionProvincial en la constante

  console.log("El ID de la seccion provincial es:", idSeccionProvincial);

  let selectElement = document.getElementById("hdSeccionProvincial");
  selectElement.value = idSeccionProvincial; // Asigno el valor
}

var botonFiltrar = document.getElementById("boton-filtrar");
botonFiltrar.addEventListener("click", filtrarDatos);

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
  var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();

    // Si la respuesta fue correcta, imprimir en la consola
    console.log("Resultados obtenidos: ", data);
  } catch (error) {
    // Mostrar un mensaje de error en rojo con el detalle del error
    mostrarMensajeError(`Error: ${error.message}`);
  }
}

botonFiltrar.addEventListener("click", function () {
  // Llama a la función para actualizar el título y el subtítulo
  actualizarInformacionTituloYSubtitulo();
});

var selectAnio = document.getElementById("seleccion-año");
var selectCargo = document.getElementById("seleccion-cargo");
var selectDistrito = document.getElementById("seleccion-distrito");
var selectSeccion = document.getElementById("seleccion-seccion");

selectAnio.addEventListener("change", actualizarInformacionTituloYSubtitulo);
selectCargo.addEventListener("change", actualizarInformacionTituloYSubtitulo);
selectDistrito.addEventListener(
  "change",
  actualizarInformacionTituloYSubtitulo
);
selectSeccion.addEventListener("change", actualizarInformacionTituloYSubtitulo);

function actualizarInformacionTituloYSubtitulo() {
  var tipoEleccion = "PASO";
  var selectAnioValue = selectAnio.value;
  var selectCargoValue = selectCargo.options[selectCargo.selectedIndex].text;
  var selectDistritoValue =
    selectDistrito.options[selectDistrito.selectedIndex].text;
  var selectSeccionValue =
    selectSeccion.options[selectSeccion.selectedIndex].text;

  // Actualizar los elementos con el título y subtítulo
  document.getElementById(
    "titulo-principal"
  ).textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
  document.getElementById(
    "subtitulo"
  ).textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
}
