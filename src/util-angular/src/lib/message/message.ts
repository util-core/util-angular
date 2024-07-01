//============== 消息操作=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef } from '@angular/core';
import { NzMessageService, NzMessageDataOptions } from 'ng-zorro-antd/message';
import { Util } from '../util';
import { IConfirmOptions } from "../dialog/confirm-options";

/**
 * 消息操作
 */
export class Message {
    /**
     * 
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 成功消息
     * @param message 消息
     * @param options 消息配置
     */
    success(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.create('success', message, options);
    }

    /**
     * 创建消息
     */
    private create(type: 'success' | 'info' | 'warning' | 'error' | 'loading', message, options?: NzMessageDataOptions) {
        if (!message)
            return null;
        return this.getService().create(type, this.getMessage(message), options);
    }

    /**
     * 获取消息服务
     */
    private getService() {
        return this.util.ioc.get<NzMessageService>(NzMessageService);
    }

    /**
     * 获取消息
     */
    private getMessage(message) {
        if (this.util.helper.isString(message))
            return this.util.i18n.get(<string>message);
        return message;
    }

    /**
     * 信息消息
     * @param message 消息
     * @param options 消息配置
     */
    info(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.create('info', message, options);
    }

    /**
     * 警告消息
     * @param message 消息
     * @param options 消息配置
     */
    warn(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.create('warning', message, options);
    }

    /**
     * 警告消息
     * @param message 消息
     * @param options 消息配置
     */
    warning(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.warn(message, options);
    }

    /**
     * 错误消息
     * @param message 消息
     * @param options 消息配置
     */
    error(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.create('error', message, options);
    }

    /**
     * 加载消息
     * @param message 消息
     * @param options 消息配置
     */
    loading(message: string | TemplateRef<void>, options?: NzMessageDataOptions) {
        return this.create('loading', message, options);
    }

    /**
     * 移除消息
     * @param id 消息标识,如果为空,则清除所有消息
     */
    remove(id?: string) {
        this.getService().remove(id);
    }

    /**
     * 确认
     * @param options 确认配置
     */
    confirm(options: IConfirmOptions) {
        return this.util.dialog.confirm(options);
    }
}