const cloudName = 'dkltrfebl';
const uploadPreset = 'carnaLivre';

const fileInput = document.getElementById('picture__input');
const previewImage = document.getElementById('preview-image');
const pictureLabel = document.getElementById('picture-label');
const uploadBtn = document.getElementById('upload-btn');
const gallery = document.getElementById('gallery');

const captionInput = document.getElementById('caption-input');
const textUploadBtn = document.getElementById('text-upload-btn');
const captionGallery = document.getElementById('caption-gallery');


fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewImage.style.display = 'block';
      pictureLabel.querySelector('span').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});


uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Selecione uma imagem!');
    return;
  }

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Falha no upload da imagem');

    const data = await response.json();
    addImage(data.secure_url);

    
    previewImage.src = '';
    previewImage.style.display = 'none';
    pictureLabel.querySelector('span').style.display = 'block';
    fileInput.value = '';
  } catch (error) {
    alert('Erro no upload da imagem: ' + error.message);
  }
});


textUploadBtn.addEventListener('click', () => {
  const caption = captionInput.value.trim();
  if (!caption) {
    alert('Digite um texto antes de enviar!');
    return;
  }

  addCaption(caption);
  captionInput.disabled = true;
  textUploadBtn.disabled = true;
  captionInput.value = null;
  
});


function addImage(url) {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Imagem enviada';

  card.appendChild(img);
  gallery.appendChild(card);
}


function addCaption(text) {
  const captionCard = document.createElement('div');
  captionCard.classList.add('caption-card');
  captionCard.textContent = text;
  captionGallery.appendChild(captionCard);
}





