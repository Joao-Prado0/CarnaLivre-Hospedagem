$(document).ready(function () {
  let bloco;
  const id = sessionStorage.getItem('selectedBlocoId');
  const url = "http://localhost:3000"

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
  const carregaBlocoData = async () => {
    try {
      const usuarioLogado = await verificarUsuarioLogado();
      bloco = await $.ajax({
        url: `${url}/blocos/${id}`,
        method: 'GET'
      });
      const comentarios = await $.ajax({
        url: `${url}/comentarios?blocoId=${id}`,
        method: 'GET'
      })

      carregarDadosBlocos(bloco, comentarios);

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


    $('#envia-comentario').on('click', async function () {
      const texto = $('#texto-comentario').val().trim();
      const avaliacao = $('input[name="avaliacao"]:checked').val();
      const blocoId = parseInt(id);
      const usuarioId = 1;

      if (!texto || !avaliacao) {
        alert('Por favor, preencha tanto a avaliação quanto o comentário');
        return;
      }

      const novoComentario = {
        blocoId: blocoId,
        usuarioId: usuarioId,
        texto: texto,
        avaliacao: parseInt(avaliacao),
        data: new Date().toISOString()
      };
      try {
        $.ajax({
          url: `${url}/comentarios`,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(novoComentario)
        });

        $('#texto-comentario').val('');
        $('#texto-comentario').prop('checked', false);

        const comentariosAtualizados = await $.get(`${url}/comentarios?blocoId=${blocoId}`);
        carregarDadosBlocos({ ...bloco }, comentariosAtualizados);
      } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        alert('Erro ao enviar comentário. Tente novamente.');
      }
    });

    async function verificarUsuarioLogado() {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return null;

      const bloco = await $.get(`${url}/blocos/${id}`);
      const isOrganizador = bloco.organizador.some(org => org.email_org === sessionStorage.getItem('userEmail'));

      return {
        id: userId,
        isOrganizador: isOrganizador,
      };
    }

  };

  carregaBlocoData();

  function carregarDadosBlocos(bloco, comentarios) {
    document.title = bloco.nome_bloco;

    const conteudoCarrossel = $('.carousel-inner').empty();
    const indicadoresCarrossel = $('.carousel-indicators').empty();

    $.each(bloco.postagem[0].imagens, function (index, imagem) {
      const itemCarrossel = $('<div>')
        .addClass('carousel-item')
        .toggleClass('active', index === 0)
        .append(
          $('<img>')
            .addClass('d-block w-100 mx-auto')
            .attr('src', imagem.src)
            .attr('alt', bloco.nome_bloco)
        );

      const indicador = $('<button>')
        .attr({
          type: 'button',
          'data-bs-target': '#carouselExampleIndicators',
          'data-bs-slide-to': index,
          'aria-label': `Slide ${index + 1}`
        })
        .toggleClass('active', index === 0);

      conteudoCarrossel.append(itemCarrossel);
      indicadoresCarrossel.append(indicador);
    });

    $('h1').text(bloco.nome_bloco);
    $('#descricao').text(bloco.descricao_geral);

    const $listaInfos = $('#info-extras ul').empty();

    $listaInfos.append($('<li>').html(`<strong>Data:</strong> ${formatarData(bloco.data)}`));
    $listaInfos.append($('<li>').html(`<strong>Local:</strong> ${bloco.endereco}`));
    $listaInfos.append($('<li>').html(`<strong>Público esperado:</strong> ${bloco.publico.toLocaleString()} pessoas`));
    $listaInfos.append($('<li>').html(`<strong>Estilo musical:</strong> ${bloco.estilo_musical}`));
    $listaInfos.append($('<li>').html(`<strong>Faixa etária:</strong> ${bloco.faixa_etaria}`));
    $listaInfos.append($('<li>').html(`<strong>Avaliação:</strong> ${bloco.avaliacao}/5`));


    comentarios.sort((a, b) => new Date(b.data) - new Date(a.data));
    const abaComentarios = $('#comentarios-antigos').empty();

    if (comentarios.length === 0) {
      const msg = $('<p>').addClass('nenhum-comentario').text('Nenhum comentário foi feito ainda. Seja o primeiro!');
      abaComentarios.append(msg);
    } else {
      for (let i = 0; i < comentarios.length; i++) {
        let div = $('<div>').addClass('comentario-postado');
        let texto = $('<p>').text(comentarios[i].texto);
        let data = $('<p>').addClass('data').text(formatarData(comentarios[i].data));
        for (let j = 0; j < parseInt(comentarios[i].avaliacao); j++) {
          let estrela = $('<i>').addClass('fa-solid fa-star');
          div.append(estrela);
        }
        div.append(texto, data);
        abaComentarios.append(div);
      }
    }
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