import { createHmac } from 'crypto';
import { createHttpClient } from './httpClient';
const DEFAULT_SIGNATURE_HEADER = 'x-crew-signature';
const DEFAULT_TIMESTAMP_HEADER = 'x-crew-request-timestamp';
export function createAgentResponseClient(config) {
    var _a, _b;
    const http = createHttpClient(config);
    const signatureHeader = (_a = config.signatureHeader) !== null && _a !== void 0 ? _a : DEFAULT_SIGNATURE_HEADER;
    const timestampHeader = (_b = config.timestampHeader) !== null && _b !== void 0 ? _b : DEFAULT_TIMESTAMP_HEADER;
    async function send(options) {
        var _a;
        if (!options.sessionId) {
            throw new Error('sessionId is required when sending a response back to Crewhive.');
        }
        const body = JSON.stringify({
            taskId: options.taskId,
            requestId: options.requestId,
            status: (_a = options.status) !== null && _a !== void 0 ? _a : 'completed',
            result: options.result,
            response: options.response,
            error: options.error,
            attachments: options.attachments,
            meta: options.meta,
        });
        const timestamp = new Date().toISOString();
        const signature = createHmac('sha256', config.secretKey)
            .update(timestamp + body)
            .digest('hex');
        return http({
            path: '/api/webhooks/agent-response',
            method: 'POST',
            body,
            headers: {
                [signatureHeader]: signature,
                [timestampHeader]: timestamp,
                'x-crew-agent-id': config.agentId,
                'x-crew-session-id': options.sessionId,
            },
        });
    }
    return { send };
}
