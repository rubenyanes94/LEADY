import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';

// Corrección de iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const LeadMap = ({ leads, onMarkerClick }: { leads: any[], onMarkerClick: (lead: any) => void }) => {
  return (
    <MapContainer center={[10.4806, -66.9036]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      
      <MarkerClusterGroup>
        {leads.map((lead) => (
          <Marker 
            key={lead.id} 
            position={[lead.lat, lead.lon]}
            eventHandlers={{
              click: () => {
                // 1. Enviamos los datos al panel lateral
                onMarkerClick(lead);
              },
            }}
          >
            {/* 2. Devolvemos el Popup para el vistazo rápido en el mapa */}
            <Popup>
              <div className="text-center p-1">
                <strong className="d-block mb-1">{lead.name}</strong>
                <span className="badge bg-secondary">{lead.category}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};