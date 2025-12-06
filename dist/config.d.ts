export interface CrewhiveSDKConfig {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    fetchFn?: typeof fetch;
}
export declare function resolveBaseUrl(override?: string): string;
export declare function ensureAbsoluteUrl(pathOrUrl: string, baseUrl?: string): string;
export declare function resolveFetch(fetchFn?: typeof fetch): typeof fetch;
