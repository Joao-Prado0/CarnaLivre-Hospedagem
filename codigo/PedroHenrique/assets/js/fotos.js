document.addEventListener("DOMContentLoaded", () => {
  const captionInput = document.getElementById("caption-input");
  const textUploadBtn = document.getElementById("text-upload-btn");

  const pictureInput = document.getElementById("picture__input");
  const previewImage = document.getElementById("preview-image");

  const uploadBtn = document.getElementById("upload-btn");

  const captionGallery = document.getElementById("caption-gallery");
  const gallery = document.getElementById("gallery");

  let legendaEnviada = false;

  // Função para renderizar a legenda na galeria
  function renderLegenda(texto) {
    captionGallery.innerHTML = ""; // limpa
    if (texto) {
      const captionCard = document.createElement("div");
      captionCard.classList.add("caption-card");
      captionCard.textContent = texto;
      captionGallery.appendChild(captionCard);
    }
  }

  // Função para renderizar as imagens na galeria
  function renderImagens(imagens) {
    gallery.innerHTML = ""; // limpa
    if (imagens && imagens.length > 0) {
      imagens.forEach(img => {
        const card = document.createElement("div");
        card.classList.add("card");
        const imageElem = document.createElement("img");
        imageElem.src = img.src;
        card.appendChild(imageElem);
        gallery.appendChild(card);
      });
    }
  }

  // Função para carregar a postagem e atualizar galerias
  function carregarPostagem() {
    fetch('http://localhost:3000/postagem')
      .then(res => res.json())
      .then(postagens => {
        if (postagens.length === 0) return;

        const postagem = postagens[0];
        renderLegenda(postagem.descricao_card);
        renderImagens(postagem.imagens);

        // Se a legenda já existir, bloqueia o input e botão
        if (postagem.descricao_card && postagem.descricao_card.trim() !== "") {
          legendaEnviada = true;
          captionInput.value = postagem.descricao_card;
          captionInput.disabled = true;
          textUploadBtn.disabled = true;
        }
      })
      .catch(err => {
        console.error("Erro ao carregar postagem:", err);
      });
  }

  // Preview da imagem selecionada
  pictureInput.addEventListener("change", () => {
    const file = pictureInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
      previewImage.src = "";
    }
  });

  // Enviar legenda (só uma vez)
  textUploadBtn.addEventListener("click", () => {
    if (legendaEnviada) {
      alert("Legenda já enviada.");
      return;
    }

    const novaLegenda = captionInput.value.trim();
    if (!novaLegenda) {
      alert("Digite uma legenda antes de enviar.");
      return;
    }

    fetch('http://localhost:3000/postagem')
      .then(res => res.json())
      .then(postagens => {
        if (postagens.length === 0) {
          alert("Nenhuma postagem encontrada para atualizar.");
          return;
        }

        const postagem = postagens[0];
        const id = postagem.id;

        return fetch(`http://localhost:3000/postagem/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descricao_card: novaLegenda })
        });
      })
      .then(response => {
        if (response && response.ok) {
          alert("Legenda enviada com sucesso!");
          legendaEnviada = true;
          captionInput.disabled = true;
          textUploadBtn.disabled = true;
          renderLegenda(captionInput.value.trim());
        } else {
          alert("Erro ao enviar legenda.");
        }
      })
      .catch(err => {
        console.error("Erro na atualização da legenda:", err);
        alert("Erro ao enviar legenda.");
      });
  });

  // Upload da imagem
  uploadBtn.addEventListener("click", () => {
    const file = pictureInput.files[0];
    if (!file) {
      alert("Selecione uma imagem antes de enviar.");
      return;
    }

    fetch('http://localhost:3000/postagem')
      .then(res => res.json())
      .then(postagens => {
        if (postagens.length === 0) {
          alert("Nenhuma postagem encontrada para atualizar.");
          return;
        }

        const postagem = postagens[0];
        const id = postagem.id;

        const novaImagemId = postagem.imagens.length > 0 ? Math.max(...postagem.imagens.map(img => img.id)) + 1 : 1;

        // Usar URL.createObjectURL para preview temporário, no backend deve salvar a imagem e retornar URL real
        const novaImagemSrc = URL.createObjectURL(file);

        const novasImagens = [...postagem.imagens, { id: novaImagemId, src: novaImagemSrc }];

        return fetch(`http://localhost:3000/postagem/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagens: novasImagens })
        });
      })
      .then(response => {
        if (response && response.ok) {
          alert("Imagem enviada com sucesso!");
          pictureInput.value = "";
          previewImage.style.display = "none";
          previewImage.src = "";
          carregarPostagem(); // Atualiza galeria após upload
        } else {
          alert("Erro ao enviar imagem.");
        }
      })
      .catch(err => {
        console.error("Erro no upload da imagem:", err);
        alert("Erro ao enviar imagem.");
      });
  });

  // Carrega as informações assim que a página carrega
  carregarPostagem();
});






