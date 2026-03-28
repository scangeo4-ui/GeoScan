/**
 * ========================================
 * Configuração Global da API
 * ========================================
 * 
 * Este arquivo contém as configurações globais da API backend
 * Importar em todos os dashboards para reutilizar a mesma configuração
 * 
 * Uso:
 * <script src="../api-config.js"></script>
 * 
 * Exemplo:
 * const dados = await fetchAPI('/vibration?limit=10');
 */

// ========================================
// Configuração da API Backend
// ========================================
const API = {
    base: 'https://geo-scan-backend.vercel.app',
    endpoints: {
        vibration: '/vibration',
        rfid: '/rfid',
        // Adicione mais endpoints conforme necessário
    }
};

/**
 * Função auxiliar para fazer requisições à API
 * 
 * @param {string} endpoint - O endpoint da API (ex: '/vibration?limit=10')
 * @param {object} options - Opções de requisição (method, headers, body, etc)
 * @returns {Promise<object|null>} - Dados retornados pela API ou null em caso de erro
 * 
 * Exemplos:
 * 
 * // GET request
 * const dados = await fetchAPI('/vibration?limit=10');
 * 
 * // POST request
 * const resultado = await fetchAPI('/vibration', {
 *     method: 'POST',
 *     body: JSON.stringify({ deviceId: 'device1', value: 15.5 })
 * });
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const url = `${API.base}${endpoint}`;
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Erro ao chamar ${endpoint}:`, error);
        return null;
    }
}

/**
 * Função para enviar dados de vibração para o backend
 * 
 * @param {string} deviceId - ID do dispositivo
 * @param {number} value - Valor da vibração em mm/s
 * @returns {Promise<boolean>} - true se enviado com sucesso, false caso contrário
 */
async function enviarVibração(deviceId, value) {
    try {
        const resultado = await fetchAPI(API.endpoints.vibration, {
            method: 'POST',
            body: JSON.stringify({
                deviceId: deviceId,
                value: value
                // timestamp será gerado automaticamente no backend
            })
        });

        if (resultado && resultado.ok) {
            console.log(`✅ Vibração enviada: ${deviceId} = ${value} mm/s`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Erro ao enviar vibração:`, error);
        return false;
    }
}

/**
 * Função para buscar o último código RFID
 * 
 * @returns {Promise<string|null>} - O código RFID ou null
 */
async function obterUltimoRFID() {
    try {
        const dados = await fetchAPI(API.endpoints.rfid);
        return dados && dados.code ? dados.code : null;
    } catch (error) {
        console.error(`❌ Erro ao buscar RFID:`, error);
        return null;
    }
}

// ========================================
// Exportar para uso global
// ========================================
// Se estiver usando módulos ES6, descomente:
// export { API, fetchAPI, enviarVibração, obterUltimoRFID };

// Para uso em navegador, as funções estão disponíveis globalmente
console.log('✅ API Config carregado. Use fetchAPI() para fazer requisições.');
