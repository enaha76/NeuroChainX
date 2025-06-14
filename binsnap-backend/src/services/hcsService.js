// src/services/hcsService.js
const { 
    TopicCreateTransaction, 
    TopicMessageSubmitTransaction,
    TopicId 
} = require('@hashgraph/sdk');
const hederaClient = require('../config/hedera');

class HCSService {
    constructor() {
        this.topicId = process.env.HCS_TOPIC_ID ? TopicId.fromString(process.env.HCS_TOPIC_ID) : null;
    }

    /**
     * Créer un topic HCS pour BinSnap
     */
    async createTopic() {
        try {
            const client = hederaClient.getClient();
            
            const transaction = new TopicCreateTransaction()
                .setTopicMemo("BinSnap - Smart Waste Management")
                .setAdminKey(hederaClient.getOperatorPrivateKey().publicKey)
                .setSubmitKey(hederaClient.getOperatorPrivateKey().publicKey);

            const response = await transaction.execute(client);
            const receipt = await response.getReceipt(client);
            
            this.topicId = receipt.topicId;
            
            console.log(`✅ Topic created with ID: ${this.topicId}`);
            console.log(`⚠️  Add this to your .env: HCS_TOPIC_ID=${this.topicId}`);
            
            return this.topicId;
        } catch (error) {
            console.error('❌ Failed to create topic:', error);
            throw error;
        }
    }

    /**
     * Ancrer les données BinSnap sur HCS
     */
    async submitBinData(binData) {
        try {
            if (!this.topicId) {
                throw new Error('Topic ID not set. Create topic first or set HCS_TOPIC_ID in .env');
            }

            const client = hederaClient.getClient();
            
            // Préparer le message (max 200 octets)
            const message = JSON.stringify({
                binId: binData.binId,
                fillLevel: binData.fillLevel,
                contamination: binData.contamination,
                imageHash: binData.imageHash,
                gps: binData.gps,
                timestamp: binData.timestamp,
                userId: binData.userId
            });

            // Vérifier la taille (200 octets max)
            if (Buffer.byteLength(message, 'utf8') > 200) {
                throw new Error(`Message too large: ${Buffer.byteLength(message, 'utf8')} bytes (max 200)`);
            }

            const transaction = new TopicMessageSubmitTransaction()
                .setTopicId(this.topicId)
                .setMessage(message);

            const response = await transaction.execute(client);
            const receipt = await response.getReceipt(client);
            
            console.log(`✅ Message submitted to topic. Sequence: ${receipt.topicSequenceNumber}`);
            
            return {
                success: true,
                topicId: this.topicId,
                sequenceNumber: receipt.topicSequenceNumber,
                transactionId: response.transactionId,
                messageSize: Buffer.byteLength(message, 'utf8')
            };
        } catch (error) {
            console.error('❌ Failed to submit message:', error);
            throw error;
        }
    }

    /**
     * Obtenir l'ID du topic
     */
    getTopicId() {
        return this.topicId;
    }
}

module.exports = new HCSService();