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
  
  let codPieza = document.querySelector("#buscarCodigo").value;
  

  
  document.getElementById("catalogo").innerHTML = "";

  fetch("https://rebrickable.com/api/v3/lego/parts/?&page_size=99999&part_num= " + codPieza + "&key=" + key, { method: 'get' })
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
          if(totalFiguras==1){
            document.getElementById("siguiente").classList.add("disabled");
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



function actualizaPaginacion(){
  if(totalFiguras<16){
    document.querySelector("#anterior").classList.add("disabled");
    document.querySelector("#siguiente").classList.add("disabled");
  }else if(paginaActual==1){
    document.querySelector("#anterior").classList.add("disabled");
    document.querySelector("#siguiente").classList.remove("disabled");
  }else if(paginaActual==Math.ceil(totalFiguras/tamPagina)){
      document.querySelector("#siguiente").classList.add("disabled");
      document.querySelector("#anterior").classList.remove("disabled");
  }else if(totalFiguras<16){
    document.querySelector("#siguiente").classList.add("disabled");
    document.querySelector("#anterior").classList.remove("disabled");
  }else{
      document.querySelector("#anterior").classList.remove("disabled");
      document.querySelector("#siguiente").classList.remove("disabled");
  }
}


function cierraSugerencias() {
  var lista = document.querySelector("#lista-autocompleccion");
  if (lista)
    lista.parentNode.removeChild(lista);

}