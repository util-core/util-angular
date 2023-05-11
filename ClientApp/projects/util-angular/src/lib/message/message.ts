//============== 消息操作=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from "ng-zorro-antd/modal";
import { Util } from '../util';
import { isUndefined } from '../common/helper';
import { AppConfig, initAppConfig } from '../config/app-config';
import { IConfirmOptions } from "./confirm-options";
import { I18nKeys } from '../config/i18n-keys';

/**
 * 消息操作
 */
export class Message {
    /**
     * 应用配置
     */
    private _config: AppConfig;
    /**
     * 
     * @param ioc Ioc操作
     */
    constructor(private util: Util) {
        this._config = this.util.ioc.get(AppConfig);
        initAppConfig(this._config);
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
        service.success(message);
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
        service.info(message);
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
        service.warning(message);
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
        service.error(message);
    }

    /**
     * 确认
     * @param options 配置
     */
    confirm(options: IConfirmOptions) {
        options = options || {};
        if (!options.onCancel)
            options.onCancel = () => true;
        let service = this.util.ioc.get(NzModalService);
        service.confirm({
            nzTitle: this.getTitle(options),
            nzContent: this.getContent(options),
            nzCentered: options.centered,
            nzWidth: options.width || 416,
            nzClosable: isUndefined(options.showClose) ? true : options.showClose,
            nzMask: isUndefined(options.showMask) ? true : options.showMask,
            nzMaskClosable: !options.disableClose,
            nzKeyboard: !options.disableClose,
            nzCancelText: this.getCancelText(options),
            nzCancelLoading: options.cancelLoading,
            nzOkText: this.getOkText(options),
            nzOkType: options.okType || "primary",
            nzOkDanger: options.okDanger,
            nzOkLoading: options.okLoading,
            nzOnOk: options.onOk,
            nzOnCancel: options.onCancel,
        });
    }

    /**
     * 获取标题
     */
    private getTitle(options: IConfirmOptions) {
        let result = options.title || I18nKeys.tips;
        if( typeof result === "string" )
            return this.util.i18n.get(result);
        return result;
    }

    /**
     * 获取内容
     */
    private getContent(options: IConfirmOptions) {
        let result = options.content;
        if (typeof result === "string")
            return this.util.i18n.get(result);
        return result;
    }

    /**
     * 获取取消按钮文本
     */
    private getCancelText(options: IConfirmOptions) {
        if (options.showCancel === false)
            return null;
        return this.util.i18n.get(options.cancelText);
    }

    /**
     * 获取确定按钮文本
     */
    private getOkText(options: IConfirmOptions) {
        if (options.showOk === false)
            return null;
        return this.util.i18n.get(options.okText);
    }
}