document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById('form-register');
    const formLogin = document.getElementById('form-login');
    const registerMessage = document.getElementById('registerMessage');
    const loginMessage = document.getElementById('loginMessage');
    const rememberCheckbox = document.getElementById('check');
    
    // Registro de usuario
    formRegister.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar recarga de la página

        const newUsername = document.getElementById('newUser').value;
        const newPassword = document.getElementById('newPass').value;
        

        if (newUsername && newPassword) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.username === newUsername);
            
            if (userExists) {
                registerMessage.textContent = 'El usuario ya existe. Prueba con otro.';

            } else {
                users.push({ username: newUsername, password: newPassword });
                localStorage.setItem('users', JSON.stringify(users));
                registerMessage.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
            }
            
        } else {
            registerMessage.textContent = 'Por favor, completa todos los campos.';
        }
        
    });
    
    // Login de usuario
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar recarga de la página

        const username = document.getElementById('user').value;
        const password = document.getElementById('pass').value;
        const remember = rememberCheckbox.checked;
        

        if (username && password) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userFound = users.find(user => user.username === username && user.password === password);
            
            if (userFound) {
                loginMessage.textContent = 'Inicio de sesión exitoso. Bienvenido ' + username + '!';
                loginMessage.style.color = 'green';
                window.location.href = './pages/principal.html';
            } else {
                loginMessage.textContent = 'Usuario o contraseña incorrectos.';
            }
            if (remember) {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                localStorage.setItem('remember', true);
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                localStorage.setItem('remember', false);
            }
        } else {
            loginMessage.textContent = 'Por favor, completa todos los campos.';
        }
    });
});

