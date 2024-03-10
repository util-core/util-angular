//============== 弹出层操作 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { EventEmitter } from "@angular/core";
import { NzModalService, ModalOptions, NzModalRef, OnClickCallback, NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { NzButtonType } from 'ng-zorro-antd/button';
import { Util } from '../util';
import { isUndefined } from '../common/helper';
import { IConfirmOptions } from "../message/confirm-options";
import { IDialogOptions } from "./dialog-options";

/**
 * 弹出层操作
 */
export class Dialog {
    /**
     * 初始化弹出层操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 获取模态窗服务
     */
    private getModalService() {
        return this.util.ioc.get<NzModalService>(NzModalService);
    }

    /**
     * 成功消息
     * @param message 消息
     * @param title 标题
     * @param onOk 点击确定事件处理函数
     */
    success(message: string, title?: string, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        title = this.util.i18n.get(title);
        let service = this.getModalService();
        service.success({
            nzContent: message,
            nzTitle: title,
            nzOnOk: onOk
        });
    }

    /**
     * 信息消息
     * @param message 消息
     * @param title 标题
     * @param onOk 点击确定事件处理函数
     */
    info(message: string, title?: string, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        title = this.util.i18n.get(title);
        let service = this.getModalService();
        service.info({
            nzContent: message,
            nzTitle: title,
            nzOnOk: onOk
        });
    }

    /**
     * 警告消息
     * @param message 消息
     * @param title 标题
     * @param onOk 点击确定事件处理函数
     */
    warn(message: string, title?: string, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        title = this.util.i18n.get(title);
        let service = this.getModalService();
        service.warning({
            nzContent: message,
            nzTitle: title,
            nzOnOk: onOk
        });
    }

    /**
     * 错误消息
     * @param message 消息
     * @param title 标题
     * @param onOk 点击确定事件处理函数
     */
    error(message: string, title?: string, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return;
        message = this.util.i18n.get(message);
        title = this.util.i18n.get(title);
        let service = this.getModalService();
        service.error({
            nzContent: message,
            nzTitle: title,
            nzOnOk: onOk
        });
    }

    /**
     * 确认
     * @param options 配置
     */
    confirm(options: IConfirmOptions) {
        this.util.message.confirm(options);
    }

    /**
     * 打开弹出层
     * @param options 弹出层配置
     */
    open(options?: IDialogOptions): NzModalRef {
        options = options || {};
        if (options.onOpenBefore && options.onOpenBefore() === false)
            return null;
        this.initOptions(options);
        let dialog: NzModalService = this.getModalService();
        let dialogRef: NzModalRef = dialog.create(this.toOptions(options));
        dialogRef.afterOpen.subscribe(() => options.onOpen && options.onOpen());
        dialogRef.afterClose.subscribe((result) => options.onClose && options.onClose(result));
        return dialogRef;
    }

    /**
     * 初始化配置
     */
    private initOptions(options: IDialogOptions) {
        if (!options.data)
            options.data = {};
    }

    /**
     * 转换配置
     */
    private toOptions(options: IDialogOptions): ModalOptions {
        return {
            nzTitle: this.getTitle(options),
            nzContent: options.component || options.content,
            nzData: options.data,
            nzCentered: options.centered,
            nzWidth: options.width,
            nzCancelText: this.getCancelText(options),
            nzCancelLoading: options.cancelLoading,
            nzOkText: this.getOkText(options),
            nzOkType: this.getOkType(options),
            nzOkDanger: options.okDanger,
            nzOkLoading: options.okLoading,
            nzClosable: isUndefined(options.showClose) ? true : options.showClose,
            nzMask: isUndefined(options.showMask) ? true : options.showMask,
            nzFooter: this.getFooter(options),
            nzMaskClosable: !options.disableClose,
            nzKeyboard: !options.disableClose,
            nzStyle: options.style,
            nzBodyStyle: options.bodyStyle,
            nzMaskStyle: options.maskStyle,
            nzClassName: options.className,
            nzWrapClassName: options.wrapClassName,
            nzAutofocus: this.getAutofocus(options),
            nzOnOk: options.onOk,
            nzOnCancel: data => {
                if (data.tag === true) {
                    options.onCloseBefore && options.onCloseBefore(data.result);
                    return;
                }
                options.onCloseBefore && options.onCloseBefore(null);
            }
        };
    }

    /**
     * 获取标题
     */
    private getTitle(options: IDialogOptions) {
        if (this.util.helper.isString(options.title))
            return this.util.i18n.get(<string>options.title);
        return options.title;
    }

    /**
     * 获取取消按钮文本
     */
    private getCancelText(options: IDialogOptions) {
        if (options.showCancel === false)
            return null;
        return options.cancelText;
    }

    /**
     * 获取确定按钮文本
     */
    private getOkText(options: IDialogOptions) {
        if (options.showOk === false)
            return null;
        return options.okText;
    }

    /**
    * 获取确定按钮类型
    */
    private getOkType(options: IDialogOptions): NzButtonType {
        if (options.okType)
            return options.okType;
        return "primary";
    }

    /**
     * 获取页脚
     */
    private getFooter(options: IDialogOptions) {
        if (options.showFooter === false)
            return null;
        return options.footer;
    }

    /**
     * 获取焦点设置
     */
    private getAutofocus(options: IDialogOptions) {
        if (options.autofocus)
            return options.autofocus;
        return 'auto';
    }

    /**
     * 关闭所有弹出层
     */
    closeAll() {
        let dialog = this.getModalService();
        dialog.closeAll();
    }

    /**
     * 关闭弹出层
     * @param result 返回结果
     */
    close(result?) {
        let dialogRef = this.getDialog();
        if (dialogRef)
            dialogRef.close(result);
    }

    /**
     * 获取弹出层实例
     */
    getDialog() {
        let dialog: NzModalService = this.getModalService();
        if (!dialog)
            return null;
        if (!dialog.openModals || dialog.openModals.length === 0)
            return null;
        let dialogRef: NzModalRef = dialog.openModals[dialog.openModals.length - 1];
        if (!dialogRef)
            return null;
        let content = dialogRef.getContentComponent();
        if (!content && dialog.openModals.length > 1)
            dialogRef = dialog.openModals[dialog.openModals.length - 2];
        return dialogRef;
    }

    /**
     * 获取数据
     */
    getData<T>() {
        return this.util.ioc.get<T>(NZ_MODAL_DATA);
    }
}