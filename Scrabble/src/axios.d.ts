﻿declare namespace Axios {
    export interface AxiosTransformer {
        (data: any, headers?: any): any;
    }

    export interface AxiosAdapter {
        (config: AxiosRequestConfig): AxiosPromise<any>;
    }

    export interface AxiosBasicCredentials {
        username: string;
        password: string;
    }

    export interface AxiosProxyConfig {
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        }
    }

    export interface AxiosRequestConfig {
        url?: string;
        method?: string;
        baseURL?: string;
        transformRequest?: AxiosTransformer | AxiosTransformer[];
        transformResponse?: AxiosTransformer | AxiosTransformer[];
        headers?: any;
        params?: any;
        paramsSerializer?: (params: any) => string;
        data?: any;
        timeout?: number;
        withCredentials?: boolean;
        adapter?: AxiosAdapter;
        auth?: AxiosBasicCredentials;
        responseType?: string;
        xsrfCookieName?: string;
        xsrfHeaderName?: string;
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        maxContentLength?: number;
        validateStatus?: (status: number) => boolean;
        maxRedirects?: number;
        httpAgent?: any;
        httpsAgent?: any;
        proxy?: AxiosProxyConfig;
        cancelToken?: CancelToken;
    }

    export interface AxiosResponse<T> {
        data: T;
        status: number;
        statusText: string;
        headers: any;
        config: AxiosRequestConfig;
        request?: any;
    }

    export interface AxiosError extends Error {
        config: AxiosRequestConfig;
        code?: string;
        request?: any;
        response?: AxiosResponse<any>;
    }

    export interface AxiosPromise<T> extends Promise<AxiosResponse<T>> {
    }

    export interface CancelStatic {
        new (message?: string): Cancel;
    }

    export interface Cancel {
        message: string;
    }

    export interface Canceler {
        (message?: string): void;
    }

    export interface CancelTokenStatic {
        new (executor: (cancel: Canceler) => void): CancelToken;
        source(): CancelTokenSource;
    }

    export interface CancelToken {
        promise: Promise<Cancel>;
        reason?: Cancel;
        throwIfRequested(): void;
    }

    export interface CancelTokenSource {
        token: CancelToken;
        cancel: Canceler;
    }

    export interface AxiosInterceptorManager<V> {
        use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any): number;
        eject(id: number): void;
    }

    export interface AxiosInstance {
        (config: AxiosRequestConfig): AxiosPromise<any>;
        (url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
        defaults: AxiosRequestConfig;
        interceptors: {
            request: AxiosInterceptorManager<AxiosRequestConfig>;
            response: AxiosInterceptorManager<AxiosResponse<any>>;
        };
        request<T>(config: AxiosRequestConfig): AxiosPromise<T>;
        get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
        delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
        head<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
        post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
        put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
        patch<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
    }

    export interface AxiosStatic extends AxiosInstance {
        create(config?: AxiosRequestConfig): AxiosInstance;
        Cancel: CancelStatic;
        CancelToken: CancelTokenStatic;
        isCancel(value: any): boolean;
        all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
        spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
    }

}
declare const Axios: Axios.AxiosStatic;

declare module "axios" {
    export = Axios;
}
