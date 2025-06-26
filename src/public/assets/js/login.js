// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão disponíveis na seguinte URL
// https://jsonserver.rommelpuc.repl.co/usuarios
//
// Para fazer o seu servidor, acesse o projeto do JSONServer no Replit, faça o 
// fork do projeto e altere o arquivo db.json para incluir os dados do seu projeto.
// URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 29/04/2024
//
// Código LoginApp  


// Página inicial de Login
const LOGIN_URL = "login.html";
const apiUser = '/usuarios';
const apiBloco = '/blocos'

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = {};
var db_blocos = {};

// Objeto para o usuário corrente
var usuarioCorrente = {};

// função para gerar códigos randômicos a serem utilizados como código de usuário
// Fonte: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
/*
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


// Dados de usuários para serem utilizados como carga inicial
const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "login": "admin", "senha": "123", "nome": "Administrador do Sistema", "email": "admin@abc.com" },
        { "id": generateUUID(), "login": "user", "senha": "123", "nome": "Usuario Comum", "email": "user@abc.com" },
    ]
};
*/

// Inicializa o usuarioCorrente e banco de dados de usuários da aplicação de Login
function initLoginApp() {
    // PARTE 1 - INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }

    // PARTE 2 - INICIALIZA BANCO DE DADOS DE USUÁRIOS
    fetch(apiUser)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            displayMessage("Erro ao ler usuários");
        });

    // PARTE 2 - INICIALIZA BANCO DE DADOS DE ORGANIZADORES DE BLOCOS
    fetch(apiBloco)
        .then(response => response.json())
        .then(data => {
            db_blocos = data;
        })
        .catch(error => {
            console.error('Erro ao ler organizadores via API JSONServer:', error);
            displayMessage("Erro ao ler organizadores");
        });
};

// Declara uma função para processar o formulário de login
function processaFormLogin(event) {
    // Cancela a submissão do formulário para tratar sem fazer refresh da tela
    event.preventDefault();

    // Obtem os dados de login e senha a partir do formulário de login
    var email = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Valida login e se estiver ok, redireciona para tela inicial da aplicação
    resultadoLogin = loginUser(email, password);
    if (resultadoLogin) {
        usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);

        if(usuarioCorrente.tipo === 'foliao'){
            window.location.href = 'mapablocos.html';
        }
        else{
            window.location.href = 'paginablocos.html';
        }
    }
    else { // Se login falhou, avisa ao usuário
        alert('Usuário ou senha incorretos');
    }
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser(login, senha) {

    // Verifica todos os itens do banco de dados de usuarios 
    // para localizar o usuário informado no formulario de login
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        // Se encontrou login, carrega usuário corrente e salva no Session Storage
        if (login == usuario.email && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome_completo;
            usuarioCorrente.tipo = 'foliao';

            // Salva os dados do usuário corrente no Session Storage, mas antes converte para string
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

            // Retorna true para usuário encontrado
            return true;
        }
    }

    for (var i = 0; i < db_blocos.length; i++) {
            var bloco = db_blocos[i];
            var organizador = bloco.organizador[0];

            if (login == organizador.email_org && senha == organizador.senha) {
                usuarioCorrente.id = bloco.id;
                usuarioCorrente.cnpj = organizador.cnpj;
                usuarioCorrente.email = organizador.email_org;
                usuarioCorrente.nome = organizador.nome_org;
                usuarioCorrente.tipo = 'organizador';

                // Salva os dados do usuário corrente no Session Storage, mas antes converte para string
                sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

                // Retorna true para usuário encontrado
                return true;
            }
        }
    // Se chegou até aqui é por que não encontrou o usuário e retorna falso
    return false;
}

// Apaga os dados do usuário corrente no sessionStorage
function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location = LOGIN_URL;
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp();

/*
function salvaLogin(event) {
    // Cancela a submissão do formulário para tratar sem fazer refresh da tela
    event.preventDefault();
    window.location.href = '';
}
*/

document.getElementById('login-form').addEventListener('submit', processaFormLogin);
// Associar salvamento ao botao
//document.getElementById('btn_salvar').addEventListener('click', salvaLogin); 