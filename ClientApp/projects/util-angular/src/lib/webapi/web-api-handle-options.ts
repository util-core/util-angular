//============== WebApi响应处理配置=========================
//Copyright 2023 何镇汐
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
    ok: (value: T) => void;
    /**
     * 失败处理函数
     */
    fail?: (result: FailResult) => void;
    /**
     * 请求完成处理函数
     */
    complete?: () => void;
}