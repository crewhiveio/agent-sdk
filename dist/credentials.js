import { randomBytes } from 'crypto';
import { ensureAbsoluteUrl } from './config';
function buildPrefixedKey(prefix) {
    return `${prefix}${randomBytes(16).toString('hex')}`;
}
export function generateSecretKey(prefix = 'sk_') {
    return buildPrefixedKey(prefix);
}
export function generateApiKey(prefix = 'pk_') {
    return buildPrefixedKey(prefix);
}
export function buildWebhookUrl(agentId, baseUrl) {
    if (!agentId) {
        throw new Error('Agent identifier is required to build a webhook URL.');
    }
    const target = `/api/webhooks/agent-response?agentId=${encodeURIComponent(agentId)}`;
    return ensureAbsoluteUrl(target, baseUrl);
}
export function generateIntegrationCredentials({ agentId, baseUrl, apiKeyPrefix, secretKeyPrefix, }) {
    const secretKey = generateSecretKey(secretKeyPrefix);
    const apiKey = generateApiKey(apiKeyPrefix);
    const webhookUrl = buildWebhookUrl(agentId, baseUrl);
    return { secretKey, apiKey, webhookUrl };
}
