from googlesearch import search
import requests

def smart_enrich(lead_name):
    """
    Busca en la web el sitio oficial o redes de la empresa
    """
    query = f"{lead_name} Caracas sitio web o instagram"
    try:
        # Busca el primer resultado relevante
        for url in search(query, num_results=1):
            return url # Retornamos la URL encontrada
    except Exception as e:
        return None