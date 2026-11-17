/**
 * França Simulador - api.js
 * Módulo de comunicação HTTP com a API REST Java e utilitários de formatação.
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Formata um valor numérico em moeda Real Brasileiro (BRL)
 * @param {number|string} valor 
 * @returns {string} Ex: "R$ 17.890,00"
 */
function formatCurrency(valor) {
    const numero = typeof valor === 'string' ? parseFloat(valor) : (valor || 0);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

/**
 * Formata um percentual para o padrão brasileiro
 * @param {number|string} valor 
 * @returns {string} Ex: "1,89%"
 */
function formatPercent(valor) {
    const numero = typeof valor === 'string' ? parseFloat(valor) : (valor || 0);
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero) + '%';
}

/**
 * Retorna imagem fallback SVG inline caso a imagem original da moto falhe
 */
function getPlaceholderMotoImage(nome) {
    const label = encodeURIComponent(nome || 'Motocicleta');
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23171922"><rect width="600" height="400" fill="%23171922"/><circle cx="200" cy="260" r="50" stroke="%23e50914" stroke-width="8" fill="none"/><circle cx="400" cy="260" r="50" stroke="%23e50914" stroke-width="8" fill="none"/><path d="M200 260 L280 260 L330 200 L240 200 Z" fill="%233b4055"/><path d="M280 200 L320 150 L370 150" stroke="%23e50914" stroke-width="6" fill="none"/><path d="M330 200 L400 260" stroke="%233b4055" stroke-width="8"/><text x="300" y="350" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23f3f4f6" text-anchor="middle">${label}</text></svg>`;
}

/**
 * Wrapper genérico para requisições fetch com tratamento de erros padronizado
 */
async function fetchApi(endpoint, options = {}) {
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            let errorMessage = 'Ocorreu um erro na requisição.';
            if (data && data.message) {
                errorMessage = data.message;
            } else if (data && data.errosValidacao && data.errosValidacao.length > 0) {
                errorMessage = data.errosValidacao.map(e => `${e.campo}: ${e.mensagem}`).join(' | ');
            }
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            throw new Error('Não foi possível conectar à API Java em ' + API_BASE_URL + '. Certifique-se de que o back-end Spring Boot está em execução.');
        }
        throw err;
    }
}

// Objeto de métodos da API
const api = {
    /**
     * Consulta as motos cadastradas no catálogo
     */
    async getMotos(filtros = {}) {
        const params = new URLSearchParams();
        if (filtros.busca) params.append('busca', filtros.busca);
        if (filtros.categoria && filtros.categoria !== 'todas') params.append('categoria', filtros.categoria);
        if (filtros.precoMin) params.append('precoMin', filtros.precoMin);
        if (filtros.precoMax) params.append('precoMax', filtros.precoMax);

        const qs = params.toString() ? `?${params.toString()}` : '';
        return fetchApi(`/motos${qs}`);
    },

    /**
     * Busca os detalhes de uma moto pelo ID
     */
    async getMotoById(id) {
        return fetchApi(`/motos/${id}`);
    },

    /**
     * Obtém as configurações e taxas padrão do servidor
     */
    async getConfiguracao() {
        return fetchApi('/simulacoes/configuracao');
    },

    /**
     * Realiza o cálculo de financiamento (Tabela Price)
     */
    async simularFinanciamento(payload) {
        return fetchApi('/simulacoes/financiamento', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    /**
     * Realiza a simulação de consórcio
     */
    async simularConsorcio(payload) {
        return fetchApi('/simulacoes/consorcio', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    /**
     * Realiza a comparação lado a lado entre as duas modalidades
     */
    async comparar(payload) {
        return fetchApi('/simulacoes/comparar', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
};
