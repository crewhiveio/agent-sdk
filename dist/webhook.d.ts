import type { CrewAgentRequest } from './types';
export interface VerifyCrewRequestOptions {
    headers: Headers | Record<string, unknown>;
    body: string | Buffer | Uint8Array;
    secret: string;
    signatureHeader?: string;
    timestampHeader?: string;
    parseBody?: boolean;
}
export interface VerifyCrewRequestResult<TPayload = Record<string, unknown>> {
    valid: boolean;
    reason?: string;
    metadata?: {
        agentId: string;
        sessionId: string;
        requestTimestamp: string;
        signatureHeader: string;
    };
    payload?: TPayload;
    rawBody: string;
}
export declare function verifyCrewRequest<TPayload = Record<string, unknown>>({ headers, body, secret, signatureHeader, timestampHeader, parseBody, }: VerifyCrewRequestOptions): VerifyCrewRequestResult<TPayload>;
export declare function parseCrewRequest<TPayload = Record<string, unknown>>(verification: VerifyCrewRequestResult<TPayload>): CrewAgentRequest<TPayload>;
