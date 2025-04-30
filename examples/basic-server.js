/**
 * Ejemplo básico de un servidor MCP
 */

const { MCPServer } = require('../src/server');

// Crear una instancia del servidor
const server = new MCPServer({
  name: "Servidor de Ejemplo",
  description: "Un servidor MCP básico de demostración",
  port: 3000
});

// Registrar un manejador para obtener contexto
server.registerHandler('getContext', async (params) => {
  console.log('Solicitud de contexto recibida:', params);
  
  // Este es un ejemplo simplificado. En un caso real,
  // aquí se buscaría información en una base de datos o sistema.
  return {
    context: "Este es un contexto de ejemplo",
    timestamp: new Date().toISOString(),
    query: params.query
  };
});

// Registrar un manejador para actualizar contexto
server.registerHandler('updateContext', async (params) => {
  console.log('Solicitud de actualización de contexto recibida:', params);
  
  // Este es un ejemplo simplificado. En un caso real,
  // aquí se actualizaría información en una base de datos o sistema.
  return {
    status: "Contexto actualizado correctamente",
    timestamp: new Date().toISOString(),
    updatedContext: params.context
  };
});

// Iniciar el servidor
server.start();

console.log('Servidor MCP de ejemplo iniciado. Presiona Ctrl+C para detener.');
