document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const nomeBloco = document.getElementById("fullname").value;
  const nomeOrg = document.getElementById("username").value;
  const emailOrg = document.getElementById("email").value;
  const cnpj = document.getElementById("cnpj").value;
  const senha = document.getElementById("password").value;

  try {
    // Primeiro, pega todos os blocos existentes
    const resposta = await fetch("http://localhost:3000/blocos");
    const blocos = await resposta.json();

    // Encontra o maior ID atual
    const ultimoId = blocos.length > 0
      ? Math.max(...blocos.map(bloco => Number(bloco.id)))
      : 0;

    const novoId = ultimoId + 1;

    const novoBloco = {
      id: novoId,
      nome_bloco: nomeBloco,
      descricao_geral: "",
      avaliacao: "",
      data: "",
      publico: "",
      cep: "",
      endereco: "",
      faixa_etaria: "",
      lat: "",
      lng: "",
      estilo_musical: "",
      organizador: [
        {
          nome_org: nomeOrg,
          email_org: emailOrg,
          cnpj: cnpj,
          senha: senha
        }
      ],
      postagem: [
        {
          descricao_card: "",
          imagens: [
            { id: 1, src: "" },
            { id: 2, src: "" },
            { id: 3, src: "" },
            { id: 4, src: "" }
          ]
        }
      ]
    };

    
    const respostaPost = await fetch("http://localhost:3000/blocos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoBloco)
    });

    if (respostaPost.ok) {
      alert("Bloco cadastrado com sucesso!");
    } else {
      alert("Erro ao cadastrar bloco.");
    }
  } catch (erro) {
    console.error("Erro ao cadastrar bloco:", erro);
    alert("Erro na conexão com o servidor.");
  }
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
