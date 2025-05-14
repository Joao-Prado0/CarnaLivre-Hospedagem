$(document).ready(function(){
    let blocosCarregados = 0;
    const blocosPagina = 6;
    let blocos = [];
    $.getJSON('../db/dbblocos.json', function(data){
        blocos = data.blocos;
        carregarMaisBlocos();
    });
    $('#btn-ver-mais').click(function() {
        carregarMaisBlocos();
    });

    function carregarMaisBlocos() {
        const proximoLote = blocos.slice(blocosCarregados, blocosCarregados + blocosPagina);
        proximoLote.forEach(function(bloco){
            const card = criarCard(bloco);
            $('#container-cards').append(card.hide().fadeIn(500));
        });

        blocosCarregados += blocosPagina;

        if (blocosCarregados >= blocos.length) {
            $('#btn-ver-mais').hide(); 
        }
    }
})

function criarCard(cardbloco){
    const postagem = cardbloco.postagem[0];
    const imagemSrc = postagem.imagens[0].src;

    let div = $('<div>').attr('class', 'card-blocos')
    let img = $('<img>').attr('src',imagemSrc).attr('alt', 'Descrição');
    let h3 = $('<h3>').text(cardbloco.nome_bloco);
    let p = $('<p>').text(postagem.descricao_card); 
    let i = $('<i>').html(`<i class="fa-solid fa-star"></i> ${cardbloco.avaliacao}`);
    let link = $('<a>').attr('href','bloco.html?id=' + cardbloco.id).attr('id', 'linkBloco');
    let button = $('<button>').text('Ver mais');

    link.append(button);

    div.append(img,i,h3,p,link);
    return div;
}

