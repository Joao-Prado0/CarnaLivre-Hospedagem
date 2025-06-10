let autocomplete;

function initAutocomplete() {
    const input = document.getElementById('campo-endereco');
    if (input) {
        autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['geocode'],
            componentRestrictions: { country: 'br' },
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place || !place.address_components) return;

            $('#campo-endereco').val(place.formatted_address);

            const cepComponent = place.address_components.find(c => c.types.includes("postal_code"));
            if (cepComponent) {
                $('input[name="cep"]').val(cepComponent.long_name.replace(/\D/g, ''));
                const $cepInput = $('input[name="cep"]');
                const cepLimpo = cepComponent.long_name.replace(/\D/g, '');
                $cepInput.val(cepLimpo);
                $cepInput.trigger('input');
            }
        });

    }
}

$(document).ready(async function () {

    $('input[name="cep"]').mask('00000-000');

    initAutocomplete();
    const API_URL = "http://localhost:3000/blocos";
    let blocosCache = [];

    async function carregarBlocos() {
        const response = await fetch(API_URL);
        blocosCache = await response.json();
        const select = $('.nomeBloco');

        blocosCache.forEach(bloco => {
            select.append(`<option value="${bloco.id}">${bloco.nome_bloco}</option>`);
        });
    }

    // preenche os campos do formulario quando seleciona um bloco
    $(document).on('change', '.nomeBloco', async function () {
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
        $('.estilo-checkbox').prop('checked', false);
        if (blocoSelecionado.estilo_musical) {
            const estilos = blocoSelecionado.estilo_musical.split(',').map(s => s.trim());
            estilos.forEach(estilo => {
                $(`.estilo-checkbox[value="${estilo}"]`).prop('checked', true);
            });
        }

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
        $('.estilo-checkbox').prop('checked', false);
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

        // pega o endereço completo + latitude e longitude
        let place;
        try {
            place = autocomplete?.getPlace?.();
        } catch (e) {
            place = null;
        }

        const enderecoCompleto = place?.formatted_address || $('#campo-endereco').val();

        let latitude = blocoExistente.lat;
        let longitude = blocoExistente.lng;

        if (place?.geometry?.location) {
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
        }

        const dadosAtualizados = {
            ...blocoExistente,
            nome_bloco: $('.nomeBloco option:selected').text(),
            descricao_geral: $('textarea[name="descricao"]').val(),
            data: $('input[name="datahora"]').val().split('T')[0],
            publico: parseInt($('input[name="publico"]').val()) || 0,
            cep: $('input[name="cep"]').val(),
            endereco: enderecoCompleto,
            lat: latitude,
            lng: longitude,
            faixa_etaria: $('input[name="faixaetaria"]').val() + "+",
            estilo_musical: $('.estilo-checkbox:checked').map(function () {
                return this.value;
            }).get().join(', ')

        };

        try {
            const response = await fetch(`${API_URL}/${idBloco}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAtualizados)
            });

            if (response.ok) {
                alert("Bloco atualizado com sucesso!");

            } else {
                throw new Error("Erro na resposta do servidor");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao atualizar bloco. Verifique o console.");
        }
    });
    await carregarBlocos();
});