const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
export function resolveBaseUrl(override) {
    if (override && override.trim()) {
        return override.replace(/\/$/, '');
    }
    if (typeof process !== 'undefined') {
        const envUrl = process.env.CREWHIVE_BASE_URL ||
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.NEXT_PUBLIC_BASE_URL ||
            process.env.APP_URL;
        if (envUrl) {
            return envUrl.replace(/\/$/, '');
        }
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin.replace(/\/$/, '');
    }
    return 'http://localhost:3000';
}
export function ensureAbsoluteUrl(pathOrUrl, baseUrl) {
    if (ABSOLUTE_URL_REGEX.test(pathOrUrl)) {
        return pathOrUrl;
    }
    const resolvedBase = resolveBaseUrl(baseUrl);
    return `${resolvedBase}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}
export function resolveFetch(fetchFn) {
    if (fetchFn) {
        return fetchFn;
    }
    if (typeof fetch !== 'undefined') {
        return fetch;
    }
    throw new Error('Global fetch is not available. Provide fetchFn in SDK config.');
}
