const previsaoURL = 'https://api.openweathermap.org/data/2.5/weather?q=Belo%20Horizonte,BR&appid=aa3b1ae55071f47063e72e1dc41f471d&units=metric&lang=pt_br';

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
    carregarClima();
})