import { createHmac, timingSafeEqual } from 'crypto';
import type { CrewAgentRequest } from './types';

const DEFAULT_SIGNATURE_HEADER = 'x-crew-signature';
const DEFAULT_TIMESTAMP_HEADER = 'x-crew-request-timestamp';
const AGENT_HEADER = 'x-crew-agent-id';
const SESSION_HEADER = 'x-crew-session-id';

function normalizeHeaders(headers: Headers | Record<string, unknown>) {
  if (headers instanceof Headers) {
    const normalized: Record<string, string> = {};
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
    return normalized;
  }

  return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key.toLowerCase()] = value;
    } else if (Array.isArray(value)) {
      const first = value.find((entry) => typeof entry === 'string');
      if (first) {
        acc[key.toLowerCase()] = first;
      }
    }
    return acc;
  }, {});
}

function safeCompare(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected, 'hex');
  const actualBuffer = Buffer.from(actual, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

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

export function verifyCrewRequest<TPayload = Record<string, unknown>>({
  headers,
  body,
  secret,
  signatureHeader = DEFAULT_SIGNATURE_HEADER,
  timestampHeader = DEFAULT_TIMESTAMP_HEADER,
  parseBody = true,
}: VerifyCrewRequestOptions): VerifyCrewRequestResult<TPayload> {
  const normalizedHeaders = normalizeHeaders(headers);
  const signature = normalizedHeaders[signatureHeader.toLowerCase()];
  const timestamp = normalizedHeaders[timestampHeader.toLowerCase()];
  const agentId = normalizedHeaders[AGENT_HEADER];
  const sessionId = normalizedHeaders[SESSION_HEADER];
  const rawBody = typeof body === 'string' ? body : Buffer.from(body).toString('utf8');

  if (!signature || !timestamp) {
    return { valid: false, reason: 'Missing signature headers', rawBody };
  }

  if (!agentId || !sessionId) {
    return { valid: false, reason: 'Missing agent or session identifiers', rawBody };
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(timestamp + rawBody)
    .digest('hex');

  const normalizedProvided = signature.trim().toLowerCase();

  if (!safeCompare(expectedSignature, normalizedProvided)) {
    return { valid: false, reason: 'Invalid signature', rawBody };
  }

  let payload: TPayload | undefined;
  if (parseBody && rawBody) {
    try {
      payload = JSON.parse(rawBody) as TPayload;
    } catch (error) {
      return { valid: false, reason: 'Invalid JSON payload', rawBody };
    }
  }

  return {
    valid: true,
    metadata: {
      agentId,
      sessionId,
      requestTimestamp: timestamp,
      signatureHeader,
    },
    payload,
    rawBody,
  };
}

export function parseCrewRequest<TPayload = Record<string, unknown>>(
  verification: VerifyCrewRequestResult<TPayload>
): CrewAgentRequest<TPayload> {
  if (!verification.valid || !verification.metadata || !verification.payload) {
    throw new Error('Cannot parse invalid Crewhive request.');
  }

  return {
    metadata: verification.metadata,
    payload: verification.payload,
  };
}
