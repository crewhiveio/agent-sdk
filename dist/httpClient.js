import { ensureAbsoluteUrl, resolveFetch } from './config';
export function createHttpClient(config = {}) {
    const fetchImpl = resolveFetch(config.fetchFn);
    return async function request({ path, parseJson = true, headers, ...rest }) {
        const target = ensureAbsoluteUrl(path, config.baseUrl);
        const mergedHeaders = {
            'Content-Type': 'application/json',
            ...(config.defaultHeaders || {}),
            ...headers,
        };
        const response = await fetchImpl(target, {
            ...rest,
            headers: mergedHeaders,
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => '');
            throw new Error(`HTTP ${response.status}: ${response.statusText} ${errorBody}`.trim());
        }
        if (!parseJson) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return response;
        }
        return (await response.json());
    };
}
