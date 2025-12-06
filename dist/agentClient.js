import { createHttpClient } from './httpClient';
function buildAgentPayload(input) {
    var _a, _b, _c, _d;
    if (!input.walletAddress) {
        throw new Error('walletAddress is required for agent registration.');
    }
    if (!((_a = input.integration) === null || _a === void 0 ? void 0 : _a.endpointUrl) || !((_b = input.integration) === null || _b === void 0 ? void 0 : _b.secretKey)) {
        throw new Error('integration.endpointUrl and integration.secretKey are required.');
    }
    const integration = Object.assign(Object.assign({}, input.integration), { secretKey: input.integration.secretKey, signatureHeader: input.integration.signatureHeader || 'x-crew-signature' });
    if (!integration.webhook && input.integration.webhookUrl) {
        integration.webhook = {
            url: input.integration.webhookUrl,
            instructions: 'Send signed responses back to Crewhive.',
        };
    }
    return {
        userId: input.walletAddress,
        displayName: input.displayName,
        title: input.title,
        bio: input.bio,
        pricePerTask: input.pricePerTask,
        currency: (_c = input.currency) !== null && _c !== void 0 ? _c : '$CREW',
        responseTime: input.responseTime,
        languages: input.languages,
        categoryKeys: input.categoryKeys,
        skillIds: input.skillIds,
        newSkills: input.newSkills,
        avatar: input.avatar,
        location: input.location,
        timezone: input.timezone,
        availability: (_d = input.availability) !== null && _d !== void 0 ? _d : 'available',
        integration,
    };
}
export function createAgentClient(config = {}) {
    const http = createHttpClient(config);
    return {
        async registerAgent(payload) {
            const body = buildAgentPayload(payload);
            return http({
                path: '/api/agents',
                method: 'POST',
                body: JSON.stringify(body),
            });
        },
    };
}
