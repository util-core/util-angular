//============== 消息操作=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { NzMessageService, NzMessageDataOptions } from 'ng-zorro-antd/message';
import { Util } from '../util';
import { IConfirmOptions } from "./confirm-options";

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
     * 获取消息服务
     */
    private getService() {
        return this.util.ioc.get<NzMessageService>(NzMessageService);
    }

    /**
     * 成功消息
     * @param message 消息
     */
    success(message: string) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        let service = this.getService();
        service.success(message, this.getOptions());
    }

    /**
     * 获取消息配置
     */
    private getOptions(): NzMessageDataOptions {
        return {
            nzDuration: this.util.config.message.duration
        };
    }

    /**
     * 信息消息
     * @param message 消息
     */
    info(message: string) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        let service = this.getService();
        service.info(message, this.getOptions());
    }

    /**
     * 警告消息
     * @param message 消息
     */
    warn(message: string) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        let service = this.getService();
        service.warning(message, this.getOptions());
    }

    /**
     * 错误消息
     * @param message 消息
     */
    error(message: string) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        let service = this.getService();
        service.error(message, this.getOptions());
    }

    /**
     * 确认
     * @param options 配置
     */
    confirm(options: IConfirmOptions) {
        this.util.dialog.confirm(options);
    }
}