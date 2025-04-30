/**
 * Ejemplo básico de un cliente MCP
 */

const { MCPClient } = require('../src/client');

// Función principal asíncrona
async function main() {
  // Crear una instancia del cliente
  const client = new MCPClient({
    name: "Cliente de Ejemplo",
    serverUrl: "http://localhost:3000"
  });
  
  try {
    // Conectar al servidor
    const connected = await client.connect();
    
    if (!connected) {
      console.error('No se pudo conectar al servidor MCP');
      return;
    }
    
    console.log('Conectado al servidor MCP');
    
    // Obtener contexto
    console.log('\nSolicitando contexto...');
    const contextResponse = await client.getContext({
      topic: "ejemplo",
      limit: 5
    });
    
    console.log('Respuesta de contexto:', JSON.stringify(contextResponse, null, 2));
    
    // Actualizar contexto
    console.log('\nActualizando contexto...');
    const updateResponse = await client.updateContext({
      topic: "ejemplo",
      data: {
        text: "Información actualizada de ejemplo",
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('Respuesta de actualización:', JSON.stringify(updateResponse, null, 2));
    
    // Desconectar
    client.disconnect();
    console.log('\nDesconectado del servidor MCP');
    
  } catch (error) {
    console.error('Error en el cliente MCP:', error);
  }
}

// Ejecutar la función principal
main().catch(console.error);
