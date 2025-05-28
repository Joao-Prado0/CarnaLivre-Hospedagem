const API_URL = "http://localhost:3000";
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

async function carregarBlocos() {
    try {
        const response = await fetch(`${API_URL}/blocos`);
        if (!response.ok) throw new Error('Erro na requisição');

        const blocosCache = await response.json();
        const select = $('.blocoDenuncia');

        blocosCache.forEach(bloco => {
            select.append(`<option value="${bloco.id}">${bloco.nome_bloco}</option>`);
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

        const response = await fetch(`${API_URL}/denuncias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Denuncia realizada com sucesso!");

        } else {
            throw new Error("Erro na resposta do servidor");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar denuncia.");
    }
}

$(document).ready(async function () {
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
            horario: $('input[name="horario"]').val(),
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