document.getElementById("form-cadastro").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do form

    const nomeBloco = document.getElementById("fullname").value.trim();
    const nomeResponsavel = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const cnpj = document.getElementById("cnpj").value.trim();
    const senha = document.getElementById("password").value.trim();

    // Verificação de campos vazios
    if (!nomeBloco || !nomeResponsavel || !email || !cnpj || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const dadosBloco = {
        nomeBloco: nomeBloco,
        responsavel: nomeResponsavel,
        email: email,
        cnpj: cnpj,
        senha: senha
    };

    fetch("http://localhost:3000/blocos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosBloco)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar bloco");
        }
        alert("Bloco cadastrado com sucesso!");
        // Limpa os campos do formulário
        document.getElementById("form-cadastro").reset();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao cadastrar o bloco.");
    });
});


function aplicarMascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, ''); 
    if (valor.length > 14) {
        valor = valor.slice(0, 14);
    }

    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    input.value = valor;
}

document.getElementById('cnpj').addEventListener('input', function () {
    aplicarMascaraCNPJ(this);
});
