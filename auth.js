// auth.js - Sistema de autenticação (CASE INSENSITIVE)
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            fazerLogin();
        });
    }
    
    const user = localStorage.getItem('geoscan_user');
    if (user && window.location.pathname.includes('index.html')) {
        window.location.href = 'pages/dashboard-inicio.html';
    }
    
    // Mostrar nome do usuário no dashboard
    const userInfo = document.getElementById('userInfo');
    if (userInfo && window.location.pathname.includes('dashboard')) {
        const userData = JSON.parse(localStorage.getItem('geoscan_user') || '{"nome":"Administrador"}');
        const p = userInfo.querySelector('p');
        if (p) p.textContent = userData.nome;
    }
});

function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Converter para minúsculas (case insensitive)
    const usernameLower = username.toLowerCase().trim();
    
    const usuarios = [
        { user: 'admin', pass: 'geoscan2026', nome: 'Administrador' },
        { user: 'ambrosio', pass: 'zambote2026', nome: 'Ambrósio Zambote' },
        { user: 'cristiano', pass: 'massamba2026', nome: 'Cristiano Massamba' },
        { user: 'ditutala', pass: 'lando2026', nome: 'Ditutala Lando' },
        { user: 'edmilson', pass: 'daniel2026', nome: 'Edmilson Daniel' },
        { user: 'isabel', pass: 'quizembe2026', nome: 'Isabel Quizembe' },
        { user: 'mechack', pass: 'ilandia2026', nome: 'Mechack Ilandia' }
    ];
    
    if (!username || !password) {
        errorDiv.classList.add('show');
        errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Preencha usuário e senha!';
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
        return;
    }
    
    // Comparação case insensitive
    const usuario = usuarios.find(u => 
        u.user.toLowerCase() === usernameLower && 
        u.pass === password
    );
    
    if (usuario) {
        localStorage.setItem('geoscan_user', JSON.stringify({
            nome: usuario.nome,
            username: usuario.user,
            loginTime: new Date().toISOString()
        }));
        window.location.href = 'pages/dashboard-inicio.html';
    } else {
        errorDiv.classList.add('show');
        errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Usuário ou senha incorretos!';
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }
}

function logout() {
    localStorage.removeItem('geoscan_user');
    window.location.href = '../index.html';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// Função para mostrar/ocultar senha
function toggleSenha() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}