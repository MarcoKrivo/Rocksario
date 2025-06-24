document.addEventListener('DOMContentLoaded', function () {

    const login = document.getElementById('loginForm')

    localStorage.removeItem('carrito');

    login.addEventListener('submit', function (e) {


        const userLogin = validarUsuario()
        const passLogin = validarContraseña()

        if (!userLogin || !passLogin) {
            e.preventDefault()
        }

    })

    function validarUsuario() {
        const usuario = document.getElementById('username').value.trim()
        const error = document.getElementById('user-error')
        const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{4,}$/;


        if (usuario === '') {
            error.textContent = 'Ingresar nombre de usuario o usuario invalido'
            return false
        } else if (!regex.test(usuario)) {
            error.textContent = 'Usuario invalido'
            return false
        } else {
            error.textContent = ''
            return true
        }

    }

    document.getElementById('username').addEventListener('input', validarUsuario)

    function validarContraseña() {
        const loginPass1 = document.getElementById('password').value
        const regex = /^[a-zA-Z0-9]{5,}$/
        const error1 = document.getElementById('pass-error')

        if (loginPass1 === '') {
            error1.textContent = 'Debe ingresar contraseña o contraseña invalida'
            return false
        } else if (!regex.test(loginPass1)) {
            error1.textContent = 'La contraseña debe ser alfanumerica'
            return false
        }
        else {
            error1.textContent = ''
            return true
        }
    }
    document.getElementById('password').addEventListener('blur', validarContraseña)


    const alerta = document.getElementById('alerta-error');

    if (alerta) {
        setTimeout(() => {
            alerta.style.opacity = '0';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 500)
        }, 3000)
    }

})