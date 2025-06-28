const previsaoURL = 'https://api.openweathermap.org/data/2.5/weather?q=Belo%20Horizonte,BR&appid=aa3b1ae55071f47063e72e1dc41f471d&units=metric&lang=pt_br';
const LOGIN_URL = 'login.html';

const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
let usuarioCorrente = null;

if (usuarioCorrenteJSON) {
    try {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    } catch (e) {
        console.warn("Erro ao fazer parse do usuarioCorrente:", e);
    }
}

if (!usuarioCorrente) {
    window.location.href = LOGIN_URL;
}



function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.removeItem('usuarioCorrente');
    window.location = LOGIN_URL;
}

async function carregarClima() {
    try {
        const response = await fetch(previsaoURL);
        const data = await response.json();

        if (response.ok) {
            // Extrai temperatura e descrição
            const temperatura = data.main.temp.toFixed(1);
            const descricao = data.weather[0].description;

            // Atualiza o HTML
            document.getElementById('addTemp').innerHTML = `${temperatura}°C`;
            document.getElementById('addDesc').innerHTML = `${descricao}`;
        } else {
            throw new Error(data.message || "Erro ao carregar dados");
        }
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('addTemp').innerHTML = "Erro ao carregar temperatura.";
        document.getElementById('addDesc').innerHTML = "Tente recarregar a página.";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Associa a função de logout ao botão
    document.getElementById('btn_logout').addEventListener('click', logoutUser);
    carregarClima();

    if(usuarioCorrente.tipo == 'organizador'){
        const iconeMensagem = document.querySelector('.fa-message');
        const itemDaLista = iconeMensagem.closest('li');
        itemDaLista.style.display = 'none';
    }
})