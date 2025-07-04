/* eslint-disable @typescript-eslint/no-explicit-any */
import { envConfig } from "@/config";

type CustomOptionsType = RequestInit & {
    baseUrl?: string;
};
type ResponseType<T> = {
    payload: T;
    status: number;
};

export class httpError extends Error {
    private _status: number;
    private _payload: any;
    constructor(payload: any, status: number) {
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
            throw new Error("SessionToken can only be set in a browser environment.");
        }
        this._token = value;
    }
}

export const sessionToken = SessionToken.getInstance();

export const request = async <Response>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: CustomOptionsType
): Promise<ResponseType<Response>> => {
    let baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

    if (url.startsWith("/")) {
        url = url.slice(1);
    }
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
            const errorPayload = await response.json();
            throw new httpError(errorPayload, response.status);
        }

        const payload: Response = await response.json();
        return { payload, status: response.status };
    } catch (error) {
        if (error instanceof httpError) {
            throw error;
        }
        throw new httpError({ message: "An unexpected error occurred." }, 500);
    }
};

export const http = {
    get: <Response>(url: string, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> => {
        return request("GET", url, options);
    },

    post: <Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> => {
        return request("POST", url, { ...options, body });
    },

    put: <Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> => {
        return request("PUT", url, { ...options, body });
    },

    delete: <Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> => {
        return request("DELETE", url, { ...options, body });
    },
};

export default http;
