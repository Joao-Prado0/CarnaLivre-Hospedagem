document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    
    // Inicializa o LocalStorage se estiver vazio
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify({
            usuarios: []
        }));
    }

    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Captura dos dados do formulário
        const usuario = {
            id: Date.now(), // Usa o timestamp como ID único
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
            // Recupera os usuários do LocalStorage
            const db = JSON.parse(localStorage.getItem('usuarios'));
            
            // Verifica se o e-mail já existe
            const emailExistente = db.usuarios.some(u => u.email === usuario.email);
            
            if (emailExistente) {
                alert('Este e-mail já está cadastrado!');
                return;
            }
            
            // Adiciona o novo usuário
            db.usuarios.push(usuario);
            
            // Salva no LocalStorage
            localStorage.setItem('usuarios', JSON.stringify(db));
            
            alert('Cadastro realizado com sucesso!');
            formCadastro.reset();
            
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