// src/services/htsService.js
const { 
    TokenCreateTransaction,
    TokenSupplyType,
    TokenType,
    TokenMintTransaction,
    TransferTransaction,
    TokenId,
    AccountId,
    Hbar
} = require('@hashgraph/sdk');
const hederaClient = require('../config/hedera');

class HTSService {
    constructor() {
        this.tokenId = process.env.HTS_TOKEN_ID ? TokenId.fromString(process.env.HTS_TOKEN_ID) : null;
    }

    /**
     * Créer le token CleanToken
     */
    async createCleanToken() {
        try {
            const client = hederaClient.getClient();
            const operatorKey = hederaClient.getOperatorPrivateKey();
            
            const transaction = new TokenCreateTransaction()
                .setTokenName("CleanToken")
                .setTokenSymbol("CLEAN")
                .setTokenType(TokenType.FungibleCommon)
                .setDecimals(0) // Pas de décimales pour simplicité
                .setInitialSupply(0) // On va mint selon les besoins
                .setSupplyType(TokenSupplyType.Infinite)
                .setTreasuryAccountId(hederaClient.getOperatorAccountId())
                .setSupplyKey(operatorKey)
                .setAdminKey(operatorKey);

            const response = await transaction.execute(client);
            const receipt = await response.getReceipt(client);
            
            this.tokenId = receipt.tokenId;
            
            console.log(`✅ CleanToken created with ID: ${this.tokenId}`);
            console.log(`⚠️  Add this to your .env: HTS_TOKEN_ID=${this.tokenId}`);
            
            return this.tokenId;
        } catch (error) {
            console.error('❌ Failed to create token:', error);
            throw error;
        }
    }

    /**
     * Distribuer 10 CleanTokens à un utilisateur
     */
    async distributeTokens(userAccountId, amount = 10) {
        try {
            if (!this.tokenId) {
                throw new Error('Token ID not set. Create token first or set HTS_TOKEN_ID in .env');
            }

            const client = hederaClient.getClient();
            const treasuryId = hederaClient.getOperatorAccountId();
            const userAccount = AccountId.fromString(userAccountId);

            // 1. Mint les tokens nécessaires
            const mintTx = new TokenMintTransaction()
                .setTokenId(this.tokenId)
                .setAmount(amount);

            const mintResponse = await mintTx.execute(client);
            const mintReceipt = await mintResponse.getReceipt(client);
            
            console.log(`✅ Minted ${amount} tokens`);

            // 2. Transférer les tokens à l'utilisateur
            const transferTx = new TransferTransaction()
                .addTokenTransfer(this.tokenId, treasuryId, -amount)
                .addTokenTransfer(this.tokenId, userAccount, amount);

            const transferResponse = await transferTx.execute(client);
            const transferReceipt = await transferResponse.getReceipt(client);
            
            console.log(`✅ Transferred ${amount} CleanTokens to ${userAccountId}`);
            
            return {
                success: true,
                tokenId: this.tokenId,
                recipient: userAccountId,
                amount: amount,
                mintTransactionId: mintResponse.transactionId,
                transferTransactionId: transferResponse.transactionId
            };
        } catch (error) {
            console.error('❌ Failed to distribute tokens:', error);
            throw error;
        }
    }

    /**
     * Obtenir les infos du token
     */
    async getTokenInfo() {
        try {
            if (!this.tokenId) {
                throw new Error('Token ID not set');
            }

            const client = hederaClient.getClient();
            const tokenInfo = await new TokenInfoQuery()
                .setTokenId(this.tokenId)
                .execute(client);

            return {
                tokenId: this.tokenId,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                totalSupply: tokenInfo.totalSupply.toString(),
                decimals: tokenInfo.decimals
            };
        } catch (error) {
            console.error('❌ Failed to get token info:', error);
            throw error;
        }
    }

    /**
     * Obtenir l'ID du token
     */
    getTokenId() {
        return this.tokenId;
    }
}

module.exports = new HTSService();