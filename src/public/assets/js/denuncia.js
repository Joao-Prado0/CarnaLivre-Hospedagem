import { BlocosCarnaval } from "../../services/blocos-services.js";
const blocoService = new BlocosCarnaval();

import { Denuncias } from "../../services/blocos-services.js";
const denunciaService = new Denuncias();

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
        });

    }
}
window.initAutocomplete = initAutocomplete;

async function carregarBlocos() {
    try {
        const blocos = await blocoService.getBlocos();

        blocos.forEach(bloco => {
            $('.blocoDenuncia').append(`<option value="${bloco.id}">${bloco.nome_bloco}</option>`);
        });
    }
    catch (error) {
        console.error('Erro ao carregar blocos:', error);
        alert('Erro ao carregar os blocos.');
    }
}

async function enviarDenuncia(dados) {
    try {
        if (!dados.bloco || dados.bloco === 'Qual bloco você estava?') {
            throw new Error('Selecione um bloco');
        }
        denunciaService.novaDenuncia(dados);
        alert("Denuncia realizada com sucesso!");

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar denuncia.");
    }
}

$(document).ready(async function () {
    initAutocomplete();
    await carregarBlocos();

    $('#formDenuncia').submit(async function (event) {
        event.preventDefault();

        let place, latitude, longitude;
        place = autocomplete?.getPlace?.();

        const enderecoCompleto = place?.formatted_address || $('#campo-endereco').val();

        if (place?.geometry?.location) {
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
        }

        const dadosDenuncia = {
            dataHora: $('input[name="dataHora"]').val(),
            bloco: $('.blocoDenuncia option:selected').text(),
            local: enderecoCompleto,
            lat: latitude,
            lng: longitude,
            ocorrido: $('textarea[name="ocorrido"]').val()
        }

        await enviarDenuncia(dadosDenuncia);
        $('#formDenuncia')[0].reset();

    })

})