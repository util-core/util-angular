﻿//============== WebApi请求操作 =========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=======================================================
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I18nKeys } from "../config/i18n-keys";
import { Result } from '../core/result';
import { FailResult } from "../core/fail-result";
import { StateCode } from "../core/state-code";
import { HttpContentType } from "../http/http-content-type";
import { HttpRequest } from "../http/http-request";
import { WebApiHandleOptions } from "./web-api-handle-options";
import { Util } from "../util";

/**
 * WebApi请求操作
 */
export class WebApiRequest<T> {
    /**
     * 按钮
     */
    private btn;
    /**
     * 是否显示进度条
     */
    private isShowLoading?: boolean;

    /**
     * 初始化WebApi请求操作
     * @param request Http请求操作
     * @param message 消息操作
     */
    constructor(private request?: HttpRequest<Result<T>>, private util?: Util) {
    }

    /**
     * 设置请求重试次数
     * @param value 请求重试次数,默认值: 3
     */
    retry(value: number): WebApiRequest<T> {
        this.request.retry(value);
        return this;
    }

    /**
     * 设置超时时间
     * @param value 超时时间, 单位:毫秒, 默认值: 120秒
     */
    timeout(value: number): WebApiRequest<T> {
        this.request.timeout(value);
        return this;
    }

    /**
     * 设置跨域是否允许携带cookie
     * @param value 设置为true则允许携带,默认值: true
     */
    withCredentials(value: boolean = true): WebApiRequest<T> {
        this.request.withCredentials(value);
        return this;
    }

    /**
     * 添加Http头
     * @param headers Http头集合
     */
    header(headers?: { name: string, value }[]): WebApiRequest<T>;
    /**
     * 添加Http头
     * @param name 名称
     * @param value 值
     */
    header(name: string, value): WebApiRequest<T>;
    header(name, value?): WebApiRequest<T> {
        if (typeof name === "object")
            this.addHeaders(name);
        else if (typeof name === "string")
            this.request.header(name, value);
        return this;
    }

    /**
     * 设置Content-Language请求头
     * @param culture 语言文化代码
     */
    contentLanguage(culture) {
        this.header("Content-Language", culture);
    }

    /**
     * 添加Http头
     */
    private addHeaders(param) {
        let headers = param as { name: string, value }[];
        if (!headers)
            return;
        headers.forEach(item => {
            this.request.header(item.name, item.value);
        });
    }

    /**
     * 设置响应类型
     * @param responseType 响应类型
     */
    responseType(responseType): WebApiRequest<T> {
        this.request.responseType(responseType);
        return this;
    }

    /**
     * 设置内容类型
     * @param contentType 内容类型
     */
    contentType(contentType: HttpContentType): WebApiRequest<T> {
        this.request.contentType(contentType);
        return this;
    }

    /**
     * 添加Http参数,添加到url查询字符串
     * @param data 参数对象
     */
    param(data): WebApiRequest<T>;
    /**
     * 添加Http参数,添加到url查询字符串
     * @param name 名称
     * @param value 值
     */
    param(name: string, value: string): WebApiRequest<T>;
    param(data, value?: string): WebApiRequest<T> {
        if (typeof data === "object") {
            this.request.param(data);
            return this;
        }
        if (typeof data === "string" && value)
            this.request.param(data, value);
        return this;
    }

    /**
     * 根据条件添加http参数
     * @param name 名称
     * @param value 值
     */
    paramIf(data, value: string, condition: boolean): WebApiRequest<T> {
        if (condition)
            this.param(data, value);
        return this;
    }

    /**
     * 设置按钮
     * @param btn 按钮实例
     */
    button(btn): WebApiRequest<T> {
        this.btn = btn;
        return this;
    }

    /**
     * 请求时显示进度条
     */
    loading(isShowLoading: boolean = true): WebApiRequest<T> {
        this.isShowLoading = isShowLoading;
        return this;
    }

    /**
     * 配置请求客户端
     * @param handler 请求客户端配置操作
     */
    configClient(handler: (client: Observable<T>) => Observable<T>): WebApiRequest<T> {
        this.request.configClient(handler);
        return this;
    }

    /**
     * 获取请求客户端
     */
    getClient(): Observable<Result<T>> {
        return this.request.request();
    }

    /**
     * 发送客户端请求
     * @param client Http客户端
     * @param options 响应处理器配置
     */
    sendClient(client: Observable<any>, options: WebApiHandleOptions<T>) {
        if (!client)
            return;
        if (!options)
            return;
        if (options.before && options.before() === false)
            return;
        client.subscribe({
            next: (result: Result<T>) => this.handleOk(options, result),
            error: (error: HttpErrorResponse) => this.handleFail(options, error),
            complete: () => this.handleComplete(options)
        });
    }

    /**
     * 处理响应
     * @param options 响应处理器配置
     */
    handle(options: WebApiHandleOptions<T>) {
        if (!options)
            return;
        this.request.handle(
            (result: Result<T>) => this.handleOk(options, result),
            (error: HttpErrorResponse) => this.handleFail(options, error),
            () => this.handleBefore(options),
            () => this.handleComplete(options)
        );
    }

    /**
     * 处理响应
     * @param options 响应处理器配置
     */
    async handleAsync(options: WebApiHandleOptions<T>) {
        if (!options)
            return;
        await this.request.handleAsync(
            (result: Result<T>) => this.handleOk(options, result),
            (error: HttpErrorResponse) => this.handleFail(options, error),
            () => this.handleBefore(options),
            () => this.handleComplete(options)
        );
    }

    /**
     * 处理成功响应
     */
    private handleOk(options: WebApiHandleOptions<T>, result: Result<T>) {
        if (!result)
            return;
        if (result.code === StateCode.Ok) {
            options.ok && options.ok(result.data, result.message);
            return;
        }
        if (result.code === StateCode.Unauthorized) {
            this.handleUnauthorize(options);
            return;
        }
        if (result.code === StateCode.Fail)
            this.handleBusinessException(options,result);
    }

    /**
     * 处理未授权响应
     */
    private handleUnauthorize(options?: WebApiHandleOptions<T>) {
        if (options && options.unauthorize) {
            options.unauthorize();
            return;
        }
        this.util.message.error(I18nKeys.unauthorizedMessage);
    }

    /**
     * 处理业务异常
     */
    private handleBusinessException(options?: WebApiHandleOptions<T>,result?: Result<T>) {
        if (options && options.fail) {
            options.fail(new FailResult(result));
            return;
        }
        if (result)
            this.util.message.error(result.message);
    }

    /**
     * 处理失败响应
     */
    private handleFail(options: WebApiHandleOptions<T>, errorResponse?: HttpErrorResponse) {
        let failResult = new FailResult(null, errorResponse);
        this.handleHttpException(options, failResult);
        this.handleComplete(options);
    }

    /**
     * 处理Http异常
     */
    private handleHttpException(options: WebApiHandleOptions<T>, failResult: FailResult) {
        if (failResult.errorResponse)
            console.log(this.getHttpExceptionMessage(failResult));
        if (options.fail) {
            options.fail(failResult);
            return;
        }
        if (failResult.errorResponse.name.toString() === 'TimeoutError') {
            if (options.timeout) {
                options.timeout(failResult);
                return;
            }
            this.util.message.error(I18nKeys.timeoutMessage);
            return;
        }        
    }

    /**
     * 获取Http异常消息
     */
    private getHttpExceptionMessage(failResult: FailResult) {
        if (!failResult.errorResponse)
            return "";
        let error = failResult.errorResponse;
        if (!error)
            return "";
        return `Http Exception：\nUrl:${error.url}\nstatus:${error.status},${error.statusText}\n`
            + `error message:${error.message}\nerrortext:\n ${error.error && error.error.text}\n`;
    }

    /**
     * 发送前操作
     */
    private handleBefore(options: WebApiHandleOptions<T>): boolean {
        let result = options.before && options.before();
        if (result === false)
            return false;
        this.showLoading();
        return true;
    }

    /**
     * 显示加载状态
     */
    private showLoading() {
        if (this.btn)
            this.btn.nzLoading = true;
        if (this.isShowLoading)
            this.util.loading.open();
    }

    /**
     * 完成操作
     */
    private handleComplete(options: WebApiHandleOptions<T>) {
        options.complete && options.complete();
        this.closeLoading();
    }

    /**
     * 关闭加载状态
     */
    private closeLoading() {
        if (this.btn) {
            this.btn.nzLoading = false;
            this.btn.cdr?.detectChanges();
        }
        if (this.isShowLoading)
            this.util.loading.close();
    }

    /**
     * 下载文件
     * @param fileName 文件名,包含扩展名,范例: a.png
     */
    download(fileName?) {
        this.request.download(fileName, async (blob: Blob) => {
            try {
                if (blob.type === "application/octet-stream")
                    return window.URL.createObjectURL(blob);
                let value = await this.util.helper.blobToStringAsync(blob);
                if (blob.type === "text/plain")
                    return value;
                if (blob.type === "application/json") {
                    let result = this.util.helper.toObjectFromJson<Result<any>>(value);
                    if (result.code === StateCode.Ok)
                        return result.data;
                    if (result.code === StateCode.Unauthorized) {
                        this.handleUnauthorize();
                        return null;
                    }
                    if (result.code === StateCode.Fail) {
                        this.handleBusinessException(null,result);
                        return null;
                    }
                }
                return window.URL.createObjectURL(blob);
            }
            catch {
                return blob;
            }
        });
    }
}