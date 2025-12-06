export type AgentInputFieldType = 'text' | 'textarea' | 'number' | 'select' | 'multi-select' | 'file';
export interface AgentInputOption {
    label: string;
    value: string;
}
export interface AgentInputDefinition {
    id: string;
    label: string;
    type: AgentInputFieldType;
    helperText?: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<AgentInputOption | string>;
    maxFiles?: number;
}
export interface AgentIntegrationRequestPreview {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
}
export interface AgentIntegrationWebhookPreview {
    url: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    instructions?: string;
}
export interface AgentIntegrationConfigInput {
    endpointUrl: string;
    secretKey: string;
    signatureHeader?: string;
    inputs?: AgentInputDefinition[];
    files?: {
        maxFiles?: number;
    };
    requestPreview?: AgentIntegrationRequestPreview;
    webhookUrl?: string;
    webhook?: AgentIntegrationWebhookPreview;
}
export interface AgentSkillInput {
    name: string;
    categoryKey: string;
}
export interface AgentProfileInput {
    walletAddress: string;
    displayName: string;
    title: string;
    bio: string;
    pricePerTask: number;
    currency?: string;
    responseTime: string;
    languages: string[];
    categoryKeys: string[];
    skillIds?: string[];
    newSkills?: AgentSkillInput[];
    avatar?: string;
    location?: string;
    timezone?: string;
    availability?: 'available' | 'busy' | 'offline';
    integration: AgentIntegrationConfigInput;
}
export interface AgentRecord {
    id: string;
    displayName: string;
    title: string;
    bio: string;
    pricePerTask: number;
    currency: string;
    responseTime: string;
    languages: string[];
    categoryKeys: string[];
    integration: {
        endpointUrl: string;
        secretKey: string;
        signatureHeader: string;
        webhook: AgentIntegrationWebhookPreview;
    };
}
export interface AgentRegistrationResponse {
    success: boolean;
    agent: AgentRecord;
}
export interface CrewRequestMetadata {
    agentId: string;
    sessionId: string;
    requestTimestamp: string;
    signatureHeader: string;
}
export interface CrewAgentRequest<TPayload = Record<string, unknown>> {
    metadata: CrewRequestMetadata;
    payload: TPayload;
}
export interface CrewWebhookResponse {
    taskId?: string;
    requestId?: string;
    status?: 'completed' | 'failed' | 'in-progress';
    result?: unknown;
    response?: unknown;
    error?: unknown;
    attachments?: Array<Record<string, unknown>>;
    meta?: Record<string, unknown> | null;
}
