// src/services/aiAnalysisService.js
const axios = require('axios');
const fs = require('fs');

class AIAnalysisService {
    constructor() {
        this.API_KEY = process.env.OPENROUTER_API_KEY || "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";
        this.API_URL = "https://openrouter.ai/api/v1/chat/completions";
        this.MODEL = "moonshotai/kimi-vl-a3b-thinking:free";
    }

    /**
     * Analyze trash bin image to determine fill level
     */
    async analyzeBinImage(imagePath) {
        try {
            // Load and encode image as base64
            const imageData = fs.readFileSync(imagePath);
            const imgBase64 = imageData.toString("base64");

            // Build request payload
            const payload = {
                model: this.MODEL,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "This is a photo of a trash bin. " +
                                      "Classify its fill level using one of the following: low, medium, or high. " +
                                      "Return only the word."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imgBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.1
            };

            // Send request
            const response = await axios.post(this.API_URL, payload, {
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data?.choices?.[0]?.message?.content?.trim().toLowerCase();
            
            if (!content) {
                throw new Error("No response content found from AI service");
            }

            // Extract fill level
            const match = content.match(/\b(low|medium|high)\b/g);
            if (match && match.length > 0) {
                const fillLevel = match[match.length - 1];
                
                // Map to fill percentage
                const fillLevelMap = {
                    'low': 25,
                    'medium': 50,
                    'high': 75
                };

                return {
                    success: true,
                    fillLevel: fillLevelMap[fillLevel] || 50,
                    urgency: fillLevel,
                    confidence: 85, // Mock confidence
                    rawResponse: content
                };
            } else {
                console.warn("No valid label found in AI response:", content);
                return {
                    success: false,
                    fillLevel: 50, // Default
                    urgency: 'medium',
                    confidence: 0,
                    rawResponse: content,
                    error: "Could not determine fill level"
                };
            }

        } catch (error) {
            console.error('AI Analysis failed:', error.response?.data || error.message);
            return {
                success: false,
                fillLevel: 50, // Default fallback
                urgency: 'medium',
                confidence: 0,
                error: error.message
            };
        }
    }
}

module.exports = new AIAnalysisService();