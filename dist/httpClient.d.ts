import { CrewhiveSDKConfig } from './config';
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    [key: string]: JsonValue;
};
export interface HttpRequestOptions extends RequestInit {
    path: string;
    parseJson?: boolean;
}
export declare function createHttpClient(config?: CrewhiveSDKConfig): <T = any>({ path, parseJson, headers, ...rest }: HttpRequestOptions) => Promise<T>;
