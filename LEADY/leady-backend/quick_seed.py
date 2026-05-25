import requests
from run import app, db
from app.models.lead import Lead

def seed_data():
    url = "http://overpass-api.de/api/interpreter"
    headers = {'User-Agent': 'LeadyApp/1.0'}
    
    # Bounding Box para la Gran Caracas [sur, oeste, norte, este]
    # Cubre: Libertador, Chacao, Baruta y Sucre.
    bbox = "10.4000,-67.0500,10.5400,-66.7500"
    
    # Se añade el bbox al inicio y se eliminan las referencias a area.search
    query = f"""
    [out:json][timeout:90][bbox:{bbox}];
    (
      node["amenity"~"^(bank|clinic|hospital|restaurant|pharmacy|cafe)$"];
      node["office"];
      node["craft"];
      way["building"~"^(office|industrial|commercial)$"];
    );
    out center;
    """
    
    print("Enviando petición de radar geográfico a OpenStreetMap...")
    print(f"Zona de escaneo: {bbox}")
    
    response = requests.get(url, params={'data': query}, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}\n{response.text}")
        return

    data = response.json()
    
    with app.app_context():
        # Limpiamos tabla para evitar duplicados
        db.session.query(Lead).delete() 
        
        count = 0
        for el in data['elements']:
            tags = el.get('tags', {})
            name = tags.get('name')
            
            lat = el.get('lat') or el.get('center', {}).get('lat')
            lon = el.get('lon') or el.get('center', {}).get('lon')
            
            if name and lat and lon:
                # Determinamos la categoría principal para el frontend
                cat = tags.get('amenity') or tags.get('office') or tags.get('building', 'general')
                
                lead = Lead(
                    name=name, 
                    category=cat, 
                    lat=float(lat), 
                    lon=float(lon),
                    address=tags.get('addr:street'),
                    phone=tags.get('phone')
                )
                db.session.add(lead)
                count += 1
                
        db.session.commit()
    print(f"¡Éxito! Base de datos poblada con {count} empresas en la Gran Caracas.")

if __name__ == "__main__":
    seed_data()