window.addEventListener("load", iniciar);

const key = "07880df945ae318d79416922e15e7c11";

function iniciar(){
   
  fetch("https://rebrickable.com/api/v3/lego/minifigs/?key="+key)
      .then(response => response.json())
      .then(data => {

      data.results.forEach(figuras => {
        
        let tarjeta = `
          <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
            <div class="card" style="width: 18em;">
              <div class="bg-light contenedorImagen">
                ${comprobarImagen(figuras.set_img_url)}
              </div>
              <div class="card-body mt-3">
                <h5 class="card-title ">${figuras.name}</h5>
                <p class="card-text ">Numero de partes: ${figuras.num_parts}</p>
                <p class="card-text ">ID#${figuras.set_num}</p>
              </div>
            </div>
          </div>`;

        document.getElementById('catalogo').innerHTML += tarjeta;
    });
   
  }).catch(function (ex) {
    console.error('Error', ex.message)
  })

}

function getSetsBusqueda(busqueda="") {
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

function comprobarImagen(valor){
  if(valor!=null){
    return  `<img src="`+valor+`" class="card-img-top">`;
  }else{
    return  `<img src="../Imagenes/LegoVacio.png" class="card-img-top">`;
  }
}

//getSetsBusqueda();



