var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ensureAbsoluteUrl, resolveFetch } from './config';
export function createHttpClient(config = {}) {
    const fetchImpl = resolveFetch(config.fetchFn);
    return async function request(_a) {
        var { path, parseJson = true, headers } = _a, rest = __rest(_a, ["path", "parseJson", "headers"]);
        const target = ensureAbsoluteUrl(path, config.baseUrl);
        const mergedHeaders = Object.assign(Object.assign({ 'Content-Type': 'application/json' }, (config.defaultHeaders || {})), headers);
        const response = await fetchImpl(target, Object.assign(Object.assign({}, rest), { headers: mergedHeaders }));
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
