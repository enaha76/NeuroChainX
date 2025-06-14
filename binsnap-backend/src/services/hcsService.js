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
     * Ancrer les données BinSnap sur HCS (optimized for 200 byte limit)
     */
  /**
 * Alternative: Store only reference hash on HCS
 */
async submitBinData(binData) {
    try {
        if (!this.topicId) {
            throw new Error('Topic ID not set. Create topic first or set HCS_TOPIC_ID in .env');
        }

        const client = hederaClient.getClient();
        
        // Create a hash of the full data
        const fullDataString = JSON.stringify(binData);
        const crypto = require('crypto');
        const dataHash = crypto.createHash('sha256').update(fullDataString).digest('hex').slice(0, 12);
        
        // Store only reference on HCS
        const message = JSON.stringify({
            hash: dataHash,
            bin: binData.binId.slice(-6),
            lvl: binData.fillLevel,
            ts: Math.floor(Date.now() / 1000)
        });

        const messageSize = Buffer.byteLength(message, 'utf8');
        console.log(`📏 Reference message size: ${messageSize} bytes`);
        console.log(`📝 Reference message: ${message}`);

        if (messageSize > 200) {
            throw new Error(`Reference message too large: ${messageSize} bytes (max 200)`);
        }

        const transaction = new TopicMessageSubmitTransaction()
            .setTopicId(this.topicId)
            .setMessage(message);

        const response = await transaction.execute(client);
        const receipt = await response.getReceipt(client);
        
        console.log(`✅ Reference message submitted. Sequence: ${receipt.topicSequenceNumber}`);
        
        return {
            success: true,
            topicId: this.topicId,
            sequenceNumber: receipt.topicSequenceNumber,
            transactionId: response.transactionId,
            messageSize: messageSize,
            dataHash: dataHash,
            messageType: 'reference'
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