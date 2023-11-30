//============== 抽屉操作 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { ComponentRef } from '@angular/core';
import { NzDrawerService, NzDrawerOptions, NzDrawerRef, NZ_DRAWER_DATA } from "ng-zorro-antd/drawer";
import { NzButtonType } from 'ng-zorro-antd/button';
import { Util } from '../util';
import { isUndefined } from '../common/helper';
import { IDrawerOptions } from "./drawer-options";
import { DrawerFooterComponent } from './drawer-footer.component';
import { I18nKeys } from "../config/i18n-keys";

/**
 * 抽屉操作
 */
export class Drawer {
    /**
     * 页脚组件
     */
    private _footer: ComponentRef<DrawerFooterComponent>;

    /**
     * 初始化抽屉操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 打开抽屉
     * @param options 抽屉配置
     */
    open(options?: IDrawerOptions): NzDrawerRef {
        options = options || {};
        if (options.onOpenBefore && options.onOpenBefore() === false)
            return null;
        this.initOptions(options);
        this._footer = this.createFooter();
        let drawer: NzDrawerService = this.getDrawerService();
        let drawerRef: NzDrawerRef = drawer.create(this.toOptions(options));
        this._footer.setInput("drawer", drawerRef);
        drawerRef.afterOpen.subscribe(() => options.onOpen && options.onOpen());
        drawerRef.afterClose.subscribe((result) => options.onClose && options.onClose(result));
        return drawerRef;
    }

    /**
     * 创建页脚
     */
    private createFooter() {
        return this.util.component.create(DrawerFooterComponent);
    }

    /**
     * 获取抽屉服务
     */
    private getDrawerService() {
        return this.util.ioc.get(NzDrawerService);
    }

    /**
     * 初始化配置
     */
    private initOptions(options: IDrawerOptions) {
        if (!options.data)
            options.data = {};
    }

    /**
     * 转换配置
     */
    private toOptions(options: IDrawerOptions): NzDrawerOptions {
        return {
            nzTitle: this.getTitle(options),
            nzContent: options.component || options.content,
            nzData: options.data,
            nzOnCancel: this.getOnCancel(options),
            nzClosable: isUndefined(options.showClose) ? true : options.showClose,
            nzExtra: options.extra,
            nzMaskClosable: !options.disableClose,
            nzKeyboard: !options.disableClose,
            nzMask: isUndefined(options.showMask) ? true : options.showMask,
            nzCloseOnNavigation: isUndefined(options.closeOnNavigation) ? true : options.closeOnNavigation,
            nzDirection: options.direction,
            nzMaskStyle: options.maskStyle,
            nzBodyStyle: options.bodyStyle,
            nzFooter: this.getFooter(options),
            nzSize: options.size,
            nzWidth: this.getWidth(options),
            nzHeight: options.height,
            nzWrapClassName: options.wrapClassName,
            nzZIndex: options.zIndex,
            nzPlacement: isUndefined(options.placement) ? 'right' : options.placement,
            nzOffsetX: options.offsetX,
            nzOffsetY: options.offsetY
        };
    }

    /**
     * 获取标题
     */
    private getTitle(options: IDrawerOptions) {
        if (this.util.helper.isString(options.title))
            return this.util.i18n.get(<string>options.title);
        return options.title;
    }

    /**
     * 获取取消操作
     */
    private getOnCancel(options: IDrawerOptions): () => Promise<any> {
        if (!options.onCloseBefore)
            return undefined;
        let result = options.onCloseBefore();
        if (this.util.helper.isPromise(result))
            return () => <Promise<any>>result;
        return () => Promise.resolve(result);
    }

    /**
     * 获取页脚
     */
    private getFooter(options: IDrawerOptions) {
        if (options.showFooter === false)
            return null;
        if (options.footer)
            return options.footer;
        this._footer.setInput("btnCancelText", this.getCancelText(options));
        this._footer.setInput("btnOkText", this.getOkText(options));
        this._footer.setInput("btnOkType", this.getOkType(options));
        this._footer.setInput("btnOkDanger", this.getOkDanger(options));
        this._footer.setInput("onOk", options.onOk);
        this._footer.setInput("okAfterClose", options.okAfterClose);
        return this._footer.instance.footer;
    }

    /**
     * 获取取消按钮文本
     */
    private getCancelText(options: IDrawerOptions) {
        if (options.showCancel === false)
            return null;
        let value = !!options.cancelText ? options.cancelText : I18nKeys.cancel;
        return this.util.i18n.get(value);
    }

    /**
     * 获取确定按钮文本
     */
    private getOkText(options: IDrawerOptions) {
        if (options.showOk === false)
            return null;
        let value = !!options.okText ? options.okText : I18nKeys.ok;
        return this.util.i18n.get(value);
    }

    /**
     * 获取确定按钮类型
     */
    private getOkType(options: IDrawerOptions): NzButtonType {
        if (options.okType)
            return options.okType;
        return "primary";
    }

    /**
     * 获取确定按钮危险状态
     */
    private getOkDanger(options: IDrawerOptions) {
        if (options.okDanger)
            return options.okDanger;
        return false;
    }

    /**
     * 获取宽度
     */
    private getWidth(options: IDrawerOptions) {
        if (options.width || options.size)
            return options.width;
        return '30%';
    }

    /**
     * 关闭抽屉
     * @param result 返回结果
     */
    close(result?) {
        let drawerRef: NzDrawerRef = this.util.ioc.get(NzDrawerRef);
        drawerRef && drawerRef.close(result);
    }

    /**
     * 获取数据
     */
    getData<T>() {
        return this.util.ioc.get<T>(NZ_DRAWER_DATA);
    }
}