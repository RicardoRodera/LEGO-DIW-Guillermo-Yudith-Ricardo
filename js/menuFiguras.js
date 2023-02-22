window.addEventListener("load", cargarPagina);
const temas = new Map();
const token = "f3de130738d80208e4f588622bcb535195ec25bf441967b0020502ea0fe91f23";
const key = "07880df945ae318d79416922e15e7c11";
let colores = ["rojo", "azul", "verde", "amarillo"];
let color = 0;

var tamPagina = 16;
var paginaActual = 1;
var totalFiguras = 0;
var search = false;

function cargarPagina() {
  document.getElementById("btnBuscar").addEventListener("click", buscar);
  document.getElementById("buscarTemas").addEventListener("input", autocompletar);
  getTemas();

  mostrarBusqueda();
  this.document.querySelector("#anterior").addEventListener("click", pulsaAnterior);
  this.document.querySelector("#siguiente").addEventListener("click", pulsaSiguiente);
}
//comentario para hacer pruebas muy serias

function buscar() {
  paginaActual=1;
  search = true;
  document.getElementById("error").classList.add("d-none");
  mostrarBusqueda();
  
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

function mostrarBusqueda(){
  let busqueda = document.querySelector("#buscarFiguras").value;
  let piezas = document.querySelector("#buscarPiezas").value;
  let temaValidacion = document.querySelector("#buscarTemas").value
  let tema = document.querySelector("#buscarTemas").value != "" ? temas.get(document.querySelector("#buscarTemas").value) : "";
  let existeError = detectorErrores(1,temaValidacion, piezas);
  
  document.getElementById("catalogo").innerHTML = "";
  if(existeError==false){
    fetch("https://rebrickable.com/api/v3/lego/minifigs/?search=" + busqueda + "&page_size=99999&in_theme_id=" + tema +  "&min_parts=" + piezas + "&max_parts=" + piezas + "&key=" + key, { method: 'get' })
      .then(function (respuesta) {
          return respuesta.json()
      })
      .then(function (jsonData) {
          console.log(jsonData)
      
          totalFiguras = jsonData.results.length;
          detectorErrores(totalFiguras,temaValidacion, piezas);

          jsonData.results.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina).forEach((setJson) => {
              
              let tarjeta = `
                  <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
                      <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
                          <div class="bg-light contenedorImagen">
                              ${comprobarImagen(setJson.set_img_url)}
                          </div>
                          <div class="card-body mt-3 ">
                              <h5 class="card-title text-light">${setJson.name}</h5>
                              <p class="card-text text-light">Numero de partes: ${setJson.num_parts}</p>
                              <button value="${setJson.set_num}" type="button" class="btn btn-primary" onClick="guardar(this)">Guardar</button>
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

function detectorErrores(totalFiguras,temaValidacion,piezas){
   const num = parseFloat(piezas);

  if(totalFiguras==0){ 
    document.getElementById("error").classList.remove("d-none");
    document.getElementById("error").innerHTML="No se han encontrado resultados";
    document.querySelector("#siguiente").classList.add("disabled");
    return true;
  }else if(!(temas.has(temaValidacion)) && search==true && temaValidacion!=""){
    document.getElementById("error").classList.remove("d-none");
    document.getElementById("error").innerHTML="No existe ese tema";
    document.querySelector("#siguiente").classList.add("disabled");
    return true;
  }else if((isNaN(num)) && search==true && piezas!=""){
    document.getElementById("error").classList.remove("d-none");
    document.getElementById("error").innerHTML="El numero de piezas no es un numero";
    document.querySelector("#siguiente").classList.add("disabled");
    return true;
  }

  return false;
}


function pulsaAnterior(){
  paginaActual--;
  mostrarBusqueda();
}
 
function pulsaSiguiente(){
  paginaActual++;
  mostrarBusqueda();
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

function guardar(e) {
  let setNum = (e.value);
  const opciones = {
      method: 'post',
      body: "set_num=" + setNum,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization': "key "+  key
      },
  }
  fetch("https://rebrickable.com/api/v3/users/" + token + "/sets/", opciones)
      .then(function (respuesta) {
          return respuesta.json()
      })
      .then(function (jsonData) {
          //llega tras conseguir hacer el post
      })
      .catch(function (ex) {
          console.error('Error', ex.message)
      })
}