/**
 * Cliente simple para el Model Context Protocol (MCP)
 * 
 * Este ejemplo muestra cómo un cliente puede conectarse a un servidor MCP
 * para obtener información contextual.
 */

const WebSocket = require('ws');
const fetch = require('node-fetch');

class MCPClient {
  /**
   * Crea un nuevo cliente MCP
   * @param {string} serverUrl - URL del servidor MCP
   */
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.wsConnection = null;
  }

  /**
   * Realiza una solicitud HTTP al servidor MCP
   * @param {Object} requestData - Datos de la solicitud
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async sendRequest(requestData) {
    try {
      const response = await fetch(`${this.serverUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al enviar solicitud MCP:', error);
      throw error;
    }
  }

  /**
   * Establece una conexión WebSocket con el servidor MCP
   * @returns {Promise<WebSocket>} Conexión WebSocket establecida
   */
  async connectWebSocket() {
    return new Promise((resolve, reject) => {
      const wsUrl = this.serverUrl.replace(/^http/, 'ws') + '/ws';
      const ws = new WebSocket(wsUrl);

      ws.on('open', () => {
        console.log('Conexión WebSocket establecida');
        this.wsConnection = ws;
        resolve(ws);
      });

      ws.on('error', (error) => {
        console.error('Error en la conexión WebSocket:', error);
        reject(error);
      });

      ws.on('close', () => {
        console.log('Conexión WebSocket cerrada');
        this.wsConnection = null;
      });

      ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Mensaje recibido:', data);
        // Aquí puedes manejar los mensajes entrantes
      });
    });
  }

  /**
   * Envía un mensaje a través de la conexión WebSocket
   * @param {Object} data - Datos a enviar
   */
  sendWebSocketMessage(data) {
    if (!this.wsConnection) {
      throw new Error('No hay conexión WebSocket establecida');
    }

    this.wsConnection.send(JSON.stringify(data));
  }

  /**
   * Cierra la conexión WebSocket
   */
  closeWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  /**
   * Busca documentos en el servidor MCP
   * @param {string} query - Consulta de búsqueda
   * @returns {Promise<Object>} Resultados de la búsqueda
   */
  async search(query) {
    return this.sendRequest({
      type: 'search',
      query,
    });
  }

  /**
   * Recupera un documento específico del servidor MCP
   * @param {string} id - ID del documento
   * @returns {Promise<Object>} Documento recuperado
   */
  async retrieveDocument(id) {
    return this.sendRequest({
      type: 'retrieve',
      id,
    });
  }

  /**
   * Lista todos los documentos disponibles en el servidor MCP
   * @returns {Promise<Object>} Lista de documentos
   */
  async listDocuments() {
    return this.sendRequest({
      type: 'list',
    });
  }

  /**
   * Verifica la conexión con el servidor MCP
   * @returns {Promise<Object>} Respuesta de ping
   */
  async ping() {
    return this.sendRequest({
      type: 'ping',
    });
  }
}

// Ejemplo de uso
async function runExample() {
  const client = new MCPClient('http://localhost:3000');

  try {
    // Verificar conexión
    console.log('Verificando conexión...');
    const pingResponse = await client.ping();
    console.log('Respuesta de ping:', pingResponse);

    // Listar documentos
    console.log('\nListando documentos...');
    const documentList = await client.listDocuments();
    console.log('Documentos disponibles:', documentList);

    // Buscar documentos
    console.log('\nBuscando documentos con "MCP"...');
    const searchResults = await client.search('MCP');
    console.log('Resultados de búsqueda:', searchResults);

    if (searchResults.results && searchResults.results.length > 0) {
      // Recuperar un documento específico
      const docId = searchResults.results[0].id;
      console.log(`\nRecuperando documento con ID ${docId}...`);
      const document = await client.retrieveDocument(docId);
      console.log('Documento recuperado:', document);
    }

    // Conexión WebSocket (opcional)
    console.log('\nEstableciendo conexión WebSocket...');
    try {
      await client.connectWebSocket();
      
      // Enviar solicitud a través de WebSocket
      console.log('Enviando solicitud a través de WebSocket...');
      client.sendWebSocketMessage({ type: 'ping' });
      
      // Mantener conexión abierta por un momento para recibir respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cerrar conexión
      client.closeWebSocket();
    } catch (wsError) {
      console.log('WebSocket no disponible, continuando con HTTP');
    }

  } catch (error) {
    console.error('Error durante la ejecución del ejemplo:', error);
  }
}

// Ejecutar el ejemplo si este script se ejecuta directamente
if (require.main === module) {
  runExample().catch(console.error);
}

module.exports = MCPClient;
