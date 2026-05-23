import requests
from run import app, db
from app.models.lead import Lead

def seed_data():
    url = "http://overpass-api.de/api/interpreter"
    
    # 1. Agregamos un 'User-Agent' para que no nos bloqueen
    headers = {'User-Agent': 'LeadyApp/1.0'}
    
    # 2. Consulta un poco más limpia
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
    
    # 3. DEPURACIÓN: Si el estatus no es 200, imprimimos qué nos respondió el servidor
    if response.status_code != 200:
        print(f"Error de servidor: {response.status_code}")
        print("Respuesta completa:", response.text)
        return

    data = response.json()
    
    with app.app_context():
        # Limpiamos tabla para no duplicar datos si ejecutas esto varias veces
        db.session.query(Lead).delete() 
        
        for el in data['elements']:
            name = el.get('tags', {}).get('name')
            if name:
                lead = Lead(name=name, category="restaurant", lat=el['lat'], lon=el['lon'])
                db.session.add(lead)
        db.session.commit()
    print("¡Base de datos poblada con éxito!")

if __name__ == "__main__":
    seed_data()