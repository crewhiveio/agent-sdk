import type { CrewhiveSDKConfig } from './config';
import type { AgentProfileInput, AgentRegistrationResponse } from './types';
export declare function createAgentClient(config?: CrewhiveSDKConfig): {
    registerAgent(payload: AgentProfileInput): Promise<AgentRegistrationResponse>;
};
