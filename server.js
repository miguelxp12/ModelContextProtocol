// Implementación básica de un servidor MCP (Model Context Protocol)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo (en una aplicación real, estos provendrían de una base de datos o API)
const sampleData = {
  documents: [
    { id: '1', title: 'Introducción al MCP', content: 'El Model Context Protocol es un estándar abierto que permite conectar fuentes de datos con herramientas de IA...' },
    { id: '2', title: 'Implementación de Servidores MCP', content: 'Para implementar un servidor MCP, es necesario seguir las especificaciones del protocolo...' },
    { id: '3', title: 'Casos de Uso del MCP', content: 'El MCP puede utilizarse en una variedad de escenarios, incluyendo asistentes de IA, herramientas de desarrollo...' }
  ]
};

// Rutas MCP básicas

// Ruta de información del servidor MCP
app.get('/mcp/info', (req, res) => {
  res.json({
    name: 'Sample MCP Server',
    version: '0.1.0',
    description: 'Un servidor MCP de ejemplo para demostración',
    capabilities: ['document_search', 'document_retrieval'],
    auth_required: false
  });
});

// Búsqueda de documentos
app.post('/mcp/search', (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Se requiere un parámetro de búsqueda' });
  }
  
  // Implementación simple de búsqueda
  const results = sampleData.documents.filter(doc => 
    doc.title.toLowerCase().includes(query.toLowerCase()) || 
    doc.content.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    results,
    total: results.length,
    query
  });
});

// Recuperación de documento por ID
app.get('/mcp/documents/:id', (req, res) => {
  const { id } = req.params;
  const document = sampleData.documents.find(doc => doc.id === id);
  
  if (!document) {
    return res.status(404).json({ error: 'Documento no encontrado' });
  }
  
  res.json(document);
});

// Listar todos los documentos
app.get('/mcp/documents', (req, res) => {
  // En una implementación real, esto tendría paginación
  res.json({
    documents: sampleData.documents.map(({ id, title }) => ({ id, title })),
    total: sampleData.documents.length
  });
});

// Endpoint de salud para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor MCP ejecutándose en http://localhost:${PORT}`);
});
