import { useEffect, useState } from 'react';
import { LeadMap } from './components/Map/LeadMap';
import { getLeads, getLeadById } from './services/LeadService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

function App() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    getLeads().then(data => {
      setLeads(data);
      setFilteredLeads(data);
      setLoading(false);
    });
  }, []);

  const handleMarkerClick = async (lead: any) => {
    setSelectedLead(lead);
    try {
      const fullLeadData = await getLeadById(lead.id);
      setSelectedLead(fullLeadData);
    } catch (error) {
      console.error("Error al traer los detalles:", error);
    }
  };

  // Esta es la función que ahora se dispara con el botón
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
    // Cambiamos el layout principal a una columna flex que ocupa el 100% del alto (vh-100)
    <div className="container-fluid p-0 d-flex flex-column vh-100 app-container">
      
      {/* ÁREA PRINCIPAL (CRECE PARA OCUPAR EL ESPACIO DISPONIBLE) */}
      <div className="row g-0 flex-grow-1 overflow-hidden">
        
        {/* PANEL LATERAL (ESTILO VONSEL) */}
        <div className="col-md-4 col-lg-3 vonsel-sidebar d-flex flex-column h-100" style={{ zIndex: 1000, overflowY: 'auto' }}>
          
          <div className="vonsel-card d-flex justify-content-between align-items-center py-3">
            <h3 className="m-0 fw-bold" style={{ letterSpacing: '-1px' }}>
              LEAD<span style={{ color: '#38d39f' }}>Y</span>
            </h3>
            <div className="text-muted">
              <span className="fs-5">👤</span> 
            </div>
          </div>
          
          <div className="vonsel-card">
            <span className="section-title">Business Types</span>
            <input 
              type="text" 
              className="form-control vonsel-input mb-2" 
              placeholder="Search like you do on Google Maps" 
            />
            <div>
              <span 
                className={`pill-badge ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All
              </span>
              <span 
                className={`pill-badge ${selectedCategory === 'restaurant' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('restaurant')}
              >
                Restaurants
              </span>
              <span 
                className={`pill-badge ${selectedCategory === 'office' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('office')}
              >
                Offices
              </span>
              <span 
                className={`pill-badge ${selectedCategory === 'clinic' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('clinic')}
              >
                Clinics
              </span>
              <span 
                className={`pill-badge ${selectedCategory === 'bank' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('bank')}
              >
                Banks
              </span>
            </div>
          </div>

          <div className="vonsel-card">
            <span className="section-title">Search Area</span>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="text-muted small">Country</label>
                <select className="form-select vonsel-select" disabled>
                  <option>Venezuela</option>
                </select>
              </div>
              <div className="col-6">
                <label className="text-muted small">Region</label>
                <select className="form-select vonsel-select" disabled>
                  <option>Distrito Capital</option>
                </select>
              </div>
            </div>
          </div>

          <div className="vonsel-card flex-grow-1 mb-0">
            <span className="section-title">Qualified Data</span>
            <div className="data-row">
              <div className="d-flex gap-2">
                <input type="checkbox" className="form-check-input mt-1" defaultChecked />
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Business data</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Name, address, category...</div>
                </div>
              </div>
              <span className="free-badge">Basic</span>
            </div>

            <div className="data-row">
              <div className="d-flex gap-2">
                <input type="checkbox" className="form-check-input mt-1" defaultChecked />
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Enriched data</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Emails, phones, website...</div>
                </div>
              </div>
              <span className="free-badge bg-warning text-dark">Smart</span>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN FIJO ABAJO */}
          <div className="vonsel-card mt-3 mb-2 p-3 text-center border-primary border-opacity-25">
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <span className="text-muted small fw-bold">Leads encontrados:</span>
              <span className="border border-success text-success bg-success bg-opacity-10 rounded px-3 py-1 fw-bold fs-5">
                {/* Mostramos dinámicamente la cantidad de leads */}
                {filteredLeads.length}
              </span>
            </div>
            <button 
              className="btn w-100 btn-gradient shadow-sm"
              onClick={applyFilters} // <-- AQUÍ SE CONECTA LA LÓGICA
            >
              Access businesses
            </button>
          </div>

        </div>

        {/* ÁREA DEL MAPA */}
        <div className="col-md-8 col-lg-9 h-100 position-relative">
          {loading ? (
            <div className="d-flex h-100 justify-content-center align-items-center bg-light">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <LeadMap leads={filteredLeads} onMarkerClick={handleMarkerClick} />
          )}
          
          {selectedLead && (
            <div className="position-absolute bottom-0 start-0 m-4 p-4 bg-white rounded-4 shadow-lg" style={{ zIndex: 1000, minWidth: '320px', border: '1px solid #eef1f5' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="fw-bold text-dark m-0 pe-3">{selectedLead.name}</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setSelectedLead(null)}></button>
              </div>
              <span className="badge bg-light text-primary border border-primary mb-3 text-uppercase" style={{ fontSize: '0.7rem' }}>
                {selectedLead.category}
              </span>
              <p className="mb-2 small text-muted d-flex align-items-center gap-2">
                <span>📍</span> {selectedLead.address || 'Caracas, Venezuela'}
              </p>
              <p className="mb-2 small text-muted d-flex align-items-center gap-2">
                <span>📞</span> {selectedLead.phone || 'No disponible'}
              </p>
              {selectedLead.website ? (
                <a href={selectedLead.website} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary w-100 mt-2 fw-bold">
                  Visitar Sitio Web
                </a>
              ) : (
                <div className="text-center mt-2 p-2 bg-light rounded small text-muted">
                  Dominio web no verificado
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="vonsel-footer text-center py-2 text-muted" style={{ fontSize: '0.75rem' }}>
        <span>&copy; {new Date().getFullYear()} LEADY Business Finder. Desarrollado con datos de OpenStreetMap y búsqueda web asíncrona.</span>
      </footer>

    </div>
  );
}

export default App;