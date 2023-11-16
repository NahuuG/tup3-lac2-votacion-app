const tipoEleccion = 1; // PASO
const tipoRecuento = 1; // Recuento definitivo

var cargosGlobal = [];
var distritosGlobal = [];
var seccionesGlobal = [];
const seleccionDeAño = document.getElementById("seleccion-año");
const seleccionDeCargo = document.getElementById("seleccion-cargo");
const seleccionDeDistrito = document.getElementById("seleccion-distrito");
const seleccionDeSeccion = document.getElementById("seleccion-seccion");
const seleccionDeSeccionProvincial = document.getElementById(
  "hdSeccionProvincial"
);

var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";
var valoresTotalizadosPositivos = "";

var añoSeleccionado = "";

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
  seleccionDeAño.innerHTML = ""; // Limpio opciones anteriores

  const placeHolderVacio = document.createElement("option");
  placeHolderVacio.value = "Año";
  placeHolderVacio.text = "Año";
  seleccionDeAño.appendChild(placeHolderVacio); // Genero un primer valor vacio

  años.forEach((año) => {
    const opcionAño = document.createElement("option");
    opcionAño.value = año;
    opcionAño.text = año;
    seleccionDeAño.appendChild(opcionAño);
  });
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
  añoSeleccionado = event.target.value; // Asigno el elemento del evento

  seleccionDeCargo.value = "Cargo";
  seleccionDeDistrito.value = "Distrito";
  seleccionDeSeccion.value = "Sección";

  if (añoSeleccionado != "Año" && añoSeleccionado) {
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
  seleccionDeCargo.innerHTML = null;

  const placeHolderVacio = document.createElement("option");
  placeHolderVacio.value = "Cargo";
  placeHolderVacio.text = "Cargo";
  seleccionDeCargo.appendChild(placeHolderVacio); // Genero un primer valor vacio

  cargos.forEach((cargo) => {
    const opcionCargo = document.createElement("option");
    opcionCargo.value = cargo.IdCargo;
    opcionCargo.text = cargo.Cargo;
    seleccionDeCargo.appendChild(opcionCargo);
  });
}

function obtenerCargo(event) {
  // Obtiene el cargo seleccionado para mostrar los distritos disponibles
  const idCargo = event.target.value;
  seleccionDeDistrito.value = "Distrito";
  seleccionDeSeccion.value = "Sección";

  if (idCargo != "Cargo" && idCargo) {
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
  seleccionDeDistrito.innerHTML = null;

  const placeHolderVacio = document.createElement("option");
  placeHolderVacio.value = "Distrito";
  placeHolderVacio.text = "Distrito";
  seleccionDeDistrito.appendChild(placeHolderVacio); // Genero un primer valor vacio

  distritos.forEach((distrito) => {
    const opcionDistrito = document.createElement("option");
    opcionDistrito.value = distrito.IdDistrito;
    opcionDistrito.text = distrito.Distrito;
    seleccionDeDistrito.appendChild(opcionDistrito);
  });
}

var distritoSeleccionado = "";

function obtenerDistrito(event) {
  const idDistrito = Number(event.target.value);
  seleccionDeSeccion.value = "Sección";

  if (idDistrito != "Distrito" && idDistrito) {
    distritoSeleccionado = distritosGlobal.find((distrito) => {
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
  seleccionDeSeccion.innerHTML = null; // Limpio opciones anteriores

  const placeHolderOption = document.createElement("option");
  placeHolderOption.value = "Sección";
  placeHolderOption.text = "Sección";
  seleccionDeSeccion.appendChild(placeHolderOption);

  secciones.forEach((seccion) => {
    const opcionSeccion = document.createElement("option");
    opcionSeccion.value = seccion.IdSeccion;
    opcionSeccion.text = seccion.Seccion;
    seleccionDeSeccion.appendChild(opcionSeccion);
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
  console.log("El ID de la seccion es:", idSeccion);
  console.log("El ID de la seccion provincial es:", idSeccionProvincial);

  seleccionDeSeccionProvincial.value = idSeccionProvincial; // Asigno el valor
}

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
    valoresTotalizadosPositivos = data.valoresTotalizadosPositivos;

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

const mensajeExito = document.getElementById("mensaje-exito");
const mensajeError = document.getElementById("mensaje-error");
const mensajeIncompleto = document.getElementById("mensaje-incompleto");

mensajeExito.style.display = "none";
mensajeError.style.display = "none";
mensajeIncompleto.style.display = "none";

const sectorTitulos = document.getElementById("sector-titulos");
const agregarInforme = document.getElementById("agregar-informe-boton");
const cartasPrincipales = document.getElementById("main-cards");
const agrupacionesContainer = document.getElementById("agrupaciones-container");
const mapa = document.getElementById("mapa");
const chartWrap = document.getElementById("chart-wrap");

// Almaceno los displays originales de cada uno, previo a ocultarlos
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
mensajeInicioFiltrar.style.marginTop = "50px";
mensajeInicioFiltrar.style.marginBottom = "50px";

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
  mostrarMensajeDeCarga();

  try {
    // Llamar a filtrarDatos de manera asíncrona
    await filtrarDatos();

    setTimeout(function () {
      if (mesasEscrutadas !== 0 && validarFiltros()) {
        realizarFiltrado();
        // Oculta el mensaje de carga cuando la operación está completa
        ocultarMensajeDeCarga();
      } else if (mesasEscrutadas === 0 && validarFiltros()) {
        actualizarInformacionTituloYSubtitulo();
        mostrarError(
          "No se encontró información para la consulta realizada",
          "#ffc107"
        );

        agregarInforme.style.display = "none";
        cartasPrincipales.style.display = "none";
        agrupacionesContainer.style.display = "none";
        mapa.style.display = "none";
        chartWrap.style.display = "none";
      } else {
        actualizarInformacionTituloYSubtitulo();
        mostrarError("Error: Los filtros no son válidos", "red");

        agregarInforme.style.display = "none";
        cartasPrincipales.style.display = "none";
        agrupacionesContainer.style.display = "none";
        mapa.style.display = "none";
        chartWrap.style.display = "none";
      }
    }, 2000); // Agrego tiempo de espero
  } catch (error) {
    console.error("Error en la función filtrarDatos:", error);
    mostrarError("Error en la operación", "#dc3545");
  }
});

function validarFiltros() {
  return (
    seleccionDeAño.value !== "Año" &&
    seleccionDeCargo.value !== "Cargo" &&
    seleccionDeDistrito.value !== "Distrito" &&
    seleccionDeSeccion.value !== "Sección"
  );
}

function mostrarError(mensaje, colorFondo) {
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  mensajeInicioFiltrar.style.display = "block";
  mensajeInicioFiltrar.innerHTML = mensaje;
  mensajeInicioFiltrar.style.backgroundColor = colorFondo;
}

function realizarFiltrado() {
  actualizarInformacionTituloYSubtitulo();
  volverVisiblesMensajes();
  mostrarInformacionCuadros();
  actualizarMapa();
  crearListaAgrupacionesYColores();
  completarResumenVotos();
}

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
  document.getElementById("mesas-escrutadas-porcentaje").innerHTML =
    mesasEscrutadas;
  document.getElementById("electores-porcentaje").innerHTML = electores;
  document.getElementById("participacion-porcentaje").innerHTML =
    participacionSobreEscrutado + "%";
}

function actualizarMapa() {
  let imagenMapa = document.getElementById("mapa");

  const provinciaEncontrada = provincias.find(
    (provincia) => provincia.idDistrito === distritoSeleccionado.IdDistrito
  );

  if (provinciaEncontrada) {
    imagenMapa.innerHTML = `<h3>${provinciaEncontrada.provincia}</h3> ${provinciaEncontrada.svg}`;
  } else {
    console.log(
      "No se encontró una provincia correspondiente al distrito seleccionado."
    );
  }
}

function mostrarMensajeDeCarga() {
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  mensajeInicioFiltrar.style.display = "block";
  mensajeInicioFiltrar.style.backgroundColor = `var(--gris-claro)`;
  mensajeInicioFiltrar.innerHTML = `<i class="fa-solid fa-spinner"></i>Su operación esta siendo procesada`;
}

function ocultarMensajeDeCarga() {
  mensajeInicioFiltrar.style.display = "none";
}

const agregarAInformesBoton = document.getElementById("agregar-informe-boton");

agregarAInformesBoton.addEventListener("click", function () {
  let vAnio = seleccionDeAño.value;
  let vTipoRecuento = tipoRecuento;
  let vTipoEleccion = tipoEleccion;
  let vCategoriaId = seleccionDeCargo.value;
  let vDistrito = seleccionDeDistrito.value;
  let vSeccionProvincial = `${seleccionDeSeccionProvincial.value},`;
  let vSeccionID = seleccionDeSeccion.value;
  let nombreCargo =
    seleccionDeCargo.options[seleccionDeCargo.selectedIndex].text;
  let nombreDistrito =
    seleccionDeDistrito.options[seleccionDeDistrito.selectedIndex].text;
  let nombreSeccion =
    seleccionDeSeccion.options[seleccionDeSeccion.selectedIndex].text;

  // Cadena con los valores
  const nuevoRegistro = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${vSeccionID}|${nombreCargo}|${nombreDistrito}|${nombreSeccion}`;

  // Obtiene los registros existentes del localStorage (si los hay)
  const informesExistenteJSON = localStorage.getItem("INFORMES");
  let informesExistente = [];

  if (informesExistenteJSON) {
    try {
      informesExistente = JSON.parse(informesExistenteJSON);
    } catch (error) {
      // Mostrar un mensaje de error
      console.error("Error al analizar JSON:", error);
      mensajeError.style.display = "block";
      setTimeout(() => {
        mensajeError.style.display = "none";
      }, 5000);
    }
  }

  // Verifica si el nuevo registro ya existe
  if (informesExistente.includes(nuevoRegistro)) {
    mensajeIncompleto.style.display = "block";
    setTimeout(() => {
      mensajeIncompleto.style.display = "none";
    }, 5000);
  } else {
    // Agrega el nuevo registro al array
    informesExistente.push(nuevoRegistro);

    // Almacena el array actualizado en el localStorage
    localStorage.setItem("INFORMES", JSON.stringify(informesExistente));
    mensajeExito.style.display = "block";
    setTimeout(() => {
      mensajeExito.style.display = "none";
    }, 5000);
  }
});

let agrupacionesYColores = {};

const coloresAgrupaciones = {
  1: {
    colorPleno: "var(--grafica-amarillo)",
    colorLiviano: "var(--grafica-amarillo-claro)",
  },
  2: {
    colorPleno: "var(--grafica-celeste)",
    colorLiviano: "var(--grafica-celeste-claro)",
  },
  3: {
    colorPleno: "var(--grafica-bordo)",
    colorLiviano: "var(--grafica-bordo-claro)",
  },
  4: {
    colorPleno: "var(--grafica-lila)",
    colorLiviano: "var(--grafica-lila-claro)",
  },
  5: {
    colorPleno: "var(--grafica-lila2)",
    colorLiviano: "var(--grafica-lila2-claro)",
  },
  6: {
    colorPleno: "var(--grafica-verde)",
    colorLiviano: "var(--grafica-verde-claro)",
  },
  7: {
    colorPleno: "var(--grafica-gris)",
    colorLiviano: "var(--grafica-gris-claro)",
  },
};

function crearListaAgrupacionesYColores() {
  let agrupaciones = valoresTotalizadosPositivos.sort(
    (a, b) => b.votos - a.votos
  );
  let cont = 0;

  agrupaciones.forEach((agrupacion) => {
    let idAgrupacion = agrupacion.idAgrupacion;

    agrupacionesYColores[idAgrupacion] = {
      colorPleno:
        cont < 6
          ? coloresAgrupaciones[cont + 1].colorPleno
          : coloresAgrupaciones[7].colorPleno,
      colorLiviano:
        cont < 6
          ? coloresAgrupaciones[cont + 1].colorLiviano
          : coloresAgrupaciones[7].colorLiviano,
    };

    cont = cont + 1;
  });
}

var gridVotos = document.getElementById("grid-votos");

function completarResumenVotos() {
  let agrupaciones = valoresTotalizadosPositivos;
  let cont = 0;

  while (gridVotos.firstChild) {
    gridVotos.removeChild(gridVotos.firstChild);
  }

  agrupaciones.forEach((agrupacion) => {
    if (cont < 7) {
      const divBarra = document.createElement("div");
      divBarra.classList.add("bar");
      divBarra.style.width = `${agrupacion.votosPorcentaje}%`;
      divBarra.style.background = `${
        agrupacionesYColores[agrupacion.idAgrupacion].colorPleno
      }`;
      divBarra.dataset.name = agrupacion.nombreAgrupacion;
      divBarra.title = `${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%`;
      cont++;

      gridVotos.appendChild(divBarra);
    }
  });
}
