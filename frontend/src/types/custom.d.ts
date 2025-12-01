import { QueryClient } from '@tanstack/react-query'

export {};

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
        queryClient?: QueryClient;
    }
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};