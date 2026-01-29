import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Calendar, Flame } from "lucide-react";

export function MapaInterativo({
  familias,
  pedidos = [],
  comercios = [],
  ongs = [],
  pontosColeta = [],
  zonasRisco = [],
  layers = {
    familias: true,
    pedidos: true,
    comercios: true,
    ongs: true,
    pontosColeta: true,
    zonasRisco: true,
  },
  onFamiliaClick,
  onPedidoClick,
  centro = [-19.769, -43.851],
  zoom = 15,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef(null);
  const userLocationRef = useRef(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  const createFamiliaMarker = useCallback((familia) => {
    const vulnColors = {
      alta: { bg: "#dc2626", border: "#fca5a5", shadow: "rgba(220, 38, 38, 0.4)" },
      média: { bg: "#d97706", border: "#fcd34d", shadow: "rgba(217, 119, 6, 0.4)" },
      baixa: { bg: "#059669", border: "#6ee7b7", shadow: "rgba(5, 150, 105, 0.4)" },
    };
    
    const colors = vulnColors[familia.vulnerability.toLowerCase()] || vulnColors.baixa;
    const isHighRisk = familia.vulnerability.toLowerCase() === "alta";
    
    const markerHtml = `
      <div class="familia-marker ${isHighRisk ? 'pulse' : ''}" style="
        --marker-bg: ${colors.bg};
        --marker-border: ${colors.border};
        --marker-shadow: ${colors.shadow};
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span class="marker-count">${familia.members}</span>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      className: "custom-familia-marker",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const marker = L.marker([familia.lat, familia.lng], { icon });

    const statusColor = familia.status === "atendido" ? "#3b82f6" : familia.status === "pendente" ? "#f59e0b" : "#22c55e";
    const statusLabel = familia.status === "atendido" ? "Atendido" : familia.status === "pendente" ? "Pendente" : "Ativo";

    const popupContent = `
      <div class="map-popup familia-popup">
        <div class="popup-header">
          <div class="popup-badges">
            <span class="badge vuln-${familia.vulnerability.toLowerCase()}">${familia.vulnerability}</span>
            <span class="badge status" style="--status-color: ${statusColor}">${statusLabel}</span>
          </div>
          <h3>${familia.name}</h3>
          ${familia.address ? `<p class="popup-address">${familia.address}</p>` : ''}
        </div>
        <div class="popup-stats">
          <div class="stat-item">
            <span class="stat-value">${familia.members}</span>
            <span class="stat-label">Membros</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${familia.children}</span>
            <span class="stat-label">Crianças</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${familia.elderly}</span>
            <span class="stat-label">Idosos</span>
          </div>
        </div>
        <div class="popup-info">
          <div class="info-row"><span class="info-icon">R$</span>${familia.income}</div>
          ${familia.phone ? `<div class="info-row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${familia.phone}</div>` : ''}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 320, className: "custom-popup" });
    
    if (onFamiliaClick) {
      marker.on('click', () => onFamiliaClick(familia));
    }

    return marker;
  }, [onFamiliaClick]);

  const createPedidoMarker = useCallback((pedido) => {
    const isPedido = pedido.tipo === "pedido";
    
    const markerHtml = `
      <div class="pedido-marker ${isPedido ? 'pedido' : 'oferta'}">
        ${isPedido ? 
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' :
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
        }
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      className: "custom-pedido-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([pedido.lat, pedido.lng], { icon });

    const popupContent = `
      <div class="map-popup pedido-popup">
        <span class="badge ${isPedido ? 'pedido' : 'oferta'}">${isPedido ? 'Pedido de Ajuda' : 'Oferta'}</span>
        <h3>${pedido.titulo}</h3>
        <span class="popup-category">${pedido.categoria}</span>
        ${pedido.descricao ? `<p class="popup-desc">${pedido.descricao}</p>` : ''}
        <div class="popup-status">Status: <strong>${pedido.status}</strong></div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280, className: "custom-popup" });
    
    if (onPedidoClick) {
      marker.on('click', () => onPedidoClick(pedido));
    }

    return marker;
  }, [onPedidoClick]);

  const createComercioMarker = useCallback((comercio) => {
    const markerHtml = `
      <div class="comercio-marker ${comercio.parceiro ? 'parceiro' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      className: "custom-comercio-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([comercio.lat, comercio.lng], { icon });

    const popupContent = `
      <div class="map-popup comercio-popup">
        ${comercio.parceiro ? '<span class="badge parceiro">Parceiro Solidário</span>' : ''}
        <h3>${comercio.nome}</h3>
        <span class="popup-category">${comercio.tipo}</span>
        ${comercio.moedaSolidaria ? '<div class="moeda-tag">Aceita Moeda Solidária</div>' : ''}
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 260, className: "custom-popup" });
    return marker;
  }, []);

  const createONGMarker = useCallback((ong) => {
    const markerHtml = `
      <div class="ong-marker">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      className: "custom-ong-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = L.marker([ong.lat, ong.lng], { icon });

    const popupContent = `
      <div class="map-popup ong-popup">
        <span class="badge ong">ONG</span>
        <h3>${ong.nome}</h3>
        <div class="popup-services">
          ${ong.servicos.map(s => `<span class="service-tag">${s}</span>`).join('')}
        </div>
        ${ong.contato ? `<div class="popup-contact">${ong.contato}</div>` : ''}
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280, className: "custom-popup" });
    return marker;
  }, []);

  const createPontoColetaMarker = useCallback((ponto) => {
    const markerHtml = `
      <div class="coleta-marker">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      className: "custom-coleta-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([ponto.lat, ponto.lng], { icon });

    const popupContent = `
      <div class="map-popup coleta-popup">
        <span class="badge coleta">Ponto de Coleta</span>
        <h3>${ponto.nome}</h3>
        <div class="popup-items">
          ${ponto.itens.map(i => `<span class="item-tag">${i}</span>`).join('')}
        </div>
        <div class="popup-hours">${ponto.horario}</div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 260, className: "custom-popup" });
    return marker;
  }, []);

  const createZonaRisco = useCallback((zona) => {
    const config = {
      alto: { fill: "#dc2626", stroke: "#991b1b", pattern: "alto" },
      medio: { fill: "#d97706", stroke: "#92400e", pattern: "medio" },
      baixo: { fill: "#ca8a04", stroke: "#854d0e", pattern: "baixo" },
    };

    const cfg = config[zona.nivel] || config.baixo;
    
    const polygon = L.polygon(zona.coords, {
      color: cfg.stroke,
      fillColor: cfg.fill,
      fillOpacity: 0.25,
      weight: 3,
      dashArray: zona.nivel === "alto" ? "" : "8, 4",
      className: `zona-risco zona-${zona.nivel}`,
    });

    const tipoIcon = zona.tipo === "enchente" ? "💧" : zona.tipo === "deslizamento" ? "🏔️" : "⚠️";
    const tipoLabel = zona.tipo === "enchente" ? "Risco de Enchente" : 
                      zona.tipo === "deslizamento" ? "Risco de Deslizamento" : 
                      "Área Vulnerável";

    polygon.bindPopup(`
      <div class="map-popup risco-popup">
        <div class="risco-header ${zona.nivel}">
          <span class="risco-icon">${tipoIcon}</span>
          <div>
            <h3>${tipoLabel}</h3>
            <span class="risco-nivel">Nível ${zona.nivel.toUpperCase()}</span>
          </div>
        </div>
        <p class="risco-desc">Área identificada como zona de risco. Famílias nesta região requerem atenção especial.</p>
      </div>
    `, { maxWidth: 300, className: "custom-popup" });

    return polygon;
  }, []);


  useEffect(() => {
    if (!mapRef.current) return;

    // Limpar mapa anterior
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Erro ao remover mapa:', e);
      }
      mapInstanceRef.current = null;
    }

    // Aguardar um frame antes de criar novo mapa
    const timeoutId = setTimeout(() => {
      if (!mapRef.current) return;
      
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView(centro, zoom);
      
      mapInstanceRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map);

    const layerGroups = {
      familias: L.layerGroup(),
      pedidos: L.layerGroup(),
      comercios: L.layerGroup(),
      ongs: L.layerGroup(),
      pontosColeta: L.layerGroup(),
      zonasRisco: L.layerGroup(),
      heatmap: L.layerGroup(),
    };
    layerGroupsRef.current = layerGroups;

    const filterByDate = (items) => {
      if (dateFilter === 'all') return items;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - parseInt(dateFilter));
      return items.filter(item => {
        if (!item.createdAt) return true;
        return new Date(item.createdAt) >= cutoff;
      });
    };

    if (heatmapEnabled) {
      filterByDate(familias).forEach((familia) => {
        const vuln = familia.vulnerability ? familia.vulnerability.toLowerCase() : '';
        if (vuln === 'alta' || vuln === 'média') {
          L.circle([familia.lat, familia.lng], {
            radius: vuln === 'alta' ? 180 : 120,
            fillColor: vuln === 'alta' ? '#ef4444' : '#f97316',
            fillOpacity: 0.15,
            stroke: false,
            interactive: false,
          }).addTo(layerGroups.heatmap);
        }
      });
      layerGroups.heatmap.addTo(map);
    }

    if (layers.zonasRisco) {
      zonasRisco.forEach((zona) => {
        const polygon = createZonaRisco(zona);
        layerGroups.zonasRisco.addLayer(polygon);
      });
      layerGroups.zonasRisco.addTo(map);
    }

    if (layers.familias) {
      filterByDate(familias).forEach((familia) => {
        const marker = createFamiliaMarker(familia);
        layerGroups.familias.addLayer(marker);
      });
      layerGroups.familias.addTo(map);
    }

    if (layers.pedidos) {
      filterByDate(pedidos).forEach((pedido) => {
        const marker = createPedidoMarker(pedido);
        layerGroups.pedidos.addLayer(marker);
      });
      layerGroups.pedidos.addTo(map);
    }

    if (layers.comercios) {
      comercios.forEach((comercio) => {
        const marker = createComercioMarker(comercio);
        layerGroups.comercios.addLayer(marker);
      });
      layerGroups.comercios.addTo(map);
    }

    if (layers.ongs) {
      ongs.forEach((ong) => {
        const marker = createONGMarker(ong);
        layerGroups.ongs.addLayer(marker);
      });
      layerGroups.ongs.addTo(map);
    }

    if (layers.pontosColeta) {
      pontosColeta.forEach((ponto) => {
        const marker = createPontoColetaMarker(ponto);
        layerGroups.pontosColeta.addLayer(marker);
      });
      layerGroups.pontosColeta.addTo(map);
    }

    const style = document.createElement('style');
    style.id = 'map-custom-styles';
    style.textContent = `
      .custom-familia-marker,
      .custom-pedido-marker,
      .custom-comercio-marker,
      .custom-ong-marker,
      .custom-coleta-marker {
        background: transparent !important;
        border: none !important;
      }
      
      .familia-marker {
        width: 44px;
        height: 44px;
        background: var(--marker-bg);
        border: 3px solid var(--marker-border);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px var(--marker-shadow);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        position: relative;
      }
      
      .familia-marker:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px var(--marker-shadow);
      }
      
      .familia-marker.pulse {
        animation: marker-pulse 2s infinite;
      }
      
      .marker-count {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #1e293b;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }
      
      @keyframes marker-pulse {
        0%, 100% { box-shadow: 0 0 0 0 var(--marker-shadow); }
        50% { box-shadow: 0 0 0 12px transparent; }
      }
      
      .pedido-marker {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s;
        border: 2px solid white;
      }
      
      .pedido-marker.pedido { background: #dc2626; }
      .pedido-marker.oferta { background: #059669; }
      .pedido-marker:hover { transform: scale(1.1); }
      
      .comercio-marker {
        width: 28px;
        height: 28px;
        background: #64748b;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .comercio-marker.parceiro { background: #059669; }
      .comercio-marker:hover { transform: scale(1.1); }
      
      .ong-marker {
        width: 30px;
        height: 30px;
        background: #7c3aed;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .ong-marker:hover { transform: scale(1.1); }
      
      .coleta-marker {
        width: 28px;
        height: 28px;
        background: #ea580c;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .coleta-marker:hover { transform: scale(1.1); }
      
      .zona-risco {
        transition: fill-opacity 0.2s;
      }
      
      .zona-alto {
        animation: zone-pulse 3s infinite;
      }
      
      @keyframes zone-pulse {
        0%, 100% { fill-opacity: 0.25; }
        50% { fill-opacity: 0.35; }
      }
      
      .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.25);
        padding: 0;
        overflow: hidden;
      }
      
      .custom-popup .leaflet-popup-content {
        margin: 0;
        width: auto !important;
      }
      
      .custom-popup .leaflet-popup-tip {
        background: white;
        box-shadow: none;
      }
      
      .map-popup {
        font-family: 'Inter', -apple-system, sans-serif;
        padding: 16px;
        min-width: 220px;
      }
      
      .map-popup h3 {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
      }
      
      .map-popup .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        margin-right: 6px;
      }
      
      .badge.vuln-alta { background: #fef2f2; color: #dc2626; }
      .badge.vuln-média { background: #fffbeb; color: #d97706; }
      .badge.vuln-baixa { background: #f0fdf4; color: #059669; }
      .badge.status { background: color-mix(in srgb, var(--status-color) 15%, white); color: var(--status-color); }
      .badge.pedido { background: #fef2f2; color: #dc2626; }
      .badge.oferta { background: #f0fdf4; color: #059669; }
      .badge.parceiro { background: #f0fdf4; color: #059669; }
      .badge.ong { background: #f3e8ff; color: #7c3aed; }
      .badge.coleta { background: #fff7ed; color: #ea580c; }
      
      .popup-header { margin-bottom: 12px; }
      .popup-address { margin: 4px 0 0; font-size: 12px; color: #64748b; }
      
      .popup-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .stat-item {
        background: #f8fafc;
        padding: 10px;
        border-radius: 8px;
        text-align: center;
      }
      
      .stat-value {
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }
      
      .stat-label {
        font-size: 10px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      
      .popup-info {
        border-top: 1px solid #e2e8f0;
        padding-top: 12px;
      }
      
      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #475569;
        padding: 4px 0;
      }
      
      .info-icon {
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
      }
      
      .popup-action {
        width: 100%;
        margin-top: 12px;
        padding: 10px;
        background: #0f172a;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .popup-action:hover { background: #1e293b; }
      
      .popup-category {
        display: inline-block;
        background: #f1f5f9;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        color: #475569;
        margin-top: 8px;
      }
      
      .popup-desc {
        margin: 10px 0 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.5;
      }
      
      .popup-status {
        margin-top: 10px;
        font-size: 12px;
        color: #64748b;
      }
      
      .popup-services,
      .popup-items {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 10px;
      }
      
      .service-tag {
        background: #f3e8ff;
        color: #7c3aed;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
      }
      
      .item-tag {
        background: #fff7ed;
        color: #ea580c;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
      }
      
      .popup-contact,
      .popup-hours {
        margin-top: 10px;
        font-size: 12px;
        color: #64748b;
      }
      
      .moeda-tag {
        margin-top: 10px;
        padding: 6px 10px;
        background: #fef9c3;
        color: #a16207;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }
      
      .risco-popup { padding: 0; }
      
      .risco-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        color: white;
      }
      
      .risco-header.alto { background: linear-gradient(135deg, #dc2626, #991b1b); }
      .risco-header.medio { background: linear-gradient(135deg, #d97706, #92400e); }
      .risco-header.baixo { background: linear-gradient(135deg, #ca8a04, #854d0e); }
      
      .risco-icon { font-size: 24px; }
      
      .risco-header h3 {
        color: white;
        margin: 0;
        font-size: 14px;
      }
      
      .risco-nivel {
        font-size: 11px;
        opacity: 0.9;
      }
      
      .risco-desc {
        padding: 12px 16px;
        margin: 0;
        font-size: 12px;
        color: #64748b;
        line-height: 1.5;
      }
      
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        border-radius: 8px !important;
        overflow: hidden;
      }
      
      .leaflet-control-zoom a {
        background: white !important;
        color: #0f172a !important;
        border: none !important;
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
        font-size: 16px !important;
      }
      
      .leaflet-control-zoom a:hover {
        background: #f8fafc !important;
      }
    `;
    
    const existingStyle = document.getElementById('map-custom-styles');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Erro ao limpar mapa:', e);
        }
        mapInstanceRef.current = null;
      }
      const styleEl = document.getElementById('map-custom-styles');
      if (styleEl) styleEl.remove();
    };
    }, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [familias, pedidos, comercios, ongs, pontosColeta, zonasRisco, layers, centro, zoom, createFamiliaMarker, createPedidoMarker, createComercioMarker, createONGMarker, createPontoColetaMarker, createZonaRisco, dateFilter, heatmapEnabled]);

  const handleMyLocation = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Remove previous marker if exists
        if (userLocationRef.current) {
          map.removeLayer(userLocationRef.current);
        }

        // Create a group for user location (circle + marker)
        const userGroup = L.featureGroup();
        
        // Accuracy circle
        L.circle([latitude, longitude], {
          radius: position.coords.accuracy / 2,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1
        }).addTo(userGroup);

        // User dot
        L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        }).addTo(userGroup);

        userGroup.addTo(map);
        userLocationRef.current = userGroup;

        map.flyTo([latitude, longitude], 16, {
          animate: true,
          duration: 1.5
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        let msg = "Não foi possível obter sua localização.";
        if (error.code === 1) msg = "Permissão de localização negada.";
        alert(msg);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "inherit" }}>
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          title="Filtrar por Data"
          style={{ backgroundColor: "white", border: "none", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0f172a", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
        >
          <Calendar size={18} color={dateFilter !== 'all' ? '#6366f1' : 'currentColor'} />
        </button>
        {showFilterMenu && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: "4px", minWidth: "140px" }}>
            <button onClick={() => { setDateFilter('all'); setShowFilterMenu(false); }} style={{ padding: "8px 12px", border: "none", background: dateFilter === 'all' ? "#f1f5f9" : "transparent", borderRadius: "6px", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: "600", color: dateFilter === 'all' ? "#0f172a" : "#64748b" }}>Todo o período</button>
            <button onClick={() => { setDateFilter('7'); setShowFilterMenu(false); }} style={{ padding: "8px 12px", border: "none", background: dateFilter === '7' ? "#e0e7ff" : "transparent", borderRadius: "6px", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: "600", color: dateFilter === '7' ? "#4338ca" : "#64748b" }}>Últimos 7 dias</button>
            <button onClick={() => { setDateFilter('30'); setShowFilterMenu(false); }} style={{ padding: "8px 12px", border: "none", background: dateFilter === '30' ? "#e0e7ff" : "transparent", borderRadius: "6px", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: "600", color: dateFilter === '30' ? "#4338ca" : "#64748b" }}>Últimos 30 dias</button>
          </div>
        )}
        <button
          onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          title="Mapa de Calor (Vulnerabilidade)"
          style={{ backgroundColor: heatmapEnabled ? "#fee2e2" : "white", border: "none", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: heatmapEnabled ? "#dc2626" : "#0f172a", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
        >
          <Flame size={18} fill={heatmapEnabled ? "currentColor" : "none"} />
        </button>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "inherit" }} />
      <button
        onClick={handleMyLocation}
        title="Minha Localização"
        style={{
          position: "absolute",
          bottom: "90px", // Above zoom controls
          right: "10px",
          zIndex: 1000,
          backgroundColor: "white",
          border: "none",
          borderRadius: "8px",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#0f172a",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Locate size={18} />
      </button>
    </div>
  );
}

export function calcularDistanciaHaversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function encontrarMaisProximos(origem, itens, limite = 5) {
  return itens
    .map((item) => ({
      ...item,
      distancia: calcularDistanciaHaversine(origem.lat, origem.lng, item.lat, item.lng),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, limite);
}

export default MapaInterativo;
