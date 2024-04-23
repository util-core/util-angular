﻿//============== WebApi响应处理配置=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { FailResult } from "../core/fail-result";

/**
 * WebApi响应处理配置
 */
export class WebApiHandleOptions<T> {
    /**
     * 发送前处理函数，返回false则取消发送
     */
    before?: () => boolean;
    /**
     * 成功处理函数
     */
    ok: (value?: T, message?: string) => void;
    /**
     * 失败处理函数
     */
    fail?: (result: FailResult) => void;
    /**
     * 未授权处理函数
     */
    unauthorize?: () => void;
    /**
     * 超时处理函数
     */
    timeout?: (result: FailResult) => void;
    /**
     * 请求完成处理函数
     */
    complete?: () => void;
}