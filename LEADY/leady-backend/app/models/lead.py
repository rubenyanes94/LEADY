from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# Inicializamos la base de datos aquí para importarla luego
db = SQLAlchemy()

class Lead(db.Model):
    __tablename__ = 'leads'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False) # ej: 'restaurant', 'hospital', 'clinic'
    
    # Coordenadas geográficas (Clave para cruzar con LUMI después)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    
    # Datos de contacto (OSM nos dará address, phone, website)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(100), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    
    # Dato Enriquecido (Lo simularemos para el MVP)
    email = db.Column(db.String(255), nullable=True)
    
    # Auditoría
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        """Convierte el objeto a un diccionario para que la API pueda devolverlo como JSON"""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "lat": self.lat,
            "lon": self.lon,
            "address": self.address,
            "phone": self.phone,
            "website": self.website,
            "email": self.email
        }