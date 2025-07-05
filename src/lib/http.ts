/* eslint-disable @typescript-eslint/no-explicit-any */
import { envConfig } from "@/config";

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
    constructor({ payload, status }: { payload: any; status: number }) {
        super("HttpError");
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

export const ENTITY_ERROR_STATUS = 422 as const;

export class EntityError extends httpError {
    constructor({ payload }: { payload: EntityErrorPayload; status: typeof ENTITY_ERROR_STATUS }) {
        super({ payload, status: ENTITY_ERROR_STATUS });
    }

    override get status(): 422 {
        return ENTITY_ERROR_STATUS;
    }

    override get payload(): EntityErrorPayload {
        return super.payload as EntityErrorPayload;
    }
}

class SessionToken {
    private _token: string | null;
    private static instance: SessionToken | null = null;

    private constructor(token: string | null = null) {
        this._token = token;
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
        if (typeof window == "undefined") {
            throw new Error("Cannot set session token on the server side.");
        }
        this._token = value;
    }
}

export const clientSessionToken = SessionToken.getInstance();

class Http {
    private static instance: Http | null = null;

    private constructor() {}

    static getInstance(): Http {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    }

    static requestInterceptor(options: CustomOptionsType): CustomOptionsType {
        if (clientSessionToken.value) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${clientSessionToken.value}`,
            };
        }
        return options;
    }

    static responseInterceptor<Response>(response: ResponseType<Response>, url: string): ResponseType<Response> {
        const isAuthenticatedEndpoint = ["/auth/login", "/auth/register"].some((fullUrl) => fullUrl.includes(url));
        if (isAuthenticatedEndpoint && response.status === 200) {
            clientSessionToken.value = (response as any).payload.data?.token || null;
        }

        if ("/auth/logout".includes(url) && response.status === 200) {
            clientSessionToken.value = null;
        }
        return response;
    }

    static errorHandler(error: httpError): void {
        if (error.status === 401) {
            clientSessionToken.value = null;
        } else throw error;
    }

    private async rawRequest<Response>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,
        options?: CustomOptionsType
    ): Promise<ResponseType<Response>> {
        let baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;

        if (url.startsWith("/")) {
            url = url.slice(1);
        }
        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }

        const finalOptions = Http.requestInterceptor(options || {});

        try {
            const response = await fetch(`${baseUrl}${url}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...finalOptions.headers,
                },
                body: finalOptions.body ? JSON.stringify(finalOptions.body) : undefined,
            });

            if (!response.ok) {
                const errorPayload = await response.json();
                if (response.status === ENTITY_ERROR_STATUS) {
                    throw new EntityError({ payload: errorPayload, status: ENTITY_ERROR_STATUS });
                } else {
                    throw new httpError({ payload: errorPayload, status: response.status });
                }
            }

            const payload: Response = await response.json();
            const wrappedResponse: ResponseType<Response> = { payload, status: response.status };

            return Http.responseInterceptor(wrappedResponse, url);
        } catch (error) {
            if (error instanceof httpError) {
                Http.errorHandler(error);
            }
            throw new httpError({ payload: { message: "An unexpected error occurred." }, status: 500 });
        }
    }

    get<Response>(url: string, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>("GET", url, options);
    }

    post<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>("POST", url, { ...options, body });
    }

    put<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>("PUT", url, { ...options, body });
    }

    delete<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>("DELETE", url, { ...options, body });
    }
}

const http = Http.getInstance();
export default http;
