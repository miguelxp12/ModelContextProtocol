// Ejemplo de cómo integrar un servidor MCP con Claude
// Nota: Este es un ejemplo conceptual y no una implementación completa

import MCPClient from './client.js';
import dotenv from 'dotenv';

dotenv.config();

// Clase de ejemplo para simular un cliente Claude
class ClaudeAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // En una implementación real, esto establecería una conexión con la API de Claude
  }

  // Método de ejemplo para enviar un mensaje a Claude
  async sendMessage(message, context = null) {
    console.log(`Enviando mensaje a Claude: "${message}"`);
    
    if (context) {
      console.log('Contexto proporcionado:', context);
    }
    
    // Simulación de respuesta (en una implementación real, esto llamaría a la API de Claude)
    return {
      role: 'assistant',
      content: `Respuesta simulada de Claude basada en: "${message}" ${context ? 'con contexto adicional' : 'sin contexto adicional'}`
    };
  }
}

// Función para enriquecer consultas a Claude con información del servidor MCP
const enrichQueryWithMCPContext = async (query, mcpClient) => {
  console.log(`Enriqueciendo consulta "${query}" con información del servidor MCP...`);
  
  try {
    // Buscar documentos relevantes basados en la consulta
    const searchResults = await mcpClient.searchDocuments(query);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      console.log('No se encontraron documentos relevantes en el servidor MCP.');
      return { query, context: null };
    }
    
    // Preparar el contexto con la información encontrada
    const context = {
      type: 'mcp_data',
      source: 'sample_mcp_server',
      documents: searchResults.results.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content
      }))
    };
    
    console.log(`Se encontraron ${context.documents.length} documentos relevantes.`);
    
    return { query, context };
  } catch (error) {
    console.error('Error al enriquecer la consulta con datos MCP:', error);
    return { query, context: null };
  }
};

// Función principal para demostrar la integración
const demonstrateIntegration = async () => {
  const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'fake_api_key_for_demo';
  
  console.log('Iniciando demostración de integración Claude-MCP...');
  
  // Inicializar los clientes
  const mcpClient = new MCPClient(MCP_SERVER_URL);
  const claudeClient = new ClaudeAIClient(CLAUDE_API_KEY);
  
  try {
    // Verificar que el servidor MCP está funcionando
    const health = await mcpClient.checkHealth();
    console.log('Servidor MCP disponible:', health);
    
    // Consultas de ejemplo para demostrar
    const queries = [
      '¿Qué es el Model Context Protocol?',
      '¿Cómo implemento un servidor MCP?',
      '¿Cuáles son los casos de uso comunes del MCP?'
    ];
    
    // Procesar cada consulta
    for (const query of queries) {
      console.log('\n-----------------------------------');
      console.log(`Procesando consulta: "${query}"`);
      
      // 1. Enriquecer la consulta con información del MCP
      const { query: enrichedQuery, context } = await enrichQueryWithMCPContext(query, mcpClient);
      
      // 2. Enviar la consulta enriquecida a Claude
      const claudeResponse = await claudeClient.sendMessage(enrichedQuery, context);
      
      // 3. Mostrar la respuesta
      console.log('\nRespuesta de Claude:');
      console.log(claudeResponse.content);
      console.log('-----------------------------------\n');
    }
    
    console.log('Demostración completada con éxito!');
    
  } catch (error) {
    console.error('Error durante la demostración:', error);
  }
};

// Ejecutar la demostración
demonstrateIntegration();
