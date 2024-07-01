//============== 通知操作=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef } from '@angular/core';
import { NzNotificationService, NzNotificationDataOptions } from 'ng-zorro-antd/notification';
import { Util } from '../util';

/**
 * 通知操作
 */
export class Notification {
    /**
     * 
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 成功通知
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    success(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.create('success', message, title, options);
    }

    /**
     * 创建通知
     */
    private create(type: 'success' | 'info' | 'warning' | 'error' | 'blank', message, title?, options?: NzNotificationDataOptions) {
        if (!message)
            return null;
        return this.getService().create(type, this.getMessage(title), this.getMessage(message), options);
    }

    /**
     * 获取通知服务
     */
    private getService() {
        return this.util.ioc.get<NzNotificationService>(NzNotificationService);
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
     * 信息通知
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    info(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.create('info', message, title, options);
    }

    /**
     * 警告通知
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    warn(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.create('warning', message, title, options);
    }

    /**
     * 警告通知
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    warning(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.warn(message, title, options);
    }

    /**
     * 错误通知
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    error(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.create('error', message, title, options);
    }

    /**
     * 通知,不带图标
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param options 通知配置
     */
    blank(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, options?: NzNotificationDataOptions) {
        return this.create('blank', message, title, options);
    }

    /**
     * 通知
     * @param template 模板
     * @param options 通知配置
     */
    template(template: TemplateRef<{}>, options?: NzNotificationDataOptions) {
        return this.getService().template(template, options);
    }

    /**
     * 移除通知
     * @param id 通知标识,不传入则移除所有通知
     */
    remove(id?: string) {
        this.getService().remove(id);
    }
}