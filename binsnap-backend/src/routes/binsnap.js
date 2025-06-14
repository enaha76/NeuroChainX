// src/routes/binsnap.js
const express = require('express');
const router = express.Router();
const hcsService = require('../services/hcsService');
const htsService = require('../services/htsService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const aiAnalysisService = require('../services/aiAnalysisService');

/**
 * POST /api/submit-bin-data
 * Soumettre les données d'un bac et récompenser l'utilisateur
 * 
 * 
 */


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'bin-image-' + uniqueSuffix + path.extname(file.originalname));
    }
})


const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});


/**
 * POST /api/submit-bin-data
 * Soumettre les données d'un bac avec image et récompenser l'utilisateur
 */
router.post('/submit-bin-data', upload.single('image'), async (req, res) => {
    let imagePath = null;
    
    try {
        const {
            binId,
            gps,
            userId,
            userAccountId,
            description
        } = req.body;

        // Validation des données
        if (!binId || !gps || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: binId, gps, userId'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Image file is required'
            });
        }

        imagePath = req.file.path;

        // Parse GPS data if it's a string
        let gpsData;
        try {
            gpsData = typeof gps === 'string' ? JSON.parse(gps) : gps;
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid GPS data format'
            });
        }

        // 1. Analyze image with AI
        console.log('🔍 Analyzing image with AI...');
        const aiResult = await aiAnalysisService.analyzeBinImage(imagePath);
        
        // Create image hash
        const imageData = fs.readFileSync(imagePath);
        let imageHash = 0;
        for (let i = 0; i < imageData.length; i++) {
            imageHash = ((imageHash << 5) - imageHash) + imageData[i];
            imageHash = imageHash & imageHash;
        }
        imageHash = Math.abs(imageHash).toString(16);

        // Préparer les données pour HCS
        const binData = {
            binId,
            fillLevel: aiResult.fillLevel,
            contamination: aiResult.urgency === 'high',
            imageHash,
            gps: gpsData,
            userId,
            timestamp: new Date().toISOString()
            // Note: aiAnalysis is kept separate and not sent to HCS to save bytes
        };

        // 2. Ancrer les données sur HCS
        console.log('⛓️ Submitting to blockchain...');
        const hcsResult = await hcsService.submitBinData(binData);

        // 3. Distribuer les CleanTokens (seulement si userAccountId fourni)
        let tokenResult = null;
        if (userAccountId) {
            try {
                console.log('🪙 Distributing tokens...');
                tokenResult = await htsService.distributeTokens(userAccountId, 10);
            } catch (tokenError) {
                console.error('Token distribution failed:', tokenError);
                // Continue même si la distribution échoue
            }
        }

        // 4. Clean up uploaded file
        fs.unlinkSync(imagePath);

        res.json({
            success: true,
            message: 'Bin data submitted successfully',
            hcs: hcsResult,
            tokens: tokenResult,
            aiAnalysis: aiResult,
            data: binData
        });

    } catch (error) {
        console.error('Submit bin data error:', error);
        
        // Clean up uploaded file in case of error
        if (imagePath && fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/setup/create-topic
 * Créer le topic HCS (à faire une seule fois)
 */
router.post('/setup/create-topic', async (req, res) => {
    try {
        const topicId = await hcsService.createTopic();
        res.json({
            success: true,
            topicId: topicId.toString(),
            message: 'Topic created successfully'
        });
    } catch (error) {
        console.error('Create topic error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/setup/create-token
 * Créer le token CleanToken (à faire une seule fois)
 */
router.post('/setup/create-token', async (req, res) => {
    try {
        const tokenId = await htsService.createCleanToken();
        res.json({
            success: true,
            tokenId: tokenId.toString(),
            message: 'CleanToken created successfully'
        });
    } catch (error) {
        console.error('Create token error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/status
 * Vérifier le statut du service
 */
router.get('/status', async (req, res) => {
    try {
        res.json({
            success: true,
            services: {
                hcs: {
                    topicId: hcsService.getTopicId()?.toString() || 'Not configured',
                    configured: !!hcsService.getTopicId()
                },
                hts: {
                    tokenId: htsService.getTokenId()?.toString() || 'Not configured',
                    configured: !!htsService.getTokenId()
                }
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/distribute-tokens
 * Distribuer des tokens manuellement (pour tests)
 */
router.post('/distribute-tokens', async (req, res) => {
    try {
        const { userAccountId, amount = 10 } = req.body;

        if (!userAccountId) {
            return res.status(400).json({
                success: false,
                error: 'userAccountId is required'
            });
        }

        const result = await htsService.distributeTokens(userAccountId, amount);
        res.json({
            success: true,
            result,
            message: `${amount} CleanTokens distributed to ${userAccountId}`
        });
    } catch (error) {
        console.error('Distribute tokens error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;