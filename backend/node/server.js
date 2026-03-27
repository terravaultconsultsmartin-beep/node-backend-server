const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());

// Health check for monitoring
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Node.js Backend Server', 
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: NODE_ENV === 'production' ? 'An error occurred' : err.message 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`✅ Server is running in ${NODE_ENV} mode`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`==========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
