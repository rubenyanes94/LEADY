from flask import Blueprint, jsonify, request
from app.models.lead import db, Lead

# Creamos el "Blueprint" para organizar las rutas de leads
leads_bp = Blueprint('leads', __name__)

@leads_bp.route('/leads', methods=['GET'])
def get_leads():
    # Obtenemos el parámetro de filtro 'category' de la URL (si existe)
    category = request.args.get('category')
    
    # Si hay categoría, filtramos; si no, traemos todos
    if category:
        leads = Lead.query.filter_by(category=category).all()
    else:
        leads = Lead.query.all()
    
    # Convertimos los objetos de la DB a diccionarios JSON
    return jsonify([lead.to_dict() for lead in leads]), 200

@leads_bp.route('/leads/<int:lead_id>', methods=['GET'])
def get_lead(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    return jsonify(lead.to_dict()), 200