import { Usuarios } from "../../services/blocos-services.js";
const usuarioService = new Usuarios();

document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    const jsonServerUrl = 'http://localhost:3000/usuarios';

    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            // Captura dos dados do formulário
            const nome_completo = document.getElementById('fullname').value;
            const login = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const data_nasc = document.getElementById('birthdate').value;
            const senha = document.getElementById('password').value;

            const usuarioSemId = {
                nome_completo,
                login,
                email,
                data_nasc,
                senha
            };

            // Validação básica
            if (!validarCampos(usuarioSemId)) {
                return;
            }

            // Verifica se o e-mail já existe no JSON Server
            const responseVerificaEmail = await fetch(`${jsonServerUrl}?email=${encodeURIComponent(email)}`);
            if (!responseVerificaEmail.ok) {
                throw new Error(`Erro ao verificar e-mail: ${responseVerificaEmail.statusText}`);
            }
            const usuariosComEmail = await responseVerificaEmail.json();

            if (usuariosComEmail.length > 0) {
                alert('Este e-mail já está cadastrado!');
                return;
            }

            // Buscar todos os usuários para encontrar o maior ID
            const responseTodosUsuarios = await usuarioService.getUsuarios();
            if (!responseTodosUsuarios.ok) {
                throw new Error(`Erro ao buscar usuários: ${responseTodosUsuarios.statusText}`);
            }
            const usuarios = await responseTodosUsuarios.json();

            const maiorId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0;

            const usuario = {
                id: maiorId + 1,  // <<< Forçando ID sequencial
                ...usuarioSemId
            };

            // Adiciona o novo usuário via POST request
            const responseCadastro = await usuarioService.novoUsuario(usuario);

            if (!responseCadastro.ok) {
                const errorData = await responseCadastro.json().catch(() => null);
                const errorMessage = errorData ? JSON.stringify(errorData) : responseCadastro.statusText;
                throw new Error(`Erro ao cadastrar usuário: ${errorMessage}`);
            }

            alert(`Cadastro realizado com sucesso! ID gerado: ${usuario.id}`);
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