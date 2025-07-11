/* eslint-disable @typescript-eslint/no-explicit-any */
import { envConfig } from "@/config";
import { redirect } from "next/navigation";

const isClient = typeof window !== "undefined";

export const httpStatus = {
    ENTITY_ERROR_STATUS: 422,
    UNAUTHORIZED_STATUS: 401,
} as const;

export type CustomOptionsType = RequestInit & {
    baseUrl?: string;
};
export type ResponseType<T> = {
    payload: T;
    status: number;
};

export type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class httpError extends Error {
    protected _status: number;
    protected _payload: {
        message: string;
        [key: string]: any;
    };
    constructor({ payload, status, message = "Http Error" }: { payload: any; status: number; message?: string }) {
        super(message);
        this._payload = payload;
        this._status = status;
    }
    get status() {
        return this._status;
    }
    get payload() {
        return this._payload;
    }
}
export class EntityError extends httpError {
    constructor({ payload }: { payload: EntityErrorPayload; status: typeof httpStatus.ENTITY_ERROR_STATUS }) {
        super({ payload, status: httpStatus.ENTITY_ERROR_STATUS });
    }

    override get status(): 422 {
        return httpStatus.ENTITY_ERROR_STATUS;
    }

    override get payload(): EntityErrorPayload {
        return super.payload as EntityErrorPayload;
    }
}

class SessionToken {
    private _token: string | null = null;
    private _expiresAt: string | null = null;
    private static instance: SessionToken | null = null;

    private constructor() {
        if (isClient) {
            this._token = localStorage.getItem("sessionToken");
            this._expiresAt = localStorage.getItem("sessionTokenExpiresAt");
        }
    }

    static getInstance(): SessionToken {
        if (!this.instance) {
            this.instance = new SessionToken();
        }
        return this.instance;
    }

    get value() {
        return this._token;
    }

    set value(value: string | null) {
        if (!isClient) {
            throw new Error("Cannot set session token on the server side.");
        }
        if (value === null) {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionTokenExpiresAt");
        } else {
            localStorage.setItem("sessionToken", value);
        }
        this._token = value;
    }
    get expiresAt() {
        return this._expiresAt;
    }
    set expiresAt(value: string | null) {
        if (!isClient) {
            throw new Error("Cannot set session token expiration on the server side.");
        }
        if (value === null) {
            localStorage.removeItem("sessionTokenExpiresAt");
            localStorage.removeItem("sessionToken");
        } else {
            localStorage.setItem("sessionTokenExpiresAt", value);
        }
        this._expiresAt = value;
    }
}

export const clientSessionToken = SessionToken.getInstance();

type RequestPropsType = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    options?: CustomOptionsType;
};

class Http {
    private static instance: Http | null = null;
    private static callStack: { [key: string]: Promise<any> } = {};

    private requestInterceptors: Array<(options: CustomOptionsType) => Promise<CustomOptionsType> | CustomOptionsType> =
        [];
    private responseInterceptors: Array<
        (response: ResponseType<any>, url: string) => Promise<ResponseType<any>> | ResponseType<any>
    > = [];

    private constructor() {}

    static getInstance(): Http {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    }

    useRequest(interceptor: (options: CustomOptionsType) => Promise<CustomOptionsType> | CustomOptionsType) {
        this.requestInterceptors.push(interceptor);
    }

    useResponse(
        interceptor: (response: ResponseType<any>, url: string) => Promise<ResponseType<any>> | ResponseType<any>
    ) {
        this.responseInterceptors.push(interceptor);
    }

    private async applyRequestInterceptors(options: CustomOptionsType): Promise<CustomOptionsType> {
        let result = options;
        for (const interceptor of this.requestInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }

    private async applyResponseInterceptors<Response>(
        response: ResponseType<Response>,
        url: string
    ): Promise<ResponseType<Response>> {
        let result = response;
        for (const interceptor of this.responseInterceptors) {
            result = await interceptor(result, url);
        }
        return result;
    }

    static async errorHandler(error: httpError, options: CustomOptionsType) {
        if (error.status === httpStatus.UNAUTHORIZED_STATUS) {
            console.log(error);
            if (isClient) {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ force: true }),
                });
                clientSessionToken.value = null;
                window.location.href = "/auth/login";
            } else {
                const token = (options as any)?.headers?.Authorization?.replace("Bearer ", "") || "";
                redirect("/auth/logout?sessionToken=" + token);
            }
        }
        throw error;
    }

    private async rawRequest<Response>(props: RequestPropsType): Promise<ResponseType<Response>> {
        const { method, url, options } = props;
        const key = `${method}:${url}`;

        if (Http.callStack[key] !== undefined) {
            return Http.callStack[key];
        }

        const basePromise = this._rawRequest<Response>({ method, url, options });
        Http.callStack[key] = basePromise;

        try {
            return await basePromise;
        } catch (error) {
            if (error instanceof httpError) {
                throw await Http.errorHandler(error, options || {});
            } else {
                console.error("Unexpected error in rawRequest:", error);
                throw new httpError({
                    payload: { message: "An unexpected error occurred." },
                    status: 500,
                });
            }
        } finally {
            if (Http.callStack[key] === basePromise) {
                delete Http.callStack[key];
            }
        }
    }

    private async _rawRequest<Response>(props: RequestPropsType): Promise<ResponseType<Response>> {
        const { method, options } = props;
        let { url } = props;

        let baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;

        if (url.startsWith("/")) url = url.slice(1);
        if (!baseUrl.endsWith("/")) baseUrl += "/";

        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

        let finalOptions = options || {};
        finalOptions = await this.applyRequestInterceptors(finalOptions);

        const body = finalOptions.body instanceof FormData ? finalOptions.body : JSON.stringify(finalOptions.body);

        const baseHeaders: Record<string, string> =
            finalOptions.body instanceof FormData
                ? {}
                : {
                      "Content-Type": "application/json",
                  };
        const mergedHeaders: HeadersInit = {
            ...baseHeaders,
            ...(finalOptions.headers as Record<string, string> | undefined),
        };
        const response = await fetch(fullUrl, {
            method,
            headers: mergedHeaders,
            body,
        });

        if (!response.ok) {
            const errorPayload = await response.json();
            if (response.status === httpStatus.ENTITY_ERROR_STATUS) {
                throw new EntityError({
                    payload: errorPayload,
                    status: httpStatus.ENTITY_ERROR_STATUS,
                });
            } else {
                throw new httpError({
                    payload: errorPayload,
                    status: response.status,
                    message: errorPayload.message || "Request failed",
                });
            }
        }

        const payload: Response = await response.json();
        const wrappedResponse: ResponseType<Response> = { payload, status: response.status };

        return this.applyResponseInterceptors(wrappedResponse, url);
    }

    get<Response>(url: string, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "GET", url, options });
    }

    post<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "POST", url, options: { ...options, body } });
    }

    put<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "PUT", url, options: { ...options, body } });
    }

    delete<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "DELETE", url, options: { ...options, body } });
    }
}

const http = Http.getInstance();

http.useRequest((options) => {
    if (clientSessionToken.value) {
        return {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${clientSessionToken.value}`,
            },
        };
    }
    return options;
});

http.useResponse((response, url) => {
    if (!isClient) return response;

    const isAuth = ["auth/login", "auth/register"].some((endpoint) => url.includes(endpoint));
    if (isAuth && response.status === 200) {
        const { token, expiresAt } = (response as any).payload.data;
        clientSessionToken.value = token || null;
        clientSessionToken.expiresAt = expiresAt || null;
    }
    if (url.includes("auth/logout") && response.status === 200) {
        clientSessionToken.value = null;
        clientSessionToken.expiresAt = null;
    }
    return response;
});

export default http;
