const cloudName = 'dkltrfebl'; 
const uploadPreset = 'carnaLivre'; 


const input = document.getElementById('picture__input');
const uploadBtn = document.getElementById('upload-btn');
const captionInput = document.getElementById('caption-input');
const gallery = document.getElementById('gallery');
const pictureBox = document.querySelector('.picture');
let selectedFile = null;

// Pré-visualização da imagem
input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;

  selectedFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    pictureBox.innerHTML = `<img src="${e.target.result}" class="picture__img" alt="Pré-visualização">`;
  };
  reader.readAsDataURL(file);
});

// Upload da imagem com legenda
uploadBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert("Selecione uma imagem primeiro.");
    return;
  }

  const captionText = captionInput.value.trim();

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('upload_preset', uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      // Criar o card Bootstrap
      const card = document.createElement('div');
      card.classList.add('card');
      card.style.width = '18rem'; // Largura fixa do card Bootstrap

      // Imagem do card
      const img = document.createElement('img');
      img.src = data.secure_url;
      img.classList.add('card-img-top');
      img.alt = "Imagem enviada";

      // Corpo do card
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      // Legenda do card
      const caption = document.createElement('p');
      caption.classList.add('card-text');
      caption.textContent = captionText;

      // Montar a estrutura do card
      cardBody.appendChild(caption);
      card.appendChild(img);
      card.appendChild(cardBody);
      gallery.appendChild(card);

      // Limpar inputs
      pictureBox.innerHTML = 'Clique ou arraste a imagem aqui';
      selectedFile = null;
      input.value = '';
      captionInput.value = '';
    })
    .catch(err => {
      alert('Erro ao enviar: ' + err.message);
    });
});




