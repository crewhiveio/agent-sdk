export declare function generateSecretKey(prefix?: string): string;
export declare function generateApiKey(prefix?: string): string;
export declare function buildWebhookUrl(agentId: string, baseUrl?: string): string;
export declare function generateIntegrationCredentials({ agentId, baseUrl, apiKeyPrefix, secretKeyPrefix, }: {
    agentId: string;
    baseUrl?: string;
    apiKeyPrefix?: string;
    secretKeyPrefix?: string;
}): {
    secretKey: string;
    apiKey: string;
    webhookUrl: string;
};
