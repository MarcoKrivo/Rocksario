let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function mostrarCarrito(){
    const lista = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total-carrito");
    const totalContainer = document.getElementById("total-carrito-container");

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, indice) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <img src="${producto.imagen}" style="width: 50px; height: auto; margin-ringht: 10px;">
        <span>${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad}</span>
        <button onclick="aumentarCantidad(${indice})">+</button>
        <button onclick="disminuirCantidad(${indice})">-</button>
        <button onclick="eliminarProducto(${indice})">Eliminar</button>`;

        lista.appendChild(li);
        total += producto.precio * producto.cantidad;

    });


    totalSpan.textContent = total.toFixed(2);

    const carritoCuenta = document.getElementById("carrito-cuenta");
    const cuenta = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    if (carritoCuenta) {
        carritoCuenta.textContent = cuenta;
    }

    if (carrito.length > 0) {
        totalContainer.style.display = "block";
    } else {
        totalContainer.style.display = "none";
    }
}

function aumentarCantidad(indice) {
    carrito[indice].cantidad++;
    guardarCarrito();
    mostrarCarrito();
}

function disminuirCantidad(indice) {
    if (carrito[indice].cantidad > 1){
        carrito[indice].cantidad--;
} else {
    carrito.splice(indice, 1);
}
    guardarCarrito();
    mostrarCarrito();
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

function comprarYredirigir(){
console.log("Función comprarYRedirigir() llamada");
   
    localStorage.removeItem("carrito");
    carrito = [];
    mostrarCarrito();

    const mensajeCarrito = document.getElementById("mensaje-compra");
    
    if(mensajeCarrito) {
        mensajeCarrito.innerHTML = "<li>Compra éxitosa</li>";
        mensajeCarrito.style.display = "block"
    }

    setTimeout(() =>{
        window.location.href = "/";
    }, 3000);
}

window.onload = mostrarCarrito;
