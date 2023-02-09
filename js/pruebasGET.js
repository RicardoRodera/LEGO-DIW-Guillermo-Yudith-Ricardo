//Key necesaria para todos los fetchs, ponerla al final de la uri.
const key = "07880df945ae318d79416922e15e7c11"

//Datos de inicio de sesion privados para obtener el token de usuario
//El token de usuario es necesario para poder hacer peticiones relacionadas con guardar
//datos en la cuenta o visualizarlos.
const usuario = "apilegoJGR";
const contraseña = "contraseña";

function getSets(busqueda = "") {
    fetch("https://rebrickable.com/api/v3/lego/sets/?search=" + busqueda + "&key=" + key, { method: 'get' })
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (jsonData) {
            for (let i = 0; i < jsonData.count; i++) {
                setJson = jsonData.results[i];
                console.log("Nombre del set: " + setJson.name);
                console.log("Año de salida del set: " + setJson.year);
                console.log("Imagen del set: " + setJson.set_img_url);
            }
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}

function getToken() {
    const opciones = {
        method: 'get',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': key
        },
        //body: 'username=apilegoJGR&password=password'
    }
    fetch("https://rebrickable.com/api/v3/users/_token/?username=apilegoJGR&password=password", opciones)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (jsonData) {
            return (jsonData);
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}


console.log(getToken());
<<<<<<< HEAD
//getSets("frozen");
=======
getSets("frozen");
>>>>>>> 88722325921ec6a2fead1497e310a4d55692fc0b
