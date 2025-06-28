import { BlocosCarnaval } from "../../services/blocos-services.js";
const blocoService = new BlocosCarnaval();

let autocomplete;
let bloco;

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
window.initAutocomplete = initAutocomplete;

async function carregarBlocos(id) {
    try {
        bloco = await blocoService.getBloco(id);
        $('input[name=nomeBloco]').attr('placeholder', bloco.nome_bloco);
        preencheDados();
    }
    catch (error) {
        console.error("Erro ao buscar blocos:", error);
        alert("Erro ao carregar os dados do servidor.");
    }
}

function preencheDados() {
    if (!bloco) return;

    $('textarea[name="descricao"]').val(bloco.descricao_geral || '');
    $('input[name="datahora"]').val(formatarData(bloco.data));
    $('input[name="publico"]').val(bloco.publico || '');
    $('input[name="cep"]').val(bloco.cep || '');
    $('#campo-endereco').val(bloco.endereco || '');
    $('input[name="faixaetaria"]').val(bloco.faixa_etaria ? bloco.faixa_etaria.replace('+', '') : '');

    $('.estilo-checkbox').prop('checked', false);
    if (bloco.estilo_musical) {
        const estilos = bloco.estilo_musical.split(',').map(s => s.trim());
        estilos.forEach(estilo => {
            $(`.estilo-checkbox[value="${estilo}"]`).prop('checked', true);
        });
    }
}

function formatarData(dataString) {
    if (!dataString) return '';
    return dataString.includes('T') ? dataString : `${dataString}T00:00`;
}

async function atualizaInfo() {
    try {
        let place;
        try {
            place = autocomplete?.getPlace?.();
        } catch (e) {
            place = null;
        }

        const enderecoCompleto = place?.formatted_address || $('#campo-endereco').val();

        let latitude = bloco.lat;
        let longitude = bloco.lng;

        if (place?.geometry?.location) {
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
        }

        const dadosAtualizados = {
            ...bloco,
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

        await blocoService.atualizarBloco(bloco.id, dadosAtualizados);
        alert("Bloco atualizado com sucesso!");
    }
    catch (error) {
        console.error("Erro ao atualizar bloco:", error);
        alert("Erro ao atualizar o bloco. Por favor, tente novamente.");
    }
}

$(document).ready(async function () {

    $('input[name="cep"]').mask('00000-000');

    initAutocomplete();

    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioCorrente = null;

    if (usuarioCorrenteJSON) {
        try {
            usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        } catch (e) {
            console.warn("Erro ao fazer parse do usuarioCorrente:", e);
        }
    }

    if (usuarioCorrente.tipo == 'foliao') {
        window.location.href = 'mapablocos.html'
    }
    else {
        await carregarBlocos(usuarioCorrente.id);
    }

    $('#formInfo').submit(async function (event) {
        event.preventDefault();
        await atualizaInfo();
    });
});