import { Denuncias } from "../../services/blocos-services.js";
const denunciaService = new Denuncias();

let map;
let denunciasMarkers = {};
let infoWindow;

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

  // Geolocalização
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
        destacarDenunciasProximas(userPos);
      },
      (err) => {
        console.warn("Erro de geolocalização:", err);
        alert("Não foi possível obter sua localização. Mostrando denúncias em Belo Horizonte.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  carregarDenuncias();
}

async function carregarDenuncias() {
  try {
    const dados = await denunciaService.getDenuncias();

    for (const denuncia of dados) {
      if (denuncia.lat && denuncia.lng) {
        const marker = new google.maps.Marker({
          position: { lat: denuncia.lat, lng: denuncia.lng },
          map,
          title: denuncia.titulo,
          label: {
            text: "!",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            className: "map-marker-label",
          },
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
            labelOrigin: new google.maps.Point(19, -3),
          },
        });

        denunciasMarkers[denuncia.id] = marker;

        marker.addListener("click", () => {
          infoWindow.setContent(`
            <div style="max-width:300px">
              <h3 style="margin-top:0; color:red;">${denuncia.ocorrido}</h3>
              <p><strong>🗓️ Data:</strong> ${new Date(denuncia.dataHora).toLocaleDateString('pt-BR').slice(0, 8)} às ${new Date(denuncia.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>📌 Bloco:</strong> ${denuncia.bloco}</p>
            </div>
          `);
          infoWindow.open(map, marker);
        });
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar denúncias:", erro);
    alert("Erro ao carregar dados de denúncias. Verifique o console.");
  }
}

function destacarDenunciasProximas(userPos) {
  const raioMetros = 3000;

  for (const marker of Object.values(denunciasMarkers)) {
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

// Estilo do marcador
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

function abrirFormularioDenuncia() {
  window.location.href = 'denuncia.html';;
}

window.abrirFormularioDenuncia = abrirFormularioDenuncia;
window.initMap = initMap;
