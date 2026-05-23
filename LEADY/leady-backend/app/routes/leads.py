from flask import Blueprint, jsonify, request
from app.models.lead import db, Lead
# ¡IMPORTANTE! Importamos la función desde el archivo donde la creamos
from app.services.enricher import smart_enrich 

leads_bp = Blueprint('leads', __name__)

@leads_bp.route('/leads', methods=['GET'])
def get_leads():
    category = request.args.get('category')
    if category:
        leads = Lead.query.filter_by(category=category).all()
    else:
        leads = Lead.query.all()
    return jsonify([lead.to_dict() for lead in leads]), 200

@leads_bp.route('/leads/<int:lead_id>', methods=['GET'])
def get_lead(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    
    # Lógica inteligente: Si falta el website, lo buscamos
    if lead.website is None:
        print(f"Buscando información web para: {lead.name}...")
        new_url = smart_enrich(lead.name)
        if new_url:
            lead.website = new_url
            db.session.commit()
            print(f"¡Encontrado! Actualizado: {new_url}")
            
    return jsonify(lead.to_dict()), 200