// Crear o recuperar usuario
function enter() {
    const email = document.getElementById("email").value.trim();

    // Validación: campo vacío
    if (!email) {
        showModal("Debes ingresar un correo.");
        return;
    }

    // Validación: solo Gmail o Hotmail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

    if (!emailRegex.test(email)) {
        showModal("Por favor ingresa un correo válido de <b>Gmail</b> o <b>Hotmail</b>.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("pondke_users")) || {};

    // Si el usuario NO existe → se crea
    if (!users[email]) {
        users[email] = {
            coins: 0,
            used: []
        };
        showModal("Usuario creado exitosamente.");
    } 
    // Si el usuario ya existe
    else {
        showModal("Bienvenido de nuevo.");
    }

    // Guardar usuario
    localStorage.setItem("pondke_users", JSON.stringify(users));
    localStorage.setItem("pondke_current", email);

    // Redirigir después de cerrar el modal
    setTimeout(() => {
        window.location.href = "code.html";
    }, 1500);
}


// -------------------------------
//        FUNCIONES DEL MODAL
// -------------------------------

function showModal(message) {
    document.getElementById("modal-text").innerHTML = message;
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Cerrar clic fuera
window.onclick = function(event) {
    if (event.target === document.getElementById("modal")) {
        closeModal();
    }
}

