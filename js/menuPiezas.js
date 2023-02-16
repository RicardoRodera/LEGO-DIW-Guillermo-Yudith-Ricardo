window.addEventListener("load", cargarPagina);

const key = "07880df945ae318d79416922e15e7c11";
let colores = ["rojo", "azul", "verde", "amarillo"];
let color = 0;

var tamPagina = 16;
var paginaActual = 1;
var totalFiguras = 0;

function cargarPagina() {
  document.getElementById("btnBuscar").addEventListener("click", buscar);

  mostrarApi();
  this.document.querySelector("#anterior").addEventListener("click", pulsaAnterior);
  this.document.querySelector("#siguiente").addEventListener("click", pulsaSiguiente);
}


function mostrarApi() {

  fetch(`https://rebrickable.com/api/v3/lego/parts/?&page_size=99999&key=${key}&limit=${tamPagina}&offset=${(paginaActual - 1) * tamPagina}`)
    .then(response => response.json())
    .then(data => {
      totalFiguras = data.count;


      data.results.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina).forEach(piezas => {

        let tarjeta = `
      <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
        <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
          <div class="bg-light contenedorImagen">
            ${comprobarImagen(piezas.part_img_url)}
          </div>
          <div class="card-body mt-3 ">
            <h5 class="card-title text-light">${piezas.name}</h5>
          </div>
        </div>
      </div>`;

        document.getElementById('catalogo').innerHTML += tarjeta;

        color++;
        if (color == 4) {
          color = 0
        };

        actualizaPaginacion(data);
      });


    }).catch(function (ex) {
      console.error('Error', ex.message)
    })
  color = 0;
}


function getSetsBusqueda(busqueda = "") {
  fetch("https://rebrickable.com/api/v3/lego/sets/?search=" + busqueda + "&key=" + key, { method: 'get' })
    .then(function (respuesta) {
      return respuesta.json()
    })
    .then(function (jsonData) {
      console.log('JSON ya parseado:', jsonData)
    })
    .catch(function (ex) {
      console.error('Error', ex.message)
    })
}

function comprobarImagen(valor) {
  if (valor != null) {
    return `<img src="` + valor + `" class="card-img-top">`;
  } else {
    return `<img src="../Imagenes/bloqueLego.jfif" class="card-img-top">`;
  }
}

function actualizaPaginacion() {

  if (paginaActual == 1) {
    document.querySelector("#anterior").classList.add("disabled");
  } else if (paginaActual == Math.ceil(totalFiguras / tamPagina)) {
    document.querySelector("#siguiente").classList.add("disabled");
  } else {
    document.querySelector("#anterior").classList.remove("disabled");
    document.querySelector("#siguiente").classList.remove("disabled");
  }
}

function cargaResultados() {
  document.getElementById("catalogo").innerHTML = "";
  mostrarApi();
}


function pulsaAnterior() {
  paginaActual--;
  cargaResultados();

}

function pulsaSiguiente() {
  paginaActual++;
  cargaResultados();
}

//getSetsBusqueda();

function buscar() {
  let busqueda = document.querySelector("#buscarPiezas").value;
  let codPieza = document.querySelector("#buscarCodigo").value;

  fetch("https://rebrickable.com/api/v3/lego/parts/?search=" + busqueda + "&page_size=99999&part_num= " + codPieza + "&key=" + key, { method: 'get' })
    .then(function (respuesta) {
      return respuesta.json()
    })
    .then(function (jsonData) {
      console.log(jsonData)
      for (let i = 0; i < jsonData.results.length; i++) {
        setJson = jsonData.results[i];
        console.log("Nombre del set: " + setJson.name);
        console.log("Año de salida del set: " + setJson.year);
        console.log("Imagen de la pieza: " + setJson.part_img_url);
      }
    })
    .catch(function (ex) {
      console.error('Error', ex.message)
    })

  document.querySelector("#buscarPiezas").value = "";
  document.querySelector("#buscarCodigo").value = "";
}