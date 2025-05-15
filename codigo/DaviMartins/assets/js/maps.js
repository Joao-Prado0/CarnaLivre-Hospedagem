let map;
let blocosMarkers = {};
let infoWindow;
let timeoutPesquisa = null;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -19.93516, lng: -43.93105 },
    zoom: 13,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow();
  
  carregarBlocos().then(() => {
    const input = document.getElementById("brpesquisa");
    
    input.addEventListener('input', (e) => {
      clearTimeout(timeoutPesquisa);
      timeoutPesquisa = setTimeout(() => {
        pesquisarBloco(e.target.value);
      }, 500);
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(timeoutPesquisa);
        pesquisarBloco(e.target.value);
      }
    });
  });
}

async function carregarBlocos() {
  try {
    const response = await fetch("../db/dbblocos.json");
    const dados = await response.json();
    
    for (const bloco of dados.blocos) {
      if (bloco.lat && bloco.lng) {
        const marker = new google.maps.Marker({
          position: { lat: bloco.lat, lng: bloco.lng },
          map,
          title: bloco.nome_bloco,
          label: {
            text: bloco.nome_bloco,
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "12px",
            className: "map-marker-label" 
          },
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40)
          }
        });

        blocosMarkers[bloco.id] = marker;
        
        // InfoWindow com informações detalhadas (aparece ao clicar)
        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="max-width:300px">
              <h3 style="margin-top:0;color:#d32f2f">${bloco.nome_bloco}</h3>
              <p><strong>📍 Endereço:</strong> ${bloco.endereco}</p>
              <p><strong>📅 Data:</strong> ${new Date(bloco.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>🎵 Estilo:</strong> ${bloco.estilo_musical}</p>
              <p><strong>👥 Público:</strong> ${bloco.publico.toLocaleString('pt-BR')} pessoas</p>
            </div>
          `);
          infoWindow.open(map, marker);
        });
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar blocos:", erro);
    alert("Erro ao carregar dados dos blocos. Verifique o console.");
  }
}

function pesquisarBloco(nomePesquisado) {
  if (!nomePesquisado || nomePesquisado.trim().length < 3) {
    infoWindow.close();
    return;
  }
  
  infoWindow.close();
  
  const pesquisa = nomePesquisado.toLowerCase().trim();
  let melhorMatch = null;

  for (const [id, marker] of Object.entries(blocosMarkers)) {
    if (marker.getTitle().toLowerCase().startsWith(pesquisa)) {
      melhorMatch = marker;
      break;
    }
  }

  if (melhorMatch) {
    map.panTo(melhorMatch.getPosition());
    map.setZoom(17);
    setTimeout(() => {
      google.maps.event.trigger(melhorMatch, 'click');
    }, 300);
  } else {
    infoWindow.setContent(`
      <div style="padding:10px;">
        <h3 style="margin-top:0;">Nenhum bloco encontrado</h3>
        <p>Nenhum bloco começa com "${nomePesquisado}"</p>
        <small>Digite pelo menos 3 caracteres</small>
      </div>
    `);
    infoWindow.setPosition(map.getCenter());
    infoWindow.open(map);
  }
}

// CSS adicional para melhorar a legibilidade dos labels
const style = document.createElement('style');
style.textContent = `
  .map-marker-label {
    background-color: rgba(211, 47, 47, 0.8);
    padding: 2px 6px;
    border-radius: 4px;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  }
`;
document.head.appendChild(style);