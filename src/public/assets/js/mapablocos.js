import { BlocosCarnaval } from "../../services/blocos-services.js";
const blocoService = new BlocosCarnaval();

// Mapa dos blocos com geolocalização, zoom automático e pesquisa
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
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();

  // geolocalização
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userPos);
        new google.maps.Marker({
          position: userPos,
          map,
          title: "Você está aqui",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          },
        });
        destacarBlocosProximos(userPos);
      },
      (err) => {
        console.warn("Erro de geolocalização:", err);
        alert("Não foi possível obter sua localização. Mostrando blocos em Belo Horizonte.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    alert("Geolocalização não suportada pelo navegador.");
  }

  carregarBlocos().then(() => {
    const input = document.getElementById("brpesquisa");

    input.addEventListener("input", (e) => {
      clearTimeout(timeoutPesquisa);
      timeoutPesquisa = setTimeout(() => {
        pesquisarBloco(e.target.value);
      }, 500);
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        clearTimeout(timeoutPesquisa);
        pesquisarBloco(e.target.value);
      }
    });
  });
}

async function carregarBlocos() {
  try {
    const response = await blocoService.getBlocos();
    const dados = await response.json();

    for (const bloco of dados) {
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
            className: "map-marker-label",
          },
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        blocosMarkers[bloco.id] = marker;

marker.addListener("click", () => {
  infoWindow.setContent(`
      <div style="
      max-width: 300px;
      padding: 4px 12px 12px 12px; 
      margin: 0;
      text-align: center;
    ">
      <h3 style="margin-top:0; color:#d32f2f;">${bloco.nome_bloco}</h3>
      <p style="text-align: left;"><strong>📍 Endereço:</strong> ${bloco.endereco}</p>
      <p style="text-align: left;"><strong>📅 Data:</strong> ${new Date(bloco.data).toLocaleDateString("pt-BR")}</p>
      <p style="text-align: left;"><strong>🎵 Estilo:</strong> ${bloco.estilo_musical}</p>
      <p style="text-align: left;"><strong>👥 Público:</strong> ${bloco.publico.toLocaleString("pt-BR")} pessoas</p>
      
      <a href="#" onclick="
        sessionStorage.setItem('selectedBlocoId', '${bloco.id}');
        window.location.href = '/JoaoPrado/paginablocos.html';
        return false;
      
        " style="
        display: inline-block;
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #d32f2f;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      ">
        Ver mais sobre o bloco
      </a>
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
      google.maps.event.trigger(melhorMatch, "click");
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

function destacarBlocosProximos(userPos) {
  const raioMetros = 5000; 

  for (const marker of Object.values(blocosMarkers)) {
    const pos = marker.getPosition();
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userPos.lat, userPos.lng),
      pos
    );
    if (distancia <= raioMetros) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 3000);
    }
  }
}

const style = document.createElement("style");
style.textContent = `
  .map-marker-label {
    background-color: rgba(211, 47, 47, 0.8);
    padding: 2px 6px;
    border-radius: 4px;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  }
`;
document.head.appendChild(style);
