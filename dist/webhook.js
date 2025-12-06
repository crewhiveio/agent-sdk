import { createHmac, timingSafeEqual } from 'crypto';
const DEFAULT_SIGNATURE_HEADER = 'x-crew-signature';
const DEFAULT_TIMESTAMP_HEADER = 'x-crew-request-timestamp';
const AGENT_HEADER = 'x-crew-agent-id';
const SESSION_HEADER = 'x-crew-session-id';
function normalizeHeaders(headers) {
    if (headers instanceof Headers) {
        const normalized = {};
        headers.forEach((value, key) => {
            normalized[key.toLowerCase()] = value;
        });
        return normalized;
    }
    return Object.entries(headers).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[key.toLowerCase()] = value;
        }
        else if (Array.isArray(value)) {
            const first = value.find((entry) => typeof entry === 'string');
            if (first) {
                acc[key.toLowerCase()] = first;
            }
        }
        return acc;
    }, {});
}
function safeCompare(expected, actual) {
    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(actual, 'hex');
    if (expectedBuffer.length !== actualBuffer.length) {
        return false;
    }
    return timingSafeEqual(expectedBuffer, actualBuffer);
}
export function verifyCrewRequest({ headers, body, secret, signatureHeader = DEFAULT_SIGNATURE_HEADER, timestampHeader = DEFAULT_TIMESTAMP_HEADER, parseBody = true, }) {
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
    let payload;
    if (parseBody && rawBody) {
        try {
            payload = JSON.parse(rawBody);
        }
        catch (error) {
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
export function parseCrewRequest(verification) {
    if (!verification.valid || !verification.metadata || !verification.payload) {
        throw new Error('Cannot parse invalid Crewhive request.');
    }
    return {
        metadata: verification.metadata,
        payload: verification.payload,
    };
}
