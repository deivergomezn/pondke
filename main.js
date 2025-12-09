/* ============================================================
   UTILIDADES BÁSICAS
============================================================ */

function getCurrentUserEmail() {
    return localStorage.getItem("pondke_email");
}

function getUserData(email) {
    const data = localStorage.getItem("pondke_user_" + email);
    return data ? JSON.parse(data) : null;
}

function saveUserData(email, data) {
    localStorage.setItem("pondke_user_" + email, JSON.stringify(data));
}

/* ============================================================
   OBTENER CÓDIGO DESDE URL (QR)
============================================================ */

function getCodeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code"); // ej: ABC123
}

/* ============================================================
   ENVÍO DE CORREO AUTOMÁTICO CON EMAILJS
============================================================ */

function sendCodeEmail(email, code) {
    return emailjs.send("service_mz6ny8f", "template_53z69hb", {
        email: email,
        code: code
    });
}

/* ============================================================
   index.html — LOGIN Y PROCESO DE REGISTRO
============================================================ */

async function loginEmail() {
    const emailInput = document.getElementById("email").value.trim();
    if (!emailInput) return alert("Ingresa un email.");

    let user = getUserData(emailInput);

    if (!user) {
        user = { coins: 0, codesUsed: [] };
    }

    const code = getCodeFromURL(); // el QR envía el código
    if (code) {
        if (!user.codesUsed.includes(code)) {
            // sumar monedas
            user.coins += 10;
            user.codesUsed.push(code);

            // enviar correo AUTOMÁTICO
            try {
                await sendCodeEmail(emailInput, code);
            } catch (err) {
                console.error("Error enviando email:", err);
                alert("No se pudo enviar el correo. Intenta otra vez.");
                return;
            }
        }
    }

    // guardar cambios
    saveUserData(emailInput, user);

    // guardar email actual
    localStorage.setItem("pondke_email", emailInput);

    // redirigir al historial
    window.location.href = "code.html";
}

/* ============================================================
   code.html — MOSTRAR HISTORIAL + BOTÓN COMPRAR
============================================================ */

function loadUserData() {
    const email = getCurrentUserEmail();
    if (!email) return window.location.href = "index.html";

    const user = getUserData(email);
    updateUI(user);
}

function updateUI(user) {
    document.getElementById("coins").textContent = user.coins;

    document.getElementById("history").innerHTML = user.codesUsed
        .map(c => `<li>${c}</li>`)
        .join("");

    const buyBtn = document.getElementById("buyButton");
    if (buyBtn) {
        buyBtn.style.display = user.coins >= 100 ? "block" : "none";
    }
}
