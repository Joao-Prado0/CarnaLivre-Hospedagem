document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    const jsonServerUrl = 'http://localhost:3000/usuarios'; 

    formCadastro.addEventListener('submit', async function(e) { 
        e.preventDefault();
        
        // Captura dos dados do formulário
        const usuario = {
            // REMOVA ou COMENTE a linha abaixo:
            // id: String(Date.now()), 
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
            // Verifica se o e-mail já existe no JSON Server
            const responseVerificaEmail = await fetch(`${jsonServerUrl}?email=${encodeURIComponent(usuario.email)}`);
            if (!responseVerificaEmail.ok) {
                throw new Error(`Erro ao verificar e-mail: ${responseVerificaEmail.statusText}`);
            }
            const usuariosComEmail = await responseVerificaEmail.json();
            
            if (usuariosComEmail.length > 0) {
                alert('Este e-mail já está cadastrado!');
                return;
            }
            
            // Adiciona o novo usuário via POST request
            // O JSON Server irá gerar o ID automaticamente
            const responseCadastro = await fetch(jsonServerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario), // Enviando o objeto usuario SEM o campo 'id'
            });

            if (!responseCadastro.ok) {
                const errorData = await responseCadastro.json().catch(() => null); 
                const errorMessage = errorData ? JSON.stringify(errorData) : responseCadastro.statusText;
                throw new Error(`Erro ao cadastrar usuário: ${errorMessage}`);
            }
            
            // const novoUsuarioCadastrado = await responseCadastro.json(); 
            // console.log('Usuário cadastrado com ID gerado pelo servidor:', novoUsuarioCadastrado);

            alert('Cadastro realizado com sucesso! O ID foi gerado automaticamente.');
            formCadastro.reset();
            
        } catch (error) {
            console.error('Erro:', error);
            alert(`Ocorreu um erro ao cadastrar: ${error.message}. Verifique o console do navegador e se o JSON Server está rodando.`);
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
        return re.test(String(email).toLowerCase());
    }
});