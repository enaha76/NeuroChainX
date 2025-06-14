// src/config/hedera.js
const { Client, PrivateKey, AccountId } = require('@hashgraph/sdk');
require('dotenv').config();

class HederaClient {
    constructor() {
        this.client = null;
        this.operatorAccountId = null;
        this.operatorPrivateKey = null;
    }

    async initialize() {
        try {
            // Configuration du client Hedera
            if (process.env.HEDERA_NETWORK === 'testnet') {
                this.client = Client.forTestnet();
            } else {
                this.client = Client.forMainnet();
            }

            // Configuration du compte opérateur
            this.operatorAccountId = AccountId.fromString(process.env.ACCOUNT_ID);
            this.operatorPrivateKey = PrivateKey.fromStringDer(process.env.PRIVATE_KEY);

            this.client.setOperator(
                this.operatorAccountId,
                this.operatorPrivateKey
            );

            console.log('✅ Hedera client initialized successfully');
            return this.client;
        } catch (error) {
            console.error('❌ Failed to initialize Hedera client:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error('Hedera client not initialized. Call initialize() first.');
        }
        return this.client;
    }

    getOperatorAccountId() {
        return this.operatorAccountId;
    }

    getOperatorPrivateKey() {
        return this.operatorPrivateKey;
    }
}

module.exports = new HederaClient();