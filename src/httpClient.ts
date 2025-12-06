import { CrewhiveSDKConfig, ensureAbsoluteUrl, resolveFetch } from './config';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface HttpRequestOptions extends RequestInit {
  path: string;
  parseJson?: boolean;
}

export function createHttpClient(config: CrewhiveSDKConfig = {}) {
  const fetchImpl = resolveFetch(config.fetchFn);

  return async function request<T = any>({ path, parseJson = true, headers, ...rest }: HttpRequestOptions): Promise<T> {
    const target = ensureAbsoluteUrl(path, config.baseUrl);
    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.defaultHeaders || {}),
      ...(headers as Record<string, string> | undefined),
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
      return response as T;
    }

    return (await response.json()) as T;
  };
}
