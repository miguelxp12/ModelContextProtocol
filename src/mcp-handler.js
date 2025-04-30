/**
 * Manejador de solicitudes MCP
 * 
 * Este módulo implementa la lógica para procesar solicitudes
 * según el protocolo MCP (Model Context Protocol).
 */

// Tipos de solicitudes MCP soportadas
const REQUEST_TYPES = {
  SEARCH: 'search',
  RETRIEVE: 'retrieve',
  UPDATE: 'update',
  LIST: 'list',
  PING: 'ping'
};

/**
 * Crea un manejador MCP con funcionalidades básicas
 */
function createMCPHandler() {
  // Almacenamiento simulado para fines de demostración
  const dataStore = {
    documents: [
      { id: 'doc1', title: 'Introducción a MCP', content: 'El Model Context Protocol es un estándar abierto...' },
      { id: 'doc2', title: 'Implementación de MCP', content: 'Para implementar un servidor MCP, necesitas...' },
      { id: 'doc3', title: 'Casos de uso de MCP', content: 'MCP puede utilizarse en diversos escenarios...' },
    ],
    
    // Búsqueda básica en documentos
    search(query) {
      const results = this.documents.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) || 
        doc.content.toLowerCase().includes(query.toLowerCase())
      );
      
      return results.map(doc => ({
        id: doc.id,
        title: doc.title,
        excerpt: doc.content.substring(0, 100) + '...',
        score: 0.8 // Score simulado
      }));
    },
    
    // Recuperar documento por ID
    retrieve(id) {
      const doc = this.documents.find(d => d.id === id);
      if (!doc) return null;
      return doc;
    },
    
    // Listar todos los documentos
    list() {
      return this.documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        excerpt: doc.content.substring(0, 100) + '...'
      }));
    },
    
    // Actualizar un documento (simulado)
    update(id, content) {
      const docIndex = this.documents.findIndex(d => d.id === id);
      if (docIndex === -1) return false;
      
      this.documents[docIndex] = {
        ...this.documents[docIndex],
        ...content
      };
      
      return true;
    }
  };
  
  /**
   * Maneja las solicitudes MCP entrantes
   * @param {Object} request - Solicitud MCP entrante
   * @returns {Object} Respuesta MCP
   */
  async function handleRequest(request) {
    // Validar la solicitud
    if (!request || !request.type) {
      return {
        error: 'Solicitud inválida',
        details: 'El campo "type" es obligatorio'
      };
    }
    
    // Procesar solicitud según su tipo
    switch (request.type) {
      case REQUEST_TYPES.SEARCH:
        if (!request.query) {
          return { error: 'Parámetro "query" faltante' };
        }
        
        return {
          type: 'search_results',
          results: dataStore.search(request.query),
          meta: {
            total: dataStore.search(request.query).length,
            query: request.query
          }
        };
        
      case REQUEST_TYPES.RETRIEVE:
        if (!request.id) {
          return { error: 'Parámetro "id" faltante' };
        }
        
        const doc = dataStore.retrieve(request.id);
        if (!doc) {
          return { error: 'Documento no encontrado', id: request.id };
        }
        
        return {
          type: 'document',
          document: doc
        };
        
      case REQUEST_TYPES.LIST:
        return {
          type: 'document_list',
          documents: dataStore.list(),
          meta: {
            total: dataStore.documents.length
          }
        };
        
      case REQUEST_TYPES.UPDATE:
        if (!request.id || !request.content) {
          return { error: 'Parámetros "id" y "content" son obligatorios' };
        }
        
        const success = dataStore.update(request.id, request.content);
        if (!success) {
          return { error: 'Documento no encontrado', id: request.id };
        }
        
        return {
          type: 'update_success',
          id: request.id
        };
        
      case REQUEST_TYPES.PING:
        return {
          type: 'pong',
          timestamp: new Date().toISOString(),
          version: '0.1.0'
        };
        
      default:
        return {
          error: 'Tipo de solicitud no soportado',
          supportedTypes: Object.values(REQUEST_TYPES)
        };
    }
  }
  
  // API pública del manejador MCP
  return {
    handleRequest,
    REQUEST_TYPES
  };
}

module.exports = { createMCPHandler };
