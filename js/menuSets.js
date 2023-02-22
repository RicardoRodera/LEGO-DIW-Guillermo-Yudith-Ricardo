window.addEventListener("load", init);
const key = "07880df945ae318d79416922e15e7c11"
//Creo un mapa en el que guardaré los temas de los distintos sets para mostrar las sugerencias
const temas = new Map();
const colores = ["rojo", "azul", "verde", "amarillo"];
const token = "f3de130738d80208e4f588622bcb535195ec25bf441967b0020502ea0fe91f23";
let color = 0;

var tamPagina = 16;
var paginaActual = 1;
var totalFiguras = 0;
var search = false;

//Lleno el mapa y añado los listeners
function init() {
    document.getElementById("btnBuscar").addEventListener("click", buscar);
    document.getElementById("buscarTemas").addEventListener("input", autocompletar);
    document.querySelector("#anterior").addEventListener("click", pulsaAnterior);
    document.querySelector("#siguiente").addEventListener("click", pulsaSiguiente);

    setTimeout(() => {
        document.getElementById("spinner").hidden = true;
        getTemas();
        buscar();
    }, 300);

}

//Los temas estan en un map, que tiene en cada posicion el nombre y el id de cada tema.
//Aqui se hace la llamada a la API que los obtiene
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


//Esta funcion es la que recibe los datos del formulario y hace la llamada a la API en consonancia
function buscar() {
    paginaActual=1;
    search = true;
    document.getElementById("error").classList.add("d-none");
    mostrarBusqueda();

}

function mostrarBusqueda() {
    let busqueda = document.querySelector("#buscarSets").value;
    let anio = document.querySelector("#buscarAnno").value;
    let piezas = document.querySelector("#buscarPiezas").value;
    let temaValidacion = document.querySelector("#buscarTemas").value;
    let tema = document.querySelector("#buscarTemas").value != "" ? temas.get(document.querySelector("#buscarTemas").value) : "";
    let existeError = detectorErrores(1,temaValidacion, piezas,anio);

    document.getElementById("catalogo").innerHTML = "";
    if(existeError==false){
        fetch("https://rebrickable.com/api/v3/lego/sets/?search=" + busqueda + "&page_size=99999&theme_id=" + tema + "&min_year=" + anio + "&max_year=" + anio + "&min_parts=" + piezas + "&max_parts=" + piezas + "&key=" + key, { method: 'get' })
            .then(function (respuesta) {
                return respuesta.json()
            })
            .then(function (jsonData) {
                console.log(jsonData)
            
                totalFiguras = jsonData.results.length;
                detectorErrores(totalFiguras,temaValidacion, piezas,anio);
                jsonData.results.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina).forEach((setJson) => {
                    
                    let tarjeta = `
                        <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
                            <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
                                <div class="bg-light contenedorImagen">
                                    ${comprobarImagen(setJson.set_img_url)}
                                </div>
                                <div class="card-body mt-3">
                                    <h5 class="card-title text-light">${setJson.name}</h5>
                                    <p class="card-text text-light">Año: ${setJson.year}</p>
                                    <p class="card-text text-light">Numero de piezas: ${setJson.num_parts}</p>
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
}

function detectorErrores(totalFiguras,temaValidacion,piezas,anio){
    const num = parseFloat(piezas);
    const anioVal = parseFloat(anio);

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
   }else if((isNaN(anioVal)) && search==true && anio!=""){
    document.getElementById("error").classList.remove("d-none");
    document.getElementById("error").innerHTML="El año no es un numero";
    document.querySelector("#siguiente").classList.add("disabled");
    return true;
   }
 
   return false;
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


function actualizaPaginacion() {

    if (totalFiguras < 16) {
        document.querySelector("#anterior").classList.add("disabled");
        document.querySelector("#siguiente").classList.add("disabled");
    } else if (paginaActual == 1) {
        document.querySelector("#anterior").classList.add("disabled");
        document.querySelector("#siguiente").classList.remove("disabled");
    } else if (paginaActual == Math.ceil(totalFiguras / tamPagina)) {
        document.querySelector("#siguiente").classList.add("disabled");
        document.querySelector("#anterior").classList.remove("disabled");
    } else {
        document.querySelector("#anterior").classList.remove("disabled");
        document.querySelector("#siguiente").classList.remove("disabled");
    }
}


function comprobarImagen(valor) {
    if (valor != null) {
        return `<img src="` + valor + `" class="card-img-top">`;
    } else {
        return `<img src="../Imagenes/piezasLego.jpg" class="card-img-top">`;
    }
}



function pulsaAnterior() {
    paginaActual--;
    mostrarBusqueda();
}

function pulsaSiguiente() {
    paginaActual++;
    mostrarBusqueda();
}

function guardar(e) {
    let setNum = (e.value);
    const opciones = {
        method: 'post',
        body: "set_num=" + setNum,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': "key " + key
        },
    }
    fetch("https://rebrickable.com/api/v3/users/" + token + "/sets/", opciones)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (jsonData) {
            console.log("Exito");
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}


