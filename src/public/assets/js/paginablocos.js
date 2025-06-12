import { BlocosCarnaval } from "../../services/blocos-services.js";
const blocoService = new BlocosCarnaval();

import { Comentarios } from "../../services/blocos-services.js";
const comentarioService = new Comentarios();

$(document).ready(function () {
  let bloco;
  const url = "http://localhost:3000"
  console.log('Conteúdo do sessionStorage:', sessionStorage);
  const id = sessionStorage.getItem('selectedBlocoId');

  const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');

  let usuarioCorrente = null;
  if (usuarioCorrenteJSON) {
    try {
      usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    } catch (e) {
      console.warn("Erro ao fazer parse do usuarioCorrente:", e);
    }
  }

  if (!id) {
    console.error("Nenhum bloco selecionado.");
    return;
  }

  const usuarioLogado = {
    id: usuarioCorrente?.id ?? null,
    email: usuarioCorrente?.email ?? '',
    tipo: usuarioCorrente?.tipo ?? ''
  };

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
      bloco = await blocoService.getBloco(id);
      const todosComentarios = await comentarioService.getComentarios();
      const comentarios = todosComentarios.filter(c => c.blocoId == id);
      const organizadorDoBloco = bloco.organizador.some(org => org.email_org === usuarioLogado.email);
      usuarioLogado.organizador = organizadorDoBloco;

      carregarDadosBlocos(bloco, comentarios, usuarioLogado);

      if (!usuarioLogado.organizador) {
        $('#comentario-novo').show();
      } else {
        $('#comentario-novo').hide();
      }

      const libraryLoaded = await loadMarkerLibrary();
      if (libraryLoaded) {
        await initMap(bloco);
      } else {
        console.error("Não foi possível carregar a biblioteca de marcadores");
      }
    } catch (error) {
      console.error('Erro ao carregar dados do bloco:', error);
    }


    $('#envia-comentario').on('click', async function () {
      const texto = $('#texto-comentario').val().trim();
      const avaliacao = $('input[name="avaliacao"]:checked').val();
      const blocoId = id;
      const usuarioId = usuarioLogado.id;

      if (!texto || !avaliacao) {
        alert('Por favor, preencha tanto a avaliação quanto o comentário');
        return;
      }

      const novoComentario = {
        blocoId: blocoId,
        usuarioId: usuarioId,
        texto: texto,
        avaliacao: parseInt(avaliacao),
        data: new Date().toISOString(),
        resposta: { texto: '', data: '', organizadorId: '' }
      };
      try {
        await comentarioService.novoComentario(novoComentario);

        $('#texto-comentario').val('');
        $('#texto-comentario').prop('checked', false);

        const todosComentariosAtualizados = await comentarioService.getComentarios();
        const comentariosAtualizados = todosComentariosAtualizados.filter(c => c.blocoId == blocoId);
        carregarDadosBlocos({ ...bloco }, comentariosAtualizados, usuarioLogado);
      } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        alert('Erro ao enviar comentário. Tente novamente.');
      }
    });
  };

  function carregarDadosBlocos(bloco, comentarios, usuarioLogado) {
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
    $listaInfos.append($('<li>').html(`<strong>Avaliação:</strong> ${bloco.avaliacao}`));

    const abaComentarios = $('#comentarios-antigos').empty();
    comentarios.sort((a, b) => new Date(b.data) - new Date(a.data));
    console.log('Comentarios:', comentarios);


    if (!comentarios.length) {
      const msg = $('<p>').addClass('nenhum-comentario').text('Nenhum comentário foi feito ainda. Seja o primeiro!');
      abaComentarios.append(msg);
    } else {
      for (let i = 0; i < comentarios.length; i++) {
        const div = $('<div>').addClass('comentario-postado');
        const texto = $('<p>').text(comentarios[i].texto);
        const data = $('<p>').addClass('data').text(formatarData(comentarios[i].data));

        for (let j = 0; j < parseInt(comentarios[i].avaliacao); j++) {
          let estrela = $('<i>').addClass('fa-solid fa-star');
          div.append(estrela);
        }
        div.append(texto, data);


        if (comentarios[i].resposta && comentarios[i].resposta.texto) {
          div.append(
            $('<div>').addClass('resposta-organizador mt-2 ps-3 border-start border-3').append(
              $('<p>').addClass('mb-1 fw-bold').text('Resposta do Organizador:'),
              $('<p>').text(comentarios[i].resposta.texto),
              $('<p>').addClass('data-resposta small text-muted').text(formatarData(comentarios[i].resposta.data))
            )
          )
        } else if (usuarioLogado && usuarioLogado.organizador) {
          const textarea = $('<textarea>').addClass('form-control').attr('rows', 2).attr('placeholder', 'Responder...');
          const botao = $('<button>').addClass('btn btn-sm btn-primary mt-2').text('Responder').attr("id", "btnResponder");

          botao.on('click', async () => {
            const respostaTexto = textarea.val().trim();
            if (!respostaTexto) return;

            const novaResposta = {
              texto: respostaTexto,
              data: new Date().toISOString(),
              organizadorId: usuarioLogado.id
            };

            const comentarioAtualizado = {
              ...comentarios[i],
              resposta: novaResposta
            };
            await comentarioService.atualizarComentario(comentarios[i].id, comentarioAtualizado);

            const todosComentariosAtualizados = await comentarioService.getComentarios();
            const comentariosAtualizados = todosComentariosAtualizados.filter(c => c.blocoId == bloco.id);
            carregarDadosBlocos(bloco, comentariosAtualizados, usuarioLogado);
          });

          const respostaDiv = $('<div>').addClass('mt-2');
          respostaDiv.append(textarea, botao);

          div.append(respostaDiv);

        }
        abaComentarios.append(div);
      }

    }
    if (usuarioLogado.organizador) {
      $('#btn-compartilhar').hide();
      $('#btn-foto').show();
      $('#btn-editar').show();

      $('#btn-foto').click(function () {
        window.location.href = `${url}/PedroHenrique/addimagem.html`;
      })
      $('#btn-editar').click(function () {
        window.location.href = `${url}/LucasFranco/infoblocos.html`;
      })
    } else {
      $('#btn-compartilhar').show();
      $('#btn-foto').hide();
      $('#btn-editar').hide();

      $('#btn-compartilhar').click(function () {
        if (navigator.share) {
          navigator.share({
            title: bloco.nome_bloco,
            text: bloco.descricao_geral,
            url: window.location.href
          })
            .catch(console.error);
        } else {
          alert('Compartilhe este link: ' + window.location.href);
        }
      });
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

  carregaBlocoData();
});