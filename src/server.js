/**
 * Servidor básico para Model Context Protocol (MCP)
 * 
 * Este servidor implementa un endpoint básico de MCP que responde a solicitudes
 * de contexto y puede ser consumido por clientes compatibles con MCP.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { createMCPHandler } = require('./mcp-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Punto de entrada principal para el protocolo MCP
app.post('/mcp', async (req, res) => {
  try {
    const mcpHandler = createMCPHandler();
    const result = await mcpHandler.handleRequest(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error en el procesamiento de la solicitud MCP:', error);
    res.status(500).json({ 
      error: 'Error en el procesamiento de la solicitud MCP',
      details: error.message 
    });
  }
});

// Información sobre el servidor MCP
app.get('/info', (req, res) => {
  res.json({
    name: 'Servidor MCP Básico',
    version: '0.1.0',
    protocol: 'mcp',
    capabilities: [
      'text-retrieval',
      'file-search'
    ]
  });
});

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor MCP ejecutándose en http://localhost:${PORT}`);
});

// Configurar WebSocket para conexiones en tiempo real
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Nueva conexión WebSocket establecida');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const mcpHandler = createMCPHandler();
      const result = await mcpHandler.handleRequest(data);
      ws.send(JSON.stringify(result));
    } catch (error) {
      console.error('Error en el procesamiento del mensaje WebSocket:', error);
      ws.send(JSON.stringify({ 
        error: 'Error en el procesamiento del mensaje',
        details: error.message 
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('Conexión WebSocket cerrada');
  });
});

module.exports = server;
