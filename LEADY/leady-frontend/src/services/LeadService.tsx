import axios from 'axios';

const API_URL = 'https://expert-rotary-phone-xvrxrrjjpjxfqp7-5000.app.github.dev/api/v1';

// Obtener todos los leads (para pintar el mapa)
export const getLeads = async (category?: string) => {
    const url = category ? `${API_URL}/leads?category=${category}` : `${API_URL}/leads`;
    const response = await axios.get(url);
    return response.data;
};

// NUEVA FUNCIÓN: Obtener los detalles completos de un lead específico por ID
export const getLeadById = async (id: number) => {
    const response = await axios.get(`${API_URL}/leads/${id}`);
    return response.data;
};