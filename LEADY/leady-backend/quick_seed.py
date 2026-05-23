import requests
from run import app, db
from app.models.lead import Lead

def seed_data():
    url = "http://overpass-api.de/api/interpreter"
    headers = {'User-Agent': 'LeadyApp/1.0'}
    
    query = """
    [out:json][timeout:60];
    area["name"="Caracas"]->.search;
    (
      node["amenity"~"^(bank|clinic|hospital|office)$"](area.search);
      node["office"](area.search);
      node["craft"](area.search);
      way["building"~"^(office|industrial|commercial)$"](area.search);
    );
    out center;
    """
    
    print("Enviando petición a OpenStreetMap...")
    response = requests.get(url, params={'data': query}, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}\n{response.text}")
        return

    data = response.json()
    
    with app.app_context():
        db.session.query(Lead).delete() 
        
        count = 0
        for el in data['elements']:
            tags = el.get('tags', {})
            name = tags.get('name')
            
            # --- CORRECCIÓN CLAVE AQUÍ ---
            # Si el elemento tiene 'lat', úsala; si no, busca en 'center'
            lat = el.get('lat') or el.get('center', {}).get('lat')
            lon = el.get('lon') or el.get('center', {}).get('lon')
            
            # Solo guardamos si tenemos coordenadas y nombre
            if name and lat and lon:
                # Obtenemos la categoría real del elemento (no solo 'restaurant')
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
    print(f"¡Éxito! Base de datos poblada con {count} nuevos registros.")

if __name__ == "__main__":
    seed_data()