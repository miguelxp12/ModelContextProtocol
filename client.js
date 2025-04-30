// Cliente MCP básico para interactuar con un servidor Model Context Protocol
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class MCPClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Obtener información sobre el servidor MCP
  async getServerInfo() {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/info`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo información del servidor MCP:', error);
      throw error;
    }
  }

  // Buscar documentos en el servidor MCP
  async searchDocuments(query) {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/search`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error buscando documentos:', error);
      throw error;
    }
  }

  // Obtener un documento específico por ID
  async getDocument(documentId) {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/documents/${documentId}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error obteniendo documento ${documentId}:`, error);
      throw error;
    }
  }

  // Listar todos los documentos disponibles
  async listDocuments() {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/documents`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listando documentos:', error);
      throw error;
    }
  }

  // Verificar la salud del servidor
  async checkHealth() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verificando salud del servidor:', error);
      throw error;
    }
  }
}

// Ejemplo de uso
const runExample = async () => {
  const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';
  
  console.log(`Conectando al servidor MCP en: ${MCP_SERVER_URL}`);
  
  const client = new MCPClient(MCP_SERVER_URL);
  
  try {
    // Verificar la salud del servidor
    console.log('Comprobando salud del servidor...');
    const health = await client.checkHealth();
    console.log('Estado del servidor:', health);
    
    // Obtener información del servidor
    console.log('Obteniendo información del servidor MCP...');
    const serverInfo = await client.getServerInfo();
    console.log('Información del servidor:', serverInfo);
    
    // Listar todos los documentos
    console.log('Listando documentos disponibles...');
    const documents = await client.listDocuments();
    console.log('Documentos disponibles:', documents);
    
    // Buscar documentos con la palabra "MCP"
    console.log('Buscando documentos con la palabra "MCP"...');
    const searchResults = await client.searchDocuments('MCP');
    console.log('Resultados de búsqueda:', searchResults);
    
    // Obtener un documento específico
    if (documents && documents.documents && documents.documents.length > 0) {
      const firstDocId = documents.documents[0].id;
      console.log(`Obteniendo detalles del documento ${firstDocId}...`);
      const documentDetails = await client.getDocument(firstDocId);
      console.log('Detalles del documento:', documentDetails);
    }
    
  } catch (error) {
    console.error('Error ejecutando ejemplo:', error);
  }
};

// Ejecutar el ejemplo si este archivo se ejecuta directamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runExample();
}

export default MCPClient;
