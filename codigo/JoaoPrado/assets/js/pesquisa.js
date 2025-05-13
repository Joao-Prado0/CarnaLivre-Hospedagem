$(document).ready(function(){
    let blocosCarregados = 0;
    const blocosPagina = 6;
    let blocos = [];
    $.getJSON('assets/js/db.json', function(data){
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

function criarCard(cardbloco){;
    let div = $('<div>').attr('class', 'card-blocos')
    let img = $('<img>').attr('src', cardbloco.imagem).attr('alt', 'Descrição');
    let h3 = $('<h3>').text(cardbloco.nome-bloco);
    let p = $('<p>').text(cardbloco.descricao_card); 
    let i = $('<i>').html(`<i class="fa-solid fa-star"></i> ${cardbloco.avaliacao}`);
    let link = $('<a>').attr('href','bloco.html?id=' + cardbloco.id).attr('id', 'linkBloco');
    let button = $('<button>').text('Ver mais');

    link.append(button);

    div.append(img,i,h3,p,link);
    return div;
}

