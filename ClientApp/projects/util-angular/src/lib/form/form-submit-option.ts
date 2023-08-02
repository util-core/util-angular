//============== 表单提交参数 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===================================================
import { NgForm } from '@angular/forms';
import { FailResult } from "../core/fail-result";
import { HttpMethod } from "../http/http-method";

/**
 * 表单提交参数
 */
export interface IFormSubmitOptions {
    /**
     * 服务端地址
     */
    url: string;
    /**
     * 数据
     */
    data;
    /**
     * Http头
     */
    header?: { name: string, value }[];
    /**
     * Http方法
     */
    httpMethod?: HttpMethod;
    /**
     * 跨域是否允许携带cookie
     */
    withCredentials?: boolean;
    /**
     * 确认消息,设置该项则提交前需要确认
     */
    confirm?: string;
    /**
     * 确认标题
     */
    confirmTitle?: string;
    /**
     * 表单
     */
    form?: NgForm;
    /**
     * 按钮实例，在请求期间禁用该按钮
     */
    button?,
    /**
     * 请求时显示进度条，默认为false
     */
    loading?: boolean,
    /**
     * 提交失败是否显示错误提示，默认为true
     */
    showErrorMessage?: boolean;
    /**
     * 提交成功后是否显示成功提示，默认为true
     */
    showMessage?: boolean;
    /**
     * 提交成功后显示的提示消息，默认为"操作成功"
     */
    message?: string;
    /**
     * 提交成功后是否返回上一个视图，默认为false
     */
    back?: boolean;
    /**
     * 提交成功后关闭弹出层，当在弹出层中编辑时使用，默认为false
     */
    closeDialog?: boolean;
    /**
     * 提交成功后关闭抽屉，当在抽屉中编辑时使用，默认为false
     */
    closeDrawer?: boolean;
    /**
     * 提交前处理函数，返回false则取消提交
     * @param data 数据
     */
    before?: ( data ) => boolean;
    /**
     * 提交成功处理函数
     * @param result 结果
     */
    ok?: ( result ) => void;
    /**
     * 提交失败处理函数
     */
    fail?: ( result: FailResult ) => void;
    /**
     * 操作完成处理函数，注意：该函数在任意情况下都会执行
     */
    complete?: () => void;
}