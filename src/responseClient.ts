import { createHmac } from 'crypto';
import { createHttpClient } from './httpClient';
import type { CrewhiveSDKConfig } from './config';
import type { CrewWebhookResponse } from './types';

const DEFAULT_SIGNATURE_HEADER = 'x-crew-signature';
const DEFAULT_TIMESTAMP_HEADER = 'x-crew-request-timestamp';

export interface AgentResponseClientConfig extends CrewhiveSDKConfig {
  agentId: string;
  secretKey: string;
  signatureHeader?: string;
  timestampHeader?: string;
}

export interface SendAgentResponseOptions extends CrewWebhookResponse {
  sessionId: string;
}

export function createAgentResponseClient(config: AgentResponseClientConfig) {
  const http = createHttpClient(config);
  const signatureHeader = config.signatureHeader ?? DEFAULT_SIGNATURE_HEADER;
  const timestampHeader = config.timestampHeader ?? DEFAULT_TIMESTAMP_HEADER;

  async function send(options: SendAgentResponseOptions) {
    if (!options.sessionId) {
      throw new Error('sessionId is required when sending a response back to Crewhive.');
    }

    const body = JSON.stringify({
      taskId: options.taskId,
      requestId: options.requestId,
      status: options.status ?? 'completed',
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

    return http<{ success: boolean }>({
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
