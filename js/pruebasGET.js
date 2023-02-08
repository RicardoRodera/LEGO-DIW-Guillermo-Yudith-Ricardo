const key = "07880df945ae318d79416922e15e7c11"


function getSetsBusqueda(busqueda) {
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