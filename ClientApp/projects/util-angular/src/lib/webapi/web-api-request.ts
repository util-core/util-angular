//============== WebApi请求操作 =========================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//=======================================================
import { HttpErrorResponse } from '@angular/common/http';
import { Result } from '../core/result';
import { FailResult } from "../core/fail-result";
import { StateCode } from "../core/state-code";
import { HttpContentType } from "../http/http-content-type";
import { HttpRequest } from "../http/http-request";
import { WebApiHandleOptions } from "./web-api-handle-options";
import { Util } from "../util";
import { NzSpinComponent } from 'ng-zorro-antd/spin';

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
    constructor(private request: HttpRequest<Result<T>>, private util: Util) {
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
    responseType( responseType ): WebApiRequest<T>  {
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
    loading(isShowLoading?: boolean): WebApiRequest<T> {
        this.isShowLoading = isShowLoading === undefined ? true : isShowLoading;
        return this;
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
            (error: HttpErrorResponse) => this.handleFail(options, undefined, error),
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
            (error: HttpErrorResponse) => this.handleFail(options, undefined, error),
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
            options.ok && options.ok(result.data);
            return;
        }
        this.handleFail(options, result);
    }

    /**
     * 处理失败响应
     */
    private handleFail(options: WebApiHandleOptions<T>, result?: Result<T>, errorResponse?: HttpErrorResponse) {
        let failResult = new FailResult(result, errorResponse);
        this.handleHttpException(options, failResult);
        if (options.fail) {
            options.fail(failResult);
            return;
        }
        if (result) {
            this.handleBusinessException(result);
            return;
        }
    }

    /**
     * 处理Http异常
     */
    private handleHttpException(options: WebApiHandleOptions<T>, failResult: FailResult) {
        if (failResult.errorResponse)
            console.log(this.getHttpExceptionMessage(failResult));
        if (options.complete)
            options.complete();
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
        return `Http请求异常：\nUrl:${error.url}\n状态码:${error.status},${error.statusText}\n`
            + `错误消息:${error.message}\n错误响应:\n ${error.error && error.error.text}\n`;
    }

    /**
     * 处理业务异常
     */
    private handleBusinessException(result: Result<T>) {
        if (result.code === StateCode.Fail) {
            this.util.message.error(result.message);
            console.log(`业务异常:\n${result.message}`);
        }
    }

    /**
     * 发送前操作
     */
    private handleBefore(options: WebApiHandleOptions<T>): boolean {
        let result = options && options.before && options.before();
        if (result === false)
            return false;
        this.showLoading();
        return true;
    }

    /**
     * 显示加载状态
     */
    private showLoading() {
        if ( this.btn )
            this.btn.nzLoading = true;
        if (this.isShowLoading) {
            this.util.dialog.open({
                component: NzSpinComponent,
                centered: true,
                showClose: false,
                showOk: false,
                showCancel: false,
                showFooter: false,
                disableClose: true
            });
        }
    }

    /**
     * 完成操作
     */
    private handleComplete(options: WebApiHandleOptions<T>) {
        options && options.complete && options.complete();
        this.closeLoading();
    }

    /**
     * 关闭加载状态
     */
    private closeLoading() {
        if (this.btn) {
            this.btn.nzLoading = false;
            this.btn.cdr.detectChanges();
        }
        if (this.isShowLoading)
            this.util.dialog.close();
    }
}