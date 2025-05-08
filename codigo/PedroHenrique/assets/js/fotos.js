const cloudName = 'dkltrfebl'; 
const uploadPreset = 'carnaLivre'; 

const input = document.getElementById('picture__input');
const uploadBtn = document.getElementById('upload-btn');
const gallery = document.getElementById('gallery');
const pictureBox = document.querySelector('.picture');
let selectedFile = null;


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


uploadBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert("Selecione uma imagem primeiro.");
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('upload_preset', uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    
    const img = document.createElement('img');
    img.src = data.secure_url;
    gallery.appendChild(img);

    
    pictureBox.innerHTML = 'Clique ou arraste a imagem aqui';
    selectedFile = null;
    input.value = ''; 
  })
  .catch(err => {
    alert('Erro ao enviar: ' + err.message);
  });
});



