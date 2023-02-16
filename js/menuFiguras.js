window.addEventListener("load", cargarPagina);
const temas = new Map();
const key = "07880df945ae318d79416922e15e7c11";
let colores = ["rojo", "azul", "verde", "amarillo"];
let color = 0;

var tamPagina = 16;
var paginaActual = 1;
var totalFiguras = 0;

function cargarPagina() {
  document.getElementById("btnBuscar").addEventListener("click", buscar);
  document.getElementById("buscarTemas").addEventListener("input", autocompletar);
  getTemas();

  mostrarApi();
  this.document.querySelector("#anterior").addEventListener("click", pulsaAnterior);
  this.document.querySelector("#siguiente").addEventListener("click", pulsaSiguiente);
}
//comentario para hacer pruebas muy serias

function mostrarApi() {

  fetch(`https://rebrickable.com/api/v3/lego/minifigs/?&page_size=99999&key=${key}&limit=16&offset=${(paginaActual - 1) * tamPagina}`)
    .then(response => response.json())
    .then(data => {
      totalFiguras = data.count;

      data.results.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina).forEach(figuras => {

        let tarjeta = `
          <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
            <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
              <div class="bg-light contenedorImagen">
                ${comprobarImagen(figuras.set_img_url)}
              </div>
              <div class="card-body mt-3 ">
                <h5 class="card-title text-light">${figuras.name}</h5>
                <p class="card-text text-light">Numero de partes: ${figuras.num_parts}</p>
                
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
    return `<img src="../Imagenes/LegoVacio.png" class="card-img-top">`;
  }
}

function actualizaPaginacion() {

  if (paginaActual == 1) {
    document.querySelector("#anterior").classList.add("disabled");
  } else if (paginaActual == 7) {
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



function getTemas() {
  let listaTemas = [];
  fetch("https://rebrickable.com/api/v3/lego/themes/?page_size=460&key=" + key, { method: 'get' })
    .then(function (respuesta) {
      return respuesta.json()
    })
    .then(function (jsonData) {
      let results = jsonData.results;
      for (let i = 0; i < results.length; i++) {
        temas.set(results[i].name, results[i].id);
      }
    })
    .catch(function (ex) {
      console.error('Error', ex.message)
    })
}

function buscar() {
  let busqueda = document.querySelector("#buscarFiguras").value;
  let piezas = document.querySelector("#buscarPiezas").value;
  let tema = document.querySelector("#buscarTemas").value != "" ? temas.get(document.querySelector("#buscarTemas").value) : "";

  fetch("https://rebrickable.com/api/v3/lego/minifigs/?search=" + busqueda + "&page_size=99999&in_theme_id=" + tema +  "&min_parts=" + piezas + "&max_parts=" + piezas + "&key=" + key, { method: 'get' })
    .then(function (respuesta) {
      return respuesta.json()
    })
    .then(function (jsonData) {
      console.log(jsonData)
      for (let i = 0; i < jsonData.results.length; i++) {
        setJson = jsonData.results[i];
        console.log("Nombre del set: " + setJson.name);
        console.log("Año de salida del set: " + setJson.year);
        console.log("Imagen del set: " + setJson.set_img_url);
      }
    })
    .catch(function (ex) {
      console.error('Error', ex.message)
    })

  document.querySelector("#buscarFiguras").value = "";
  document.querySelector("#buscarPiezas").value = "";
  document.querySelector("#buscarTemas").value = "";
}

function autocompletar(e) {
  cierraSugerencias();

  let valor = this.value;
  if (!valor)
    return false;

  /*Creamos un div que contendrá las sugerencias:*/
  let lista = document.createElement("datalist");
  lista.setAttribute("id", "lista-autocompleccion");
  this.setAttribute("list", "lista-autocompleccion")

  this.parentNode.appendChild(lista);
  temas.forEach((value, key) => {
    /* Crea un option para cada tema que comienza igual que el texto que he introducido */
    if (key.toLowerCase().startsWith(valor.toLowerCase())) {
      let sugerencia = document.createElement("option");
      sugerencia.id = value;
      sugerencia.value = key;
      lista.appendChild(sugerencia);
    }
  });
}

function cierraSugerencias() {
  var lista = document.querySelector("#lista-autocompleccion");
  if (lista)
    lista.parentNode.removeChild(lista);

}