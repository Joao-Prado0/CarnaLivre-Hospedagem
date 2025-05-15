$(document).ready(function () {
    const API_URL = "http://localhost:3000/blocos";
    let autocomplete;
    let blocosCache = [];

    // Autocomplete do Google Maps
    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("campo-endereco"),
            { types: ["geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const cep = place.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
            if (cep) {
                $('input[name="cep"]').val(cep.replace(/\D/g, ''));
            }
        });
    }

    async function carregarBlocos() {
        try {
            const response = await fetch(API_URL);
            blocosCache = await response.json();
            const select = $('.nomeBloco');

            select.empty().append('<option selected value="">Selecione um bloco</option>');
            blocosCache.forEach(bloco => {
                select.append(`<option value="${bloco.id}">${bloco.nome_bloco}</option>`);
            });
        } catch (error) {
            console.error("Erro ao carregar blocos:", error);
        }
    }

    // preenche os campos do formulario quando seleciona um bloco
    $(document).on('change', '.nomeBloco', async function() {
        const idBloco = $(this).val();
        if (!idBloco) {
            limparFormulario();
            return;
        }

        const blocoSelecionado = blocosCache.find(b => b.id == idBloco);
        if (!blocoSelecionado) return;

        $('textarea[name="descricao"]').val(blocoSelecionado.descricao_geral || '');
        $('input[name="datahora"]').val(formatarData(blocoSelecionado.data));
        $('input[name="publico"]').val(blocoSelecionado.publico || '');
        $('input[name="cep"]').val(blocoSelecionado.cep || '');
        $('#campo-endereco').val(blocoSelecionado.endereco || '');
        $('input[name="faixaetaria"]').val(blocoSelecionado.faixa_etaria ? blocoSelecionado.faixa_etaria.replace('+', '') : '');
        $('input[name="estilo"]').val(blocoSelecionado.estilo_musical || '');
    });

    function formatarData(dataString) {
        if (!dataString) return '';
        return dataString.includes('T') ? dataString : `${dataString}T00:00`;
    }

    function limparFormulario() {
        $('textarea[name="descricao"]').val('');
        $('input[name="datahora"]').val('');
        $('input[name="publico"]').val('');
        $('input[name="cep"]').val('');
        $('#campo-endereco').val('');
        $('input[name="faixaetaria"]').val('');
        $('input[name="estilo"]').val('');
    }

    $('#formInfo').submit(async function (event) {
        event.preventDefault();

        const idBloco = $('.nomeBloco').val();
        if (!idBloco) {
            alert("Selecione um bloco para editar!");
            return;
        }

        const blocoExistente = blocosCache.find(b => b.id == idBloco);
        if (!blocoExistente) {
            alert("Bloco não encontrado!");
            return;
        }

        const place = autocomplete.getPlace();
        const enderecoCompleto = place?.formatted_address || $('#campo-endereco').val();

        const dadosAtualizados = {
            ...blocoExistente, // Mantém todos os dados originais
            nome_bloco: $('.nomeBloco option:selected').text(),
            descricao_geral: $('textarea[name="descricao"]').val(),
            data: $('input[name="datahora"]').val().split('T')[0],
            publico: parseInt($('input[name="publico"]').val()) || 0,
            cep: $('input[name="cep"]').val(),
            endereco: enderecoCompleto,
            lat: place?.geometry?.location?.lat() || blocoExistente.lat,
            lng: place?.geometry?.location?.lng() || blocoExistente.lng,
            faixa_etaria: $('input[name="faixaetaria"]').val() + "+",
            estilo_musical: $('input[name="estilo"]').val()
        };

        try {
            const response = await fetch(`${API_URL}/${idBloco}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAtualizados)
            });

            if (response.ok) {
                alert("Bloco atualizado com sucesso!");
                await carregarBlocos();
            } else {
                throw new Error("Erro na resposta do servidor");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao atualizar bloco. Verifique o console.");
        }
    });

    window.initAutocomplete = initAutocomplete;
    carregarBlocos();
});