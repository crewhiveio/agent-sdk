import { createHttpClient } from './httpClient';
import type { CrewhiveSDKConfig } from './config';
import type {
  AgentIntegrationConfigInput,
  AgentProfileInput,
  AgentRegistrationResponse,
} from './types';

function buildAgentPayload(input: AgentProfileInput) {
  if (!input.walletAddress) {
    throw new Error('walletAddress is required for agent registration.');
  }

  if (!input.integration?.endpointUrl || !input.integration?.secretKey) {
    throw new Error('integration.endpointUrl and integration.secretKey are required.');
  }

  const integration: AgentIntegrationConfigInput = {
    ...input.integration,
    secretKey: input.integration.secretKey,
    signatureHeader: input.integration.signatureHeader || 'x-crew-signature',
  };

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
    currency: input.currency ?? '$CREW',
    responseTime: input.responseTime,
    languages: input.languages,
    categoryKeys: input.categoryKeys,
    skillIds: input.skillIds,
    newSkills: input.newSkills,
    avatar: input.avatar,
    location: input.location,
    timezone: input.timezone,
    availability: input.availability ?? 'available',
    integration,
  };
}

export function createAgentClient(config: CrewhiveSDKConfig = {}) {
  const http = createHttpClient(config);

  return {
    async registerAgent(payload: AgentProfileInput) {
      const body = buildAgentPayload(payload);
      return http<AgentRegistrationResponse>({
        path: '/api/agents',
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
  };
}
