const cloudName = 'dkltrfebl'; 
const uploadPreset = 'carnaLivre'; 

const fileInput = document.getElementById('picture__input');
const captionInput = document.getElementById('caption-input');
const gallery = document.getElementById('gallery');
const captionGallery = document.getElementById('caption-gallery'); 
const pictureLabel = document.querySelector('.picture');
const uploadBtn = document.getElementById('upload-btn');

const uploadImage = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);  

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) throw new Error('Upload falhou');

  const data = await response.json();
  return data.secure_url;
};

const addImage = (url) => {
  // Cria card de imagem
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Imagem enviada';

  card.appendChild(img);
  gallery.appendChild(card);
};

const addCaption = (text) => {
  if (text.trim() === '') return;  

  const captionCard = document.createElement('div');
  captionCard.classList.add('caption-card');
  captionCard.textContent = text;

  captionGallery.appendChild(captionCard);
};


fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const imgUrl = URL.createObjectURL(file);

    
    pictureLabel.innerHTML = '';

    const imgPreview = document.createElement('img');
    imgPreview.src = imgUrl;
    imgPreview.classList.add('picture__img');
    imgPreview.alt = 'Prévia da imagem';

    pictureLabel.appendChild(imgPreview);
  } else {
    pictureLabel.textContent = 'Clique ou arraste a imagem aqui';
  }
});

uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const caption = captionInput.value.trim();


  try {
    const imageUrl = await uploadImage(file);

    addImage(imageUrl);
    addCaption(caption);

   
    captionInput.value = '';
    captionInput.disabled = true;
    fileInput.value = '';

   
    pictureLabel.textContent = 'Clique ou arraste a imagem aqui';
  } catch (error) {
    alert('Erro no upload: ' + error.message);
  }
});






