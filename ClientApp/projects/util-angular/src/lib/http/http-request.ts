//============== Http请求操作=====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, retry, lastValueFrom } from 'rxjs';
import { HttpMethod } from "./http-method";
import { HttpContentType } from "./http-content-type";
import { Ioc } from '../common/ioc';
import { formatDate } from '../common/helper';

/**
 * Http请求操作
 */
export class HttpRequest<T> {
    /**
     * Http头集合
     */
    private headers: HttpHeaders;
    /**
     * 内容类型
     */
    private httpContentType: HttpContentType;
    /**
     * 请求客户端
     */
    private _client: Observable<T>;
    /**
     * Http参数集合
     */
    private parameters: HttpParams;
    /**
     * 响应类型
     */
    private httpResponseType;
    /**
     * 跨域是否允许携带cookie
     */
    private credentials: boolean;
    /**
    * 请求重试次数
    */
    private retryTimes: number;

    /**
     * 初始化Http请求操作
     * @param ioc Ioc操作
     * @param httpMethod Http方法
     * @param url 请求地址
     * @param body Http主体
     */
    constructor(private ioc: Ioc, private httpMethod: HttpMethod, private url: string, private body?) {
        this.headers = new HttpHeaders();
        this.parameters = new HttpParams();
        this.credentials = true;
        this.retryTimes = 3;
    }

    /**
     * 设置请求重试次数
     * @param value 请求重试次数,默认值: 3
     */
    retry(value: number): HttpRequest<T> {
        this.retryTimes = value;
        return this;
    }

    /**
     * 设置跨域是否允许携带cookie
     * @param value 设置为true则允许携带,默认值: true
     */
    withCredentials(value: boolean): HttpRequest<T> {
        this.credentials = value;
        return this;
    }

    /**
     * 添加Http头
     * @param name 名称
     * @param value 值
     */
    header(name: string, value): HttpRequest<T> {
        let stringValue = "";
        if (value !== undefined && value !== null)
            stringValue = String(value);
        this.headers = this.headers.append(name, stringValue);
        return this;
    }

    /**
     * 设置内容类型
     * @param contentType 内容类型
     */
    contentType(contentType: HttpContentType): HttpRequest<T> {
        this.httpContentType = contentType;
        return this;
    }

    /**
     * 设置响应类型
     * @param responseType 响应类型
     */
    responseType(responseType): HttpRequest<T> {
        this.httpResponseType = responseType;
        return this;
    }

    /**
    * 添加Http参数,添加到url查询字符串
    * @param data 参数对象
    */
    param(data): HttpRequest<T>;
    /**
     * 添加Http参数,添加到url查询字符串
     * @param name 名称
     * @param value 值
     */
    param(name: string, value: string): HttpRequest<T>;
    param(data, value?: string): HttpRequest<T> {
        if (typeof data === "object") {
            this.paramByObject(data);
            return this;
        }
        if (typeof data === "string" && value)
            this.parameters = this.parameters.append(data, value);
        return this;
    }

    /**
     * 添加Http参数
     */
    private paramByObject(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let value = this.getValue(data[key]);
                if (value == null)
                    value = "";
                this.parameters = this.parameters.append(key, value);
            }
        }
    }

    /**
     * 获取值
     */
    private getValue(item): string {
        if (!item)
            return item;
        if (item instanceof Date)
            return formatDate(item);
        return item;
    }

    /**
     * 处理响应
     * @param handler 响应处理函数
     * @param errorHandler 错误处理函数
     * @param beforeHandler 发送前处理函数，返回false则取消发送
     * @param completeHandler 请求完成处理函数
     */
    handle(handler: (value: T) => void, errorHandler?: (error: HttpErrorResponse) => void, beforeHandler?: () => boolean, completeHandler?: () => void) {
        if (beforeHandler && beforeHandler() === false)
            return;
        this.getClient()
            .subscribe({
                next: handler,
                error: errorHandler,
                complete: completeHandler
            });
    }

    /**
     * 处理响应
     * @param handler 响应处理函数
     * @param errorHandler 错误处理函数
     * @param beforeHandler 发送前处理函数，返回false则取消发送
     * @param completeHandler 请求完成处理函数
     */
    async handleAsync(handler: (value: T) => void, errorHandler?: (error: HttpErrorResponse) => void, beforeHandler?: () => boolean, completeHandler?: () => void) {
        if (beforeHandler && beforeHandler() === false)
            return;
        await lastValueFrom(this.getClient()).then(handler).catch(errorHandler).then(completeHandler);
    }

    /**
     * 发送请求
     */
    request(): Observable<T> {
        this.initContentType();
        let httpClient = this.ioc.get<HttpClient>(HttpClient);
        let options = { headers: this.headers, params: this.parameters, responseType: this.httpResponseType, withCredentials: this.credentials };
        switch (this.httpMethod) {
            case HttpMethod.Get:
                return httpClient.get<T>(this.url, options);
            case HttpMethod.Post:
                return httpClient.post<T>(this.url, this.getBody(), options);
            case HttpMethod.Put:
                return httpClient.put<T>(this.url, this.getBody(), options);
            case HttpMethod.Delete:
                return httpClient.delete<T>(this.url, options);
            default:
                return httpClient.get<T>(this.url, options);
        }
    }

    /**
     * 初始化内容类型
     */
    private initContentType() {
        return this.header("Content-Type", this.getContentType(this.httpContentType));
    }

    /**
     * 获取内容类型
     * @param contentType
     */
    private getContentType(contentType: HttpContentType) {
        switch (contentType) {
            case HttpContentType.FormUrlEncoded:
                return "application/x-www-form-urlencoded";
            default:
                return "application/json";
        }
    }

    /**
     * 获取body
     */
    private getBody() {
        if (typeof this.body === "string")
            return JSON.stringify(this.body);
        this.processBody();
        return this.body;
    }

    /**
     * 对body进行处理
     */
    private processBody() {
        for (let key in this.body) {
            if (!this.body.hasOwnProperty(key))
                continue;;
            let value = this.getValue(this.body[key]);
            if (value === undefined || value === null || value === '') {
                delete this.body[key];
                continue;;
            }
            this.body[key] = this.getValue(this.body[key]);
        }
    }

    /**
     * 配置请求客户端
     * @param handler 请求客户端配置操作
     */
    configClient(handler: (client: Observable<any>) => Observable<any>): HttpRequest<T> {
        this._client = handler && handler(this.request());
        return this;
    }

    /**
     * 获取请求客户端
     */
    private getClient() {
        if (this._client)
            return this._client;
        return this.request()
            .pipe(
                retry(this.retryTimes)
            );
    }

    /**
     * 下载文件
     * @param fileName 文件名,包含扩展名,范例: a.png
     */
    download(fileName) {
        this.responseType("blob");
        this.handle(result => {
            const url = window.URL.createObjectURL(<Blob>result);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }
}