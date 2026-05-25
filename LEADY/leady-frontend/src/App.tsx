import { useEffect, useState } from 'react';
import { LeadMap } from './components/Map/LeadMap';
import { getLeads, getLeadById } from './services/LeadService'; // Importamos la nueva función
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false); // Estado para saber si está cargando los datos del backend

  useEffect(() => {
    getLeads().then(data => {
      setLeads(data);
      setFilteredLeads(data);
      setLoading(false);
    });
  }, []);

  // FUNCIÓN CLAVE: Se ejecuta al hacer clic en un pin del mapa
  const handleMarkerClick = async (lead: any) => {
    setLoadingDetails(true);
    setSelectedLead(lead); // Mostramos los datos básicos de inmediato para mejor UX
    
    try {
      // Hacemos la petición al backend para traer los datos reales (dirección, tlf, mail, etc.)
      const fullLeadData = await getLeadById(lead.id);
      setSelectedLead(fullLeadData); // Reemplazamos con la data completa de la BD
    } catch (error) {
      console.error("Error al traer los detalles del negocio:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const applyFilters = () => {
    setSelectedLead(null);
    if (selectedCategory === '') {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter(lead => 
        lead.category && lead.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      setFilteredLeads(filtered);
    }
  };

  return (
    <div className="container-fluid p-0 vh-100 overflow-hidden">
      <div className="row g-0 h-100">
        
        {/* PANEL LATERAL */}
        <div className="col-md-3 bg-dark text-white p-4 shadow d-flex flex-column" style={{ zIndex: 1000 }}>
          <h2 className="mb-4 text-warning fw-bold">LEADY</h2>
          
          <div className="mb-4">
            <h6 className="text-uppercase text-secondary mb-3">Segmentación de Mercado</h6>
            <select 
              className="form-select mb-3 bg-dark text-white border-secondary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="office">Oficinas y Corporativos</option>
              <option value="restaurant">Restaurantes y Gastronomía</option>
              <option value="bank">Bancos y Finanzas</option>
              <option value="clinic">Clínicas y Hospitales</option>
              <option value="industrial">Industrial y Comercial</option>
            </select>
            <button className="btn btn-warning w-100 fw-bold" onClick={applyFilters}>
              Aplicar Filtro
            </button>
          </div>

          <hr className="border-secondary" />

          {/* DETALLES DEL LEAD */}
          <div className="flex-grow-1 overflow-auto mt-2">
            {!selectedLead ? (
              <div className="text-center text-secondary mt-5">
                <p>Selecciona un negocio en el mapa para ver sus detalles aquí.</p>
              </div>
            ) : (
              <div className="card bg-secondary text-white border-0 position-relative">
                <div className="card-body">
                  <h4 className="card-title text-warning">{selectedLead.name}</h4>
                  <span className="badge bg-dark mb-3">{selectedLead.category}</span>
                  
                  {/* Animación o aviso de carga si el backend está enriqueciendo */}
                  {loadingDetails && (
                    <div className="alert alert-warning py-1 px-2 mb-3" style={{ fontSize: '12px' }}>
                      ⚡ Conectando con la base de datos y buscando información web...
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <small className="text-light d-block">📍 Dirección:</small>
                    <span>{selectedLead.address || 'No especificada en mapa'}</span>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-light d-block">📞 Teléfono:</small>
                    <span>{selectedLead.phone || 'No disponible'}</span>
                  </div>

                  <div className="mb-2">
                    <small className="text-light d-block">📧 Email:</small>
                    <span>{selectedLead.email || 'No disponible'}</span>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-light d-block">🌐 Sitio Web / Redes:</small>
                    {selectedLead.website ? (
                      <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-warning fw-bold">
                        Visitar Sitio Oficial
                      </a>
                    ) : (
                      <span className="text-white-50">No especificado</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ÁREA DEL MAPA */}
        <div className="col-md-9 h-100 position-relative">
          {loading ? (
            <div className="d-flex h-100 justify-content-center align-items-center bg-light">
              <h4 className="text-muted">Escaneando Caracas...</h4>
            </div>
          ) : (
            // Vinculamos la nueva función controladora del clic
            <LeadMap leads={filteredLeads} onMarkerClick={handleMarkerClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;