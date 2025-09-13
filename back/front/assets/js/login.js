document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.username.value;
        const password = form.password.value;

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
    const datos = await response.json(); // el backend debería enviarte usuario

    // Guardamos en localStorage
    localStorage.setItem("usuarioLogueado", JSON.stringify(datos));

    // Login exitoso, redirige al dashboard
        window.location.href = './dashboard.html';
        } else {
         message.textContent = 'Correo o contraseña incorrectos';
        message.style.display = 'block';
        }
        } catch (error) {
            message.textContent = 'Error de conexión con el servidor';
            message.style.display = 'block';
        }
    });
});