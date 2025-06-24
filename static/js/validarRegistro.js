const formulario = document.getElementById('formulario')

formulario.addEventListener('submit', function (e) {
   
    
    const usuarioValido = validarUsuario()
    const contraseñaValida = validarContraseña()
    const emailValido = validarEmail()
    const numeroValido = validarNumero()
    
    if(usuarioValido && contraseñaValida && emailValido && numeroValido){
        mostrarRegistroExitoso()
        formulario.submit();
    }else{
        e.preventDefault();
    }
})

function validarUsuario() {
    const nombreUsuario = document.getElementById('user-name').value.trim()
    const error = document.getElementById('user-name-error')
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{4,}$/;

    if (nombreUsuario == '') {
        error.textContent = 'Este campo es obligatorio'
        return false
    }else if(!regex.test(nombreUsuario)){
        error.textContent = 'Debe tener al menos 5 caracteres'
        return false
    }else{
        error.textContent = ''
        return true
    }
}

document.getElementById('user-name').addEventListener('input', validarUsuario)

function validarContraseña(){
    const pass1 = document.getElementById('password').value
    const pass2 = document.getElementById('password2').value
    const error1 = document.getElementById('error-password')
    const error2 = document.getElementById('error-password2')
    const regex = /^[a-zA-Z0-9]{5,}$/

    if(pass1 === ''){
        error1.textContent = 'Este campo es obligatorio'
        return false
    }else if(!regex.test(pass1)){
        error1.textContent = 'La contraseña debe ser alfanumerica'
        return false
    }else if(pass2 != pass1){
        error2.textContent = 'Las contraseñas no coinciden'
        return false
    }else if(pass2 === ''){
        error2.textContent = 'Debe repetir contraseña'
        return false
    }else if(pass1 === pass2){
        error1.textContent = ''
        error2.textContent = ''
        return true
    }else if(regex.test(pass1)){
        error1.textContent = ''
        return true
    }
}

document.getElementById('password').addEventListener('blur', validarContraseña)
document.getElementById('password2').addEventListener('input', validarContraseña)

function validarEmail(){
    const email = document.getElementById('email').value
    const error = document.getElementById('email-error')
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(email === ''){
        error.textContent = 'Este campo es obligatorio'
        return false
    }else if(!regex.test(email)){
        error.textContent = 'E-Mail invalido'
        return false
    }else{
        error.textContent = ''
        return true
    }
}

document.getElementById('email').addEventListener('input', validarEmail)

function validarNumero(){
    const telefono = document.getElementById('telefono').value
    const error = document.getElementById('telefono-error')
    const regex = /^\+?\d{1,3}?[-.\s]?(\(?\d{1,4}\)?)[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/

    if(telefono === ''){
        error.textContent = 'Debe ingresar un numero de contacto'
        return false
    }else if(isNaN(telefono)){
        error.textContent = 'Numero invalido'
        return false
    }else if(!regex.test(telefono)){
        error.textContent = 'Numero invalido'
        return false
    }else{
        error.textContent = ''
        return true
    }
}

document.getElementById('telefono').addEventListener('input', validarNumero)