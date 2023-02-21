window.addEventListener("load", cargarPagina);
const coloresPiezas = new Map();

const key = "07880df945ae318d79416922e15e7c11";
let colores = ["rojo", "azul", "verde", "amarillo"];
let color = 0;

var tamPagina = 16;
var paginaActual = 1;
var totalFiguras = 0;

function cargarPagina() {
  document.getElementById("btnBuscar").addEventListener("click", buscar);
  document.getElementById("colorPieza").addEventListener("input", autocompletar);
  getColores();

  buscar();
  this.document.querySelector("#anterior").addEventListener("click", pulsaAnterior);
  this.document.querySelector("#siguiente").addEventListener("click", pulsaSiguiente);
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
    return `<img src="../Imagenes/piezaLego.jpg" class="card-img-top">`;
  }
}

function actualizaPaginacion(){
  
  if(paginaActual==1){
    document.querySelector("#anterior").classList.add("disabled");
    document.querySelector("#siguiente").classList.remove("disabled");
  }else if(paginaActual==Math.ceil(totalFiguras/tamPagina)){
      document.querySelector("#siguiente").classList.add("disabled");
      document.querySelector("#anterior").classList.remove("disabled");
  }else{
      document.querySelector("#anterior").classList.remove("disabled");
      document.querySelector("#siguiente").classList.remove("disabled");
  }
}




function pulsaAnterior(){
  paginaActual--;
  mostrarBusqueda();
}
 
function pulsaSiguiente(){
  paginaActual++;
  mostrarBusqueda();
}

//getSetsBusqueda();

function buscar() {
  paginaActual=1;
  document.getElementById("error").classList.add("d-none");
  mostrarBusqueda();
  
}

function mostrarBusqueda(){
  let busqueda = document.querySelector("#buscarPiezas").value;
  let codPieza = document.querySelector("#buscarCodigo").value;
  let colorPieza = document.querySelector("#colorPieza").value;

  
  document.getElementById("catalogo").innerHTML = "";

  fetch("https://rebrickable.com/api/v3/lego/parts/?search=" + busqueda + "&page_size=99999&part_num= " + codPieza + "&key=" + key, { method: 'get' })
      .then(function (respuesta) {
          return respuesta.json()
      })
      .then(function (jsonData) {
          console.log(jsonData)
      
          totalFiguras = jsonData.results.length;
          if(totalFiguras==0){
            document.getElementById("error").classList.remove("d-none");
            document.querySelector("#siguiente").classList.add("disabled");
          }
          jsonData.results.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina).forEach((setJson) => {
              console.log("Nombre de la pieza set: " + setJson.name);
              console.log("Año de salida del set: " + setJson.year);
              console.log("Imagen del set: " + setJson.set_img_url);
              let tarjeta = `
                  <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
                      <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
                          <div class="bg-light contenedorImagen">
                              ${comprobarImagen(setJson.part_img_url)}
                          </div>
                          <div class="card-body mt-3 ">
                              <h5 class="card-title text-light">${setJson.name}</h5>
                              <p class="card-text text-light">Codigo: ${setJson.part_num}</p>
                              <button type="button" class="btn btn-primary">Comprar</button>
                          </div>
                      </div>
                  </div>`;

              document.getElementById('catalogo').innerHTML += tarjeta;

              color++;
              if(color==4){
                  color=0
              };
        
              actualizaPaginacion();
          });
      })
      .catch(function (ex) {
          console.error('Error', ex.message)
      })
}

function getColores() {
  let listaColores = [];
  fetch("https://rebrickable.com/api/v3/lego/colors/?page_size=217&key=" + key, { method: 'get' })
    .then(function (respuesta) {
      return respuesta.json()
    })
    .then(function (jsonData) {
      let results = jsonData.results;
      for (let i = 0; i < results.length; i++) {
        coloresPiezas.set(results[i].name, results[i].id);
      }
    })
    .catch(function (ex) {
      console.error('Error', ex.message)
    })
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
  coloresPiezas.forEach((value, key) => {
    /* Crea un option para cada color que comienza igual que el texto que he introducido */
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