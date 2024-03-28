//============== 服务端结果约定===================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================

/**
 * 服务端结果约定
 */
export class Result<T> {
    /**
     * 状态码
     */
    code: string;
    /**
     * 消息
     */
    message: string;
    /**
     * 数据
     */
    data: T;
}