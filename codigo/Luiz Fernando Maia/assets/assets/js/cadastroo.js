document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const usuario = {
            nomeCompleto: document.getElementById('fullname').value,
            nomeUsuario: document.getElementById('username').value,
            email: document.getElementById('email').value,
            dataNascimento: document.getElementById('birthdate').value,
            senha: document.getElementById('password').value
        };
        
        
        if (!validarCampos(usuario)) {
            return;
        }
        
        
        armazenarLocalmente(usuario);
        
        
        enviarParaJSON(usuario);
    });
    
    function validarCampos(usuario) {
        if (!usuario.nomeCompleto || !usuario.nomeUsuario || !usuario.email || !usuario.dataNascimento || !usuario.senha) {
            alert('Por favor, preencha todos os campos!');
            return false;
        }
        
        if (usuario.senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return false;
        }
        
        if (!validarEmail(usuario.email)) {
            alert('Por favor, insira um e-mail válido!');
            return false;
        }
        
        return true;
    }
    
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function armazenarLocalmente(usuario) {
        
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        
        const usuarioExistente = usuarios.find(u => u.email === usuario.email || u.nomeUsuario === usuario.nomeUsuario);
        
        if (usuarioExistente) {
            alert('Este e-mail ou nome de usuário já está cadastrado!');
            return;
        }
        
        
        usuarios.push(usuario);
        
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        alert('Cadastro realizado com sucesso!');
        formCadastro.reset();
    }
    
    function enviarParaJSON(usuario) {
        
        console.log('Dados para enviar ao JSON:', usuario);
        
        
        if (!window.usuariosJSON) {
            window.usuariosJSON = [];
        }
        window.usuariosJSON.push(usuario);
        

    }
});