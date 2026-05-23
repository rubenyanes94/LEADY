import requests
from app.models.lead import db, Lead
from run import app 
import sys
import os
# Agregamos la carpeta raíz (leady-backend) al PATH de Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from app.models.lead import db, Lead
from run import app 
# ... resto del código

def fetch_and_seed_leads(city_name="Caracas"):
    # Lista de categorías que nos interesan para un B2B de telecomunicaciones
    # 'office' captura edificios corporativos y empresas de servicios
    # 'restaurant' y 'cafe' son clientes de alto consumo de internet
    categories = ["restaurant", "cafe", "office", "bank", "company"]
    
    print(f"Iniciando caza de leads en {city_name}...")
    
    for category in categories:
        print(f"-> Buscando: {category}")
        url = "http://overpass-api.de/api/interpreter"
        query = f"""
        [out:json][timeout:25];
        area["name"="{city_name}"]->.searchArea;
        (
          node["amenity"="{category}"](area.searchArea);
          node["office"="{category}"](area.searchArea);
          way["building"="office"](area.searchArea);
        );
        out center;
        """
        
        try:
            response = requests.get(url, params={'data': query})
            data = response.json()
            
            leads_count = 0
            for element in data['elements']:
                tags = element.get('tags', {})
                name = tags.get('name')
                
                if name:
                    new_lead = Lead(
                        name=name,
                        category=category,
                        lat=element.get('lat', 0),
                        lon=element.get('lon', 0),
                        address=tags.get('addr:street', 'Caracas, Distrito Capital'),
                        phone=tags.get('phone', tags.get('contact:phone')),
                        website=tags.get('website'),
                        email=f"info@{name.lower().replace(' ', '')}.com"
                    )
                    db.session.add(new_lead)
                    leads_count += 1
            
            db.session.commit()
            print(f"   Guardados {leads_count} leads de categoría {category}")
            
        except Exception as e:
            print(f"Error procesando {category}: {e}")

if __name__ == '__main__':
    with app.app_context():
        fetch_and_seed_leads("Caracas")