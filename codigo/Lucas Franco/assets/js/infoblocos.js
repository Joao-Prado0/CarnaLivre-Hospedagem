
$(document).ready(function () {

    const dadosSalvos = localStorage.getItem('dadosBloco');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        $('.nomeBloco').val(dados.nomeBloco);
        $('input[name="datahora"]').val(dados.dataHora);
        $('input[name="publico"]').val(dados.publico);
        $('input[name="cep"]').val(dados.cep);
        $('input[name="endereco"]').val(dados.endereco);
        $('input[name="faixaetaria"]').val(dados.faixaEtaria);
        $('input[name="estilo"]').val(dados.estiloMusical);
        $('input[name="descricao"]').val(dados.descricao);
        console.log('Dados anteriores carregados!');
    }

    $('#formInfo').submit(function (event) {
        event.preventDefault();

        const formData = {
            nomeBloco: $('.nomeBloco').val(),
            datahora: $('input[name="datahora"]').val(),
            publico: $('input[name="publico"]').val(),
            cep: $('input[name="cep"]').val(),
            endereco: $('input[name="endereco"]').val(),
            faixaEtaria: $('input[name="faixaetaria"]').val(),
            estiloMusical: $('input[name="estilo"]').val(),
            descricao: $('textarea[name="descricao"]').val()
        };

        if (!formData.nomeBloco || formData.nomeBloco === "Nome do bloco") {
            alert('Por favor, selecione o nome do bloco!');
            return;
        }

        if (!formData.cep || !formData.endereco) {
            alert('CEP e Endereço são obrigatórios!');
            return;
        }

        const jsonINFO = JSON.stringify(formData, null, 2);
        localStorage.setItem('dadosBloco', jsonINFO);

        alert('Dados do bloco salvos com sucesso!');
        console.log('Dados salvos:', formData);

        this.reset();
    });
});