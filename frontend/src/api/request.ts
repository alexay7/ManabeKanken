import {HttpError} from "@/types/error";

async function request<TResponse>(url: string, config: RequestInit): Promise<TResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/${url}`, config);
    if (response.status > 399) {
        const resJson = await response.json() as { message: string };
        const errorResponse = new HttpError(resJson.message, response.status);
        throw new HttpError(errorResponse.message, response.status);
    }
    return await response.json() as TResponse;
}

export const api = {
    get: <TResponse>(url: string): Promise<TResponse> =>
        request<TResponse>(url, {method: "GET"}),

    delete: <TResponse>(url: string): Promise<TResponse> =>
        request<TResponse>(url, {method: "DELETE"}),

    post: <TBody, TResponse>(url: string, body?: TBody, keepAlive?: boolean): Promise<TResponse> =>
        request<TResponse>(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
            keepalive: keepAlive
        }),

    patch: <TBody, TResponse>(url: string, body?: TBody, keepAlive?: boolean): Promise<TResponse> =>
        request<TResponse>(url, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
            keepalive: keepAlive
        }),

    put: <TBody, TResponse>(url: string, body?: TBody, keepAlive?: boolean): Promise<TResponse> =>
        request<TResponse>(url, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
            keepalive: keepAlive
        })
};