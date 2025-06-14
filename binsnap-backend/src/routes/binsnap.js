// src/routes/binsnap.js
const express = require('express');
const router = express.Router();
const hcsService = require('../services/hcsService');
const htsService = require('../services/htsService');

/**
 * POST /api/submit-bin-data
 * Soumettre les données d'un bac et récompenser l'utilisateur
 */
router.post('/submit-bin-data', async (req, res) => {
    try {
        const {
            binId,
            fillLevel,
            contamination,
            imageHash,
            gps,
            userId,
            userAccountId
        } = req.body;

        // Validation des données
        if (!binId || fillLevel === undefined || !imageHash || !gps || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: binId, fillLevel, imageHash, gps, userId'
            });
        }

        if (fillLevel < 0 || fillLevel > 100) {
            return res.status(400).json({
                success: false,
                error: 'fillLevel must be between 0 and 100'
            });
        }

        // Préparer les données pour HCS
        const binData = {
            binId,
            fillLevel,
            contamination: contamination || false,
            imageHash,
            gps,
            userId,
            timestamp: new Date().toISOString()
        };

        // 1. Ancrer les données sur HCS
        const hcsResult = await hcsService.submitBinData(binData);

        // 2. Distribuer les CleanTokens (seulement si userAccountId fourni)
        let tokenResult = null;
        if (userAccountId) {
            try {
                tokenResult = await htsService.distributeTokens(userAccountId, 10);
            } catch (tokenError) {
                console.error('Token distribution failed:', tokenError);
                // Continue même si la distribution échoue
            }
        }

        res.json({
            success: true,
            message: 'Bin data submitted successfully',
            hcs: hcsResult,
            tokens: tokenResult,
            data: binData
        });

    } catch (error) {
        console.error('Submit bin data error:', error);
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