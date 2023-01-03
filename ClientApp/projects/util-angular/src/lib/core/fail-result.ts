//============== 服务端错误结果 ===================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================
import { HttpErrorResponse } from '@angular/common/http';
import { Result } from "./result";

/**
 * 服务端错误结果
 */
export class FailResult {
    /**
     * 
     * @param result 结果
     * @param errorResponse Http错误响应
     */
    constructor(result?: Result<any>, public errorResponse?: HttpErrorResponse) {
        if (result) {
            this.code = result.code;
            this.message = result.message;
        }
    }
    /**
     * 状态码
     */
    code: string;
    /**
     * 消息
     */
    message: string;
}