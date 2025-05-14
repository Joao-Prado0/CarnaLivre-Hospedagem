const cloudName = 'dkltrfebl'; 
const uploadPreset = 'carnaLivre'; 


const input = document.getElementById('picture__input');
const uploadBtn = document.getElementById('upload-btn');
const captionInput = document.getElementById('caption-input');
const gallery = document.getElementById('gallery');
const pictureBox = document.querySelector('.picture');
let selectedFile = null;

// Quando o usuário seleciona uma imagem
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

// Quando o botão de upload é clicado
uploadBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert("Selecione uma imagem primeiro.");
    return;
  }

  const captionText = captionInput.value;

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('upload_preset', uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      // Criar container para imagem + legenda
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';

      // Criar imagem
      const img = document.createElement('img');
      img.src = data.secure_url;
      img.style.width = '150px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

      // Criar legenda
      const caption = document.createElement('p');
      caption.textContent = captionText;
      caption.style.marginTop = '5px';
      caption.style.fontSize = '14px';
      caption.style.color = '#333';
      caption.style.maxWidth = '150px';
      caption.style.textAlign = 'center';

      // Montar e adicionar à galeria
      container.appendChild(img);
      container.appendChild(caption);
      gallery.appendChild(container);

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



