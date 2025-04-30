/**
 * Model Context Protocol - Punto de entrada principal
 */

const { MCPServer } = require('./server');
const { MCPClient } = require('./client');

module.exports = {
  MCPServer,
  MCPClient
};
