// src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const hederaClient = require('./config/hedera');
const binsnapRoutes = require('./routes/binsnap');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', binsnapRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'BinSnap Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            status: 'GET /api/status',
            submitBinData: 'POST /api/submit-bin-data',
            createTopic: 'POST /api/setup/create-topic',
            createToken: 'POST /api/setup/create-token',
            distributeTokens: 'POST /api/distribute-tokens'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Initialize Hedera and start server
async function startServer() {
    try {
        console.log('🚀 Starting BinSnap Backend...');
        
        // Initialize Hedera client
        await hederaClient.initialize();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}`);
            console.log(`🔧 Status endpoint: http://localhost:${PORT}/api/status`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;