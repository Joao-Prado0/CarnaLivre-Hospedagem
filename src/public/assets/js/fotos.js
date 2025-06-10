const previewImage = document.getElementById('preview-image');
const pictureInput = document.getElementById('picture__input');
const uploadBtn = document.getElementById('upload-btn');

const captionInput = document.getElementById('caption-input');
const textUploadBtn = document.getElementById('text-upload-btn');

const gallery = document.getElementById('gallery');
const captionGallery = document.getElementById('caption-gallery');

// Dados locais
let imagens = [];
let legenda = '';

document.addEventListener('DOMContentLoaded', () => {
  previewImage.style.display = 'none';

  pictureInput.addEventListener('change', () => {
    const file = pictureInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  uploadBtn.addEventListener('click', () => {
    const file = pictureInput.files[0];
    if (!file) {
      alert('Escolha uma imagem antes de enviar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target.result;
      adicionarImagem(src);
      pictureInput.value = '';
      previewImage.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  textUploadBtn.addEventListener('click', () => {
    const novaLegenda = captionInput.value.trim();
    if (!novaLegenda) {
      alert('Digite uma legenda antes de enviar.');
      return;
    }

    if (legenda) {
      alert('Legenda já enviada e não pode ser alterada.');
      return;
    }

    legenda = novaLegenda;
    atualizarGaleria(imagens, legenda);

    captionInput.disabled = true;
    textUploadBtn.disabled = true;
    captionInput.value = '';
  });
});

function adicionarImagem(src) {
  const novoId = imagens.length > 0
    ? Math.max(...imagens.map(i => i.id)) + 1
    : 1;

  imagens.push({ id: novoId, src });

  atualizarGaleria(imagens, legenda);
}

function criarCardImagem(src) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Imagem enviada';

  card.appendChild(img);
  gallery.appendChild(card);
}

function criarCardLegenda(texto) {
  const card = document.createElement('div');
  card.className = 'caption-card';
  card.textContent = texto;

  captionGallery.appendChild(card);
}


function atualizarGaleria(imagens, legenda) {
  gallery.innerHTML = '';
  captionGallery.innerHTML = '';

  imagens.forEach(img => criarCardImagem(img.src));

  if (legenda.trim() !== '') {
    criarCardLegenda(legenda);
  }
}







