// PASO 3
const cards = document.getElementById('cards')
// console.log(cards)
// PASO 9
const itemsCarrito = document.getElementById('items-carrito')
const footer = document.getElementById('footer')
// PASO 3.1
const templateCard = document.getElementById('template-card').content
// console.log(templateCard)
// PASO 8
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

// PASO 3.2
const fragment = document.createDocumentFragment()
// PASO 5.1
let carrito = {}

// PASO 2
document.addEventListener('DOMContentLoaded', (e) => {
    fetchData()
    // console.log(e)

    // PASO 14
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito(carrito)
    }
})

// PASO1
const fetchData = async() => {
    try {
      const res =  await fetch('api.json')
      const data = await res.json()
      pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

// PASO 5
// Event Delgation
cards.addEventListener('click',(e) => {
   addCarrito(e)
})

// PASO 12
itemsCarrito.addEventListener('click', (e) => {
    // console.log(e.target)
    btnAccion(e)
})

// PASO 4
const pintarCards = (data) => {
    console.log('Data principal',data)
        data.forEach( (producto) => {
            // console.log('Recorriendo la data con forEach',producto)

            const clone = templateCard.cloneNode(true)
            clone.querySelector('h5').textContent = producto.title
            clone.querySelector('p').textContent = producto.precio
            clone.querySelector('#card-img-top').setAttribute('src', producto.thumbnailUrl)
            clone.querySelector('.btn-dark').dataset.id = producto.id

            
            fragment.appendChild(clone)
        });

    cards.appendChild(fragment)
} 


// PASO 6
const addCarrito = (e) => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))

    if(e.target.classList.contains('btn-dark')){
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }

    e.stopPropagation()
} 

// PASO 7
const setCarrito = (objeto) => {
    // console.log('Este es el objeto padre',objeto)
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        title : objeto.querySelector('h5').textContent,
        precio : objeto.querySelector('p').textContent,
        cantidad : 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}

    // console.log(producto)
    // console.log('este el nuevo objeto llamado carrito',carrito)

    pintarCarrito(carrito)

}

// PASO 10
const pintarCarrito = (carrito) => {
    // console.log(carrito)
    // Para que no se ripitan los elemntos hay que partir en vacio
    itemsCarrito.innerHTML = ''

    Object.values(carrito).forEach((productoCarrito) => {
        // console.log('Este es el Producto Carrito',productoCarrito)
        templateCarrito.querySelector('th').textContent = productoCarrito.id
        templateCarrito.querySelector('.title1').textContent = productoCarrito.title
        templateCarrito.querySelector('.cant').textContent = productoCarrito.cantidad
        
        templateCarrito.querySelector('.btn-info').dataset.id = productoCarrito.id
        templateCarrito.querySelector('.btn-danger').dataset.id = productoCarrito.id

        templateCarrito.querySelector('span').textContent = productoCarrito.cantidad * productoCarrito.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    itemsCarrito.appendChild(fragment)

    pintarFooter()

    // PASO 15
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// PASO 11
const pintarFooter = () =>{
    footer.innerHTML = ''

    if(Object.keys(carrito).length === 0 ){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }

    const nCantidad = Object.values(carrito).reduce((acum , {cantidad}) => acum + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acum , {cantidad , precio}) => acum + cantidad * precio  ,0)
    // console.log('nCantidad',nCantidad)
    // console.log('nPrecio',nPrecio)

    templateFooter.querySelector('.td1').textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    
    btnVaciar.addEventListener('click', () => {
       carrito = {}
       pintarCarrito(carrito)
    })
}

// PASO 13
const btnAccion = (e) => {
    // console.log(e.target)
    if(e.target.classList.contains('btn-info')){
    //    console.log(carrito[e.target.dataset.id]) 

       const producto = carrito[e.target.dataset.id]
    //    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        producto.cantidad++
       carrito[e.target.dataset.id] = {...producto}

       pintarCarrito(carrito)
    }

    if(e.target.classList.contains('btn-danger')){
        // console.log(carrito[e.target.dataset.id]) 
 
        const producto = carrito[e.target.dataset.id]
        // producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]  
        }

        pintarCarrito(carrito)
     }

    e.stopPropagation()
}