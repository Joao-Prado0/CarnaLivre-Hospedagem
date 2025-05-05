$(document).ready(function(){
    let blocosCarregados = 6;
    $.getJSON('assets/js/dados.json', function(data){
        let blocos = data.blocos;
        $('.card-blocos').each(function(index){
            let cardbloco = blocos[index];
            if(cardbloco){
            $(this).find('img').attr('src', cardbloco.imagem);
            $(this).find('img').attr('alt', cardbloco.nome);
            $(this).find('h3').text(cardbloco.nome);
            $(this).find('p').text(cardbloco.descricao_card);
            $(this).find('a').attr('href', 'bloco.html?id=' + cardbloco.id);
            }
        });
        $('#btn-ver-mais').click(function() {
            $('.card-blocos:hidden').slice(0, 6).fadeIn(500);
            blocosCarregados += 6;
            if (blocosCarregados >= blocos.length) {
                $(this).hide();
            }
        });

    })
})