let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function agregarCarrito(productoNuevo) {
    const existente = carrito.find(p => p.nombre === productoNuevo.nombre)
    if (existente) {
        existente.cantidad += 1;
    }
    else {
        productoNuevo.cantidad = 1;
        carrito.push(productoNuevo);
    }
    guardarCarrito();
    actualizarCarrito();
}


function actualizarCarrito() {
    const cuenta = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    const carritoCuenta = document.getElementById("carrito-cuenta");

    if (carritoCuenta) {
        carritoCuenta.textContent = cuenta;
    }

}

actualizarCarrito();

