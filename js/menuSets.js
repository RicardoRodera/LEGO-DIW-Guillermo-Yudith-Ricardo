window.addEventListener("load", init);
const key = "07880df945ae318d79416922e15e7c11"
const temas = [];

function init(){
    //document.getElementById("btnBuscar").addEventListener("click", buscar);
    //document.getElementById("tema").addEventListener("input", autocompletar);
    getTemas();
    console.log(temas);
    
}

function getTemas(){
    let listaTemas = [];
    fetch("https://rebrickable.com/api/v3/lego/themes/?key=" + key, { method: 'get' })
    .then(function (respuesta) {
        return respuesta.json()
    })
    .then(function (jsonData) {
        //console.log(jsonData.results);
        for (let i = 0; i < jsonData.results.length; i++) {
            temas.push(jsonData.results[i].name);
        }
    })
    .catch(function (ex) {
        console.error('Error', ex.message)
    })
}

function buscar(){

}

function autocompletar(){

}



