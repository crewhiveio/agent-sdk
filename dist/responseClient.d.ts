import type { CrewhiveSDKConfig } from './config';
import type { CrewWebhookResponse } from './types';
export interface AgentResponseClientConfig extends CrewhiveSDKConfig {
    agentId: string;
    secretKey: string;
    signatureHeader?: string;
    timestampHeader?: string;
}
export interface SendAgentResponseOptions extends CrewWebhookResponse {
    sessionId: string;
}
export declare function createAgentResponseClient(config: AgentResponseClientConfig): {
    send: (options: SendAgentResponseOptions) => Promise<{
        success: boolean;
    }>;
};
