import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from app.routes.leads import leads_bp
# Importamos la instancia de bd y el modelo Lead
from app.models.lead import db, Lead

# Carga variables desde el archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de CORS
CORS(app, origins=["http://localhost:5173", r"https://.*\.vercel\.app"])

# Configuración de la Base de Datos (URL de Neon PostgreSQL)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializamos SQLAlchemy y Migrate
db.init_app(app)
migrate = Migrate(app, db)

# --- RUTAS DE LA API ---

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Leady API is running perfectly!"}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Bienvenido a LEADY API",
        "status": "online",
        "endpoints": {
            "health": "/api/v1/health",
            "leads": "/api/v1/leads"
        }
    }), 200

app.register_blueprint(leads_bp, url_prefix='/api/v1')

# Esto imprimirá todas las rutas disponibles en la consola al iniciar
print(app.url_map)

if __name__ == '__main__':
    # El puerto lo lee de Render, o usa 5000 en local
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)