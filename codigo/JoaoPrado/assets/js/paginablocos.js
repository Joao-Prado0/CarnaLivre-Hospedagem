$(document).ready(function () {
  const id = sessionStorage.getItem('selectedBlocoId');

  if (!id) {
    window.location.href = 'pesquisablocos.html';
    return;
  }

  let AdvancedMarkerElement, PinElement;

  const loadMarkerLibrary = async () => {
    try {
      ({ AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker"));
      return true;
    } catch (error) {
      console.error("Erro ao carregar biblioteca de marcadores:", error);
      return false;
    }
  };
  const loadBlocoData = async () => {
    try {
      const bloco = await $.ajax({
        url: `http://localhost:3000/blocos/${id}`,
        method: 'GET'
      });

      carregarDadosBlocos(bloco);

      const libraryLoaded = await loadMarkerLibrary();
      if (libraryLoaded) {
        await initMap(bloco);
      } else {
        console.error("Não foi possível carregar a biblioteca de marcadores");
      }
    } catch (error) {
      console.error('Erro ao carregar dados do bloco:', error);
      window.location.href = 'pesquisablocos.html';
    }
  };

  loadBlocoData();

  function carregarDadosBlocos(bloco) {
    document.title = bloco.nome_bloco;

    const $conteudoCarrossel = $('.carousel-inner').empty();
    const $indicadoresCarrossel = $('.carousel-indicators').empty();

    $.each(bloco.postagem[0].imagens, function (index, imagem) {
      $conteudoCarrossel.append(`
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${imagem.src}" class="d-block w-100 mx-auto" alt="${bloco.nome_bloco}">
        </div>
      `);

      $indicadoresCarrossel.append(`
        <button type="button" data-bs-target="#carouselExampleIndicators" 
                data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" 
                aria-label="Slide ${index + 1}">
        </button>
      `);
    });

    $('h1').text(bloco.nome_bloco);
    $('#descricao').text(bloco.descricao_geral);

    $('#info-extras ul').html(`
      <li><strong>Data:</strong> ${formatarData(bloco.data)}</li>
      <li><strong>Local:</strong> ${bloco.endereco}</li>
      <li><strong>Público esperado:</strong> ${bloco.publico.toLocaleString()} pessoas</li>
      <li><strong>Estilo musical:</strong> ${bloco.estilo_musical}</li>
      <li><strong>Faixa etária:</strong> ${bloco.faixa_etaria}</li>
      <li><strong>Avaliação:</strong> ${bloco.avaliacao}/5</li>
    `);
  }

  function formatarData(dataString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  }

  async function initMap(bloco) {
    if (!bloco || !bloco.lat || !bloco.lng) {
      console.error('Dados de localização do bloco ausentes');
      return;
    }

    try {
      const position = {
        lat: parseFloat(bloco.lat),
        lng: parseFloat(bloco.lng)
      };

      const map = new google.maps.Map(document.getElementById('maps'), {
        zoom: 15,
        center: position,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: false
      });
      const pin = new PinElement({
        background: '#FF0000',
        borderColor: '#FFFFFF',
        glyphColor: '#FFFFFF',
        scale: 1.2
      });
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: bloco.nome_bloco,
        content: pin.element
      });
      const infowindow = new google.maps.InfoWindow({
        content: `<h5>${bloco.nome_bloco}</h5><p>${bloco.endereco}</p>`
      });

      marker.addListener('gmp-click', () => {
        infowindow.open(map, marker);
      });

    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  }
});