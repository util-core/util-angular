//============== WebApi操作=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { HttpMethod } from "../http/http-method";
import { Util } from "../util";
import { WebApiRequest } from "./web-api-request";
import { Result } from "../core/result";
import { AppConfig } from '../config/app-config';

/**
 * WebApi操作
 */
export class WebApi {
    /**
     * 应用配置
     */
    private config: AppConfig;

    /**
     * 初始化WebApi操作
     * @param request Http请求操作
     * @param message 消息操作
     */
    constructor(private util: Util) {
        this.config = util.getAppConfig();
    }

    /**
     * 获取完整url地址,如果配置了Api端点地址则自动包含
     * @param url 地址,范例: /api/test
     */
    private getUrl(url: string): string {
        return this.util.helper.getUrl(url, this.config && this.config.apiEndpoint);
    }

    /**
     * 发送请求
     * @param url 请求地址
     * @param httpMethod http方法
     * @param data 数据
     */
    send<T>(url: string, httpMethod: HttpMethod, data?): WebApiRequest<T> {
        switch (httpMethod) {
            case HttpMethod.Get:
                return this.get<T>(url).param(data);
            case HttpMethod.Post:
                return this.post<T>(url, data);
            case HttpMethod.Put:
                return this.put<T>(url, data);
            case HttpMethod.Delete:
                return this.delete<T>(url).param(data);
            default:
                return this.get<T>(url).param(data);
        }
    }

    /**
     * get请求
     * @param url 请求地址
     */
    get<T>(url: string): WebApiRequest<T> {
        url = this.getUrl(url);
        return new WebApiRequest<T>(this.util.http.get<Result<T>>(url), this.util);
    }

    /**
     * post请求
     * @param url 请求地址
     * @param body Http主体
     */
    post<T>(url: string, body?): WebApiRequest<T> {
        url = this.getUrl(url);
        return new WebApiRequest<T>(this.util.http.post<Result<T>>(url, body), this.util);
    }

    /**
     * put请求
     * @param url 请求地址
     * @param body Http主体
     */
    put<T>(url: string, body?): WebApiRequest<T> {
        url = this.getUrl(url);
        return new WebApiRequest<T>(this.util.http.put<Result<T>>(url, body), this.util);
    }

    /**
     * delete请求
     * @param url 请求地址
     */
    delete<T>(url: string): WebApiRequest<T> {
        url = this.getUrl(url);
        return new WebApiRequest<T>(this.util.http.delete<Result<T>>(url), this.util);
    }
}