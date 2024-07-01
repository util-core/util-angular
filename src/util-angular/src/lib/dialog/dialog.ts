//============== 对话框操作 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { ComponentRef, EventEmitter, TemplateRef } from "@angular/core";
import { NzModalService, ModalOptions, NzModalRef, OnClickCallback, NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { NzButtonType } from 'ng-zorro-antd/button';
import { NzConfigService, ModalConfig } from "ng-zorro-antd/core/config";
import { Util } from '../util';
import { isUndefined } from '../common/helper';
import { I18nKeys } from '../config/i18n-keys';
import { IConfirmOptions } from "./confirm-options";
import { IDialogOptions } from "./dialog-options";
import { DialogResizableComponent } from "./dialog-resizable.component";
import { DialogCloseComponent } from "./dialog-close.component";
import { DialogFullscreenService } from "./dialog-fullscreen.service";

/**
 * 对话框操作
 */
export class Dialog {
    /**
     * 初始化对话框操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 成功消息对话框
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param onOk 点击确定事件处理函数
     */
    success(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return null;
        let service = this.getModalService();
        return service.success({
            nzContent: this.getMessage(message),
            nzTitle: this.getMessage(title),
            nzOnOk: onOk            
        });
    }

    /**
     * 获取模态窗服务
     */
    private getModalService() {
        return this.util.ioc.get<NzModalService>(NzModalService);
    }

    /**
     * 获取消息
     */
    private getMessage(message): string | TemplateRef<{}> {
        if (this.util.helper.isString(message))
            return this.util.i18n.get(<string>message);
        return message;
    }

    /**
     * 信息消息对话框
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param onOk 点击确定事件处理函数
     */
    info(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return null;
        let service = this.getModalService();
        return service.info({
            nzContent: this.getMessage(message),
            nzTitle: this.getMessage(title),
            nzOnOk: onOk
        });
    }

    /**
     * 警告消息对话框
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param onOk 点击确定事件处理函数
     */
    warning(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        this.warn(message, title, onOk);
    }

    /**
     * 警告消息对话框
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param onOk 点击确定事件处理函数
     */
    warn(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return null;
        let service = this.getModalService();
        return service.warning({
            nzContent: this.getMessage(message),
            nzTitle: this.getMessage(title),
            nzOnOk: onOk
        });
    }

    /**
     * 错误消息对话框
     * @param message 消息,支持多语言
     * @param title 标题,支持多语言
     * @param onOk 点击确定事件处理函数
     */
    error(message: string | TemplateRef<void>, title?: string | TemplateRef<void>, onOk?: EventEmitter<any> | OnClickCallback<any>) {
        if (!message)
            return null;
        let service = this.getModalService();
        return service.error({
            nzContent: this.getMessage(message),
            nzTitle: this.getMessage(title),
            nzOnOk: onOk
        });
    }

    /**
     * 打开对话框
     * @param options 对话框配置
     */
    open(options: IDialogOptions): NzModalRef {
        options = options || {};
        if (options.onOpenBefore && options.onOpenBefore() === false)
            return null;
        this.initOptions(options);
        let onFullScreen = this.initOnFullScreen(options);
        let closeRef: ComponentRef<DialogCloseComponent> = null;
        if (this.util.config.dialog.fullScreen)
            closeRef = this.util.component.create(DialogCloseComponent);
        let dialog: NzModalService = this.getModalService();
        let dialogRef: NzModalRef = dialog.create(this.toOptions(options, closeRef));
        this.initCloseRef(closeRef, dialogRef);
        let resizableRef: ComponentRef<any> = null;
        if (this.util.config.dialog.resizable)
            resizableRef = this.createResizableComponent(dialogRef, options);
        dialogRef.afterOpen.subscribe(() => options.onOpen && options.onOpen());
        dialogRef.afterClose.subscribe((result) => {
            options.onClose && options.onClose(result);
            onFullScreen?.unsubscribe();
            resizableRef?.destroy();
            closeRef?.destroy();
        });
        this.initDialog(dialogRef, resizableRef);
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
     * 初始化全屏事件处理
     */
    private initOnFullScreen(options: IDialogOptions) {
        let dialogFullscreenService = this.util.ioc.get(DialogFullscreenService);
        return dialogFullscreenService.onChange(options.onFullscreen);
    }

    /**
     * 初始化关闭组件
     */
    private initCloseRef(closeRef: ComponentRef<DialogCloseComponent>, dialogRef: NzModalRef) {
        if (!closeRef)
            return;
        closeRef.instance.util = this.util;
        closeRef.instance.dialog = dialogRef;
    }

    /**
     * 转换配置
     */
    private toOptions(options: IDialogOptions, closeRef: ComponentRef<any>): ModalOptions {
        const configService = this.util.ioc.get<NzConfigService>(NzConfigService);
        const modalConfig = configService.getConfig().modal;
        return {
            nzTitle: this.getTitle(options),
            nzContent: options.component || options.content,
            nzData: options.data,
            nzFooter: this.getFooter(options),
            nzCentered: this.getCentered(options),
            nzDraggable: this.getDraggable(options),
            nzWidth: this.getWidth(options),
            nzCancelText: this.getCancelText(options),
            nzCancelLoading: options.cancelLoading,
            nzOkText: this.getOkText(options),
            nzOkType: this.getOkType(options),
            nzOkDisabled: options.okDisabled,
            nzOkDanger: options.okDanger,
            nzOkLoading: options.okLoading,
            nzCancelDisabled: options.cancelDisabled,
            nzClosable: this.getClosable(options),
            nzMaskClosable: this.getMaskClosable(options, modalConfig),
            nzKeyboard: this.getKeyboard(options),
            nzMask: this.getMask(options, modalConfig),            
            nzCloseOnNavigation: this.getCloseOnNavigation(options, modalConfig),
            nzStyle: options.style,
            nzBodyStyle: options.bodyStyle,
            nzMaskStyle: options.maskStyle,
            nzClassName: options.className,
            nzCloseIcon: this.getCloseIcon(options, closeRef),
            nzWrapClassName: this.getWrapClassName(options),
            nzZIndex: isUndefined(options.zIndex) ? 1000 : options.zIndex,
            nzIconType: isUndefined(options.iconType) ? 'question-circle' : options.iconType,
            nzAutofocus: this.getAutofocus(options),
            nzOnOk: options.onOk,
            nzOnCancel: data => {
                if (options.onCancel)
                    return options.onCancel(data);
                if (options.onCloseBefore)
                    return options.onCloseBefore(data);
            }
        };
    }

    /**
     * 获取标题
     */
    private getTitle(options: IDialogOptions) {
        let result = options.title;
        if (this.util.helper.isString(result))
            return this.util.i18n.get(<string>result);
        return result;
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
     * 获取垂直居中
     */
    private getCentered(options) {
        if (isUndefined(options.centered))
            return this.util.config.dialog.centered;
        return options.centered;
    }

    /**
     * 获取是否可拖动
     */
    private getDraggable(options: IDialogOptions) {
        if (isUndefined(options.draggable))
            return this.util.config.dialog.draggable;
        return options.draggable;
    }

    /**
     * 获取宽度
     */
    private getWidth(options: IDialogOptions) {
        if (options.width)
            return options.width;
        let width = this.util.responsive.getWidth();
        return this.util.config.dialog.getWidth(width);
    }

    /**
     * 获取取消按钮文本
     */
    private getCancelText(options: IDialogOptions) {
        if (options.showCancel === false)
            return null;
        return this.util.i18n.get(options.cancelText);
    }

    /**
     * 获取确定按钮文本
     */
    private getOkText(options) {
        if (options.showOk === false)
            return null;
        return this.util.i18n.get(options.okText);
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
     * 获取是否显示关闭按钮
     */
    private getClosable(options: IDialogOptions) {
        if (!isUndefined(options.closable))
            return options.closable;
        if (!isUndefined(options.showClose))
            return options.showClose;
        return true;
    }

    /**
     * 获取按下ESC键是否允许关闭
     */
    private getKeyboard(options: IDialogOptions) {
        if (!isUndefined(options.keyboard))
            return options.keyboard;
        if (!isUndefined(options.disableClose))
            return !options.disableClose;
        return true;
    }

    /**
     * 获取点击遮罩是否允许关闭
     */
    private getMaskClosable(options: IDialogOptions, modalConfig: ModalConfig) {
        if (!isUndefined(options.maskClosable))
            return options.maskClosable;
        if (!isUndefined(options.disableClose))
            return !options.disableClose;
        if (modalConfig && !isUndefined(modalConfig.nzMaskClosable))
            return modalConfig.nzMaskClosable;
        return true;
    }

    /**
     * 获取是否显示遮罩
     */
    private getMask(options: IDialogOptions, modalConfig: ModalConfig) {
        if (!isUndefined(options.mask))
            return options.mask;
        if (!isUndefined(options.showMask))
            return options.showMask;
        if (modalConfig && !isUndefined(modalConfig.nzMask))
            return modalConfig.nzMask;
        return true;
    }

    /**
     * 获取当用户在历史中前进/后退时是否关闭对话框
     */
    private getCloseOnNavigation(options: IDialogOptions, modalConfig: ModalConfig) {
        if (!isUndefined(options.closeOnNavigation))
            return options.closeOnNavigation;
        if (modalConfig && !isUndefined(modalConfig.nzCloseOnNavigation))
            return modalConfig.nzCloseOnNavigation;
        return true;
    }

    /**
     * 获取关闭按钮图标
     */
    private getCloseIcon(options: IDialogOptions, closeRef: ComponentRef<any>) {
        if (!isUndefined(options.closeIcon))
            return options.closeIcon;
        if (!this.util.config.dialog.fullScreen)
            return "close";
        return closeRef.instance.templateRef;
    }

    /**
     * 获取外层容器样式类名
     */
    private getWrapClassName(options: IDialogOptions) {
        if (options.wrapClassName)
            return options.wrapClassName;
        if (options.addWrapClass === false)
            return '';
        if (options.addWrapClass || this.util.config.dialog.addWrapClass)
            return this.util.config.dialog.defaultWrapClassName;
        return '';
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
     * 创建调整尺寸组件
     */
    private createResizableComponent(dialog: NzModalRef, options: IDialogOptions) {
        let component = this.util.component.create(DialogResizableComponent);
        component.instance.dialog = dialog;
        component.setInput("minWidth", this.getMinWidth(options));
        component.setInput("maxWidth", this.getMaxWidth(options));
        component.setInput("minHeight", this.getMinHeight(options));
        component.setInput("maxHeight", this.getMaxHeight(options));
        return component;
    }

    /**
     * 获取最小宽度
     */
    private getMinWidth(options: IDialogOptions) {
        if (isUndefined(options.minWidth)) {
            let width = this.util.responsive.getWidth();
            return this.util.config.dialog.getMinWidth(width);
        }
        return options.minWidth;
    }

    /**
     * 获取最大宽度
     */
    private getMaxWidth(options: IDialogOptions) {
        if (isUndefined(options.maxWidth)) {
            let width = this.util.responsive.getWidth();
            return this.util.config.dialog.getMaxWidth(width);
        }
        return options.maxWidth;
    }

    /**
     * 获取最小高度
     */
    private getMinHeight(options: IDialogOptions) {
        if (isUndefined(options.minHeight)) {
            let height = this.util.responsive.getHeight();
            return this.util.config.dialog.getMinHeight(height);
        }
        return options.minHeight;
    }

    /**
     * 获取最大高度
     */
    private getMaxHeight(options: IDialogOptions) {
        if (isUndefined(options.maxHeight)) {
            let height = this.util.responsive.getHeight();
            return this.util.config.dialog.getMaxHeight(height);
        }
        return options.maxHeight;
    }

    /**
     * 初始化对话框
     */
    private initDialog(dialog: NzModalRef, resizableRef: ComponentRef<any>) {
        setTimeout(() => {
            if (this.util.config.dialog.resizable)
                this.appendResizable(dialog, resizableRef);
        }, 30);
    }

    /**
     * 添加拖动调整尺寸
     */
    private appendResizable(dialog: NzModalRef, resizableRef: ComponentRef<any>) {
        let modalContent = this.util.dom.find(".ant-modal-content", dialog.containerInstance);
        if (!modalContent)
            return;
        let resizableElement = this.util.dom.getNativeElement(resizableRef);
        let containerElement = this.util.dom.find(".x-dialog-container", resizableElement);
        if (!containerElement)
            return;
        let i = modalContent.childNodes.length;
        while (i > 0) {
            i--;
            let item = modalContent.childNodes.item(0);
            let element = item as HTMLDivElement;
            if (element?.className?.startsWith("ant-modal-close")) {
                this.util.dom.insertBefore(containerElement, element);
                continue;
            }
            if (element?.className?.startsWith("ant-modal-header")) {
                this.util.dom.insertBefore(containerElement, element);
                continue;
            }
            if (element?.className?.startsWith("ant-modal-footer")) {
                this.util.dom.insertAfter(containerElement, element);
                continue;
            }
            this.util.dom.appendChild(containerElement, item);
        }
        this.util.dom.appendChild(modalContent, resizableElement);
    }

    /**
     * 关闭所有对话框
     */
    closeAll() {
        let dialog = this.getModalService();
        dialog.closeAll();
    }

    /**
     * 关闭对话框
     * @param result 返回结果
     */
    close(result?) {
        let dialog = this.getDialog();
        dialog && dialog.close(result);
    }

    /**
     * 获取对话框实例
     */
    getDialog() {
        let dialog: NzModalService = this.getModalService();
        if (!dialog)
            return null;
        if (!dialog.openModals || dialog.openModals.length === 0)
            return null;
        return dialog.openModals[dialog.openModals.length - 1];
    }

    /**
     * 获取对话框数据
     */
    getData<T>() {
        return this.util.ioc.get<T>(NZ_MODAL_DATA);
    }

    /**
     * 确认对话框
     * @param options 配置
     */
    confirm(options: IConfirmOptions) {
        options = options || {};
        if (!options.onCancel)
            options.onCancel = () => true;
        options.title = options.title || I18nKeys.tips;
        let service = this.util.ioc.get<NzModalService>(NzModalService);
        return service.confirm({
            nzTitle: this.getTitle(options),
            nzContent: this.getContent(options),
            nzCentered: this.getCentered(options),
            nzWidth: options.width || 416,
            nzClosable: this.util.helper.isUndefined(options.showClose) ? true : options.showClose,
            nzMask: this.util.helper.isUndefined(options.showMask) ? true : options.showMask,
            nzMaskClosable: !options.disableClose,
            nzKeyboard: !options.disableClose,
            nzCancelText: this.getCancelText(options),
            nzCancelLoading: options.cancelLoading,
            nzOkText: this.getOkText(options),
            nzOkType: options.okType || "primary",
            nzOkDanger: options.okDanger,
            nzOkLoading: options.okLoading,
            nzOnOk: options.onOk,
            nzOnCancel: options.onCancel
        });
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
}