document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    const API_URL = 'http://localhost:3000/usuarios'; // URL do JSON Server
    
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Captura dos dados do formulário e conversão para o formato desejado
        const usuario = {
            nome_completo: document.getElementById('fullname').value,
            login: document.getElementById('username').value,
            email: document.getElementById('email').value,
            data_nasc: document.getElementById('birthdate').value,
            senha: document.getElementById('password').value
        };
        
        // Validação básica
        if (!validarCampos(usuario)) {
            return;
        }
        
        try {
            // Verifica se o usuário já existe
            const response = await fetch(`${API_URL}?email=${usuario.email}`);
            const usuarios = await response.json();
            
            if (usuarios.length > 0) {
                alert('Este e-mail já está cadastrado!');
                return;
            }
            
            // Cadastra o novo usuário
            const cadastroResponse = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario)
            });
            
            if (cadastroResponse.ok) {
                alert('Cadastro realizado com sucesso!');
                formCadastro.reset();
            } else {
                throw new Error('Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao cadastrar. Tente novamente mais tarde.');
        }
    });
    
    function validarCampos(usuario) {
        if (!usuario.nome_completo || !usuario.login || !usuario.email || !usuario.data_nasc || !usuario.senha) {
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
});