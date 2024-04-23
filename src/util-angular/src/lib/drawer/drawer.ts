//============== 抽屉操作 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { ComponentRef } from '@angular/core';
import { NzDrawerService, NzDrawerOptions, NzDrawerRef, NZ_DRAWER_DATA } from "ng-zorro-antd/drawer";
import { Util } from '../util';
import { isUndefined } from '../common/helper';
import { IDrawerOptions } from "./drawer-options";
import { DrawerResizableComponent } from "./drawer-resizable.component";

/**
 * 抽屉操作
 */
export class Drawer {
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
        let drawer: NzDrawerService = this.getDrawerService();
        let drawerRef: NzDrawerRef = drawer.create(this.toOptions(options));
        let resizableRef: ComponentRef<any> = null;
        if (this.util.config.drawer.resizable)
            resizableRef = this.createResizableComponent(drawerRef, options);
        drawerRef.afterOpen.subscribe(() => options.onOpen && options.onOpen());
        drawerRef.afterClose.subscribe(result => {
            options.onClose && options.onClose(result);
            resizableRef?.destroy();
        });
        if (this.util.config.drawer.resizable)
            this.appendResizable(drawerRef, options, resizableRef);
        return drawerRef;
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
        return options.footer;
    }

    /**
     * 获取宽度
     */
    private getWidth(options: IDrawerOptions) {
        if (options.width || options.size)
            return options.width;
        let width = this.util.responsive.getWidth();
        return this.util.config.drawer.getWidth(width);
    }

    /**
     * 创建调整尺寸组件
     */
    private createResizableComponent(drawer: NzDrawerRef, options: IDrawerOptions) {
        let component = this.util.component.create(DrawerResizableComponent);
        component.instance.drawer = drawer;
        component.instance.setDirection();
        component.instance.setPadding();
        component.setInput("minWidth", this.getMinWidth(options));
        component.setInput("maxWidth", this.getMaxWidth(options));
        return component;
    }

    /**
     * 获取最小宽度
     */
    private getMinWidth(options: IDrawerOptions) {
        if (this.util.helper.isUndefined(options.minWidth)) {
            let width = this.util.responsive.getWidth();
            return this.util.config.drawer.getMinWidth(width);
        }
        return options.minWidth;
    }

    /**
     * 获取最大宽度
     */
    private getMaxWidth(options: IDrawerOptions) {
        if (this.util.helper.isUndefined(options.maxWidth)) {
            let width = this.util.responsive.getWidth();
            return this.util.config.drawer.getMaxWidth(width);
        }
        return options.maxWidth;
    }

    /**
     * 添加拖动调整尺寸
     */
    private appendResizable(drawer: NzDrawerRef, options: IDrawerOptions, resizableRef: ComponentRef<any>) {
        if (!drawer)
            return;
        if (options.placement === "top" || options.placement === "bottom")
            return;
        setTimeout(() => {
            let drawerBody = this.findDrawerBody(drawer);
            this.setResizable(drawerBody, resizableRef);
        }, 30);
    }

    /**
     * 找出当前抽屉主体
     */
    private findDrawerBody(drawer) {
        let element = this.util.dom.getNativeElement(drawer.componentRef);
        if (!element)
            return null;
        return this.util.dom.find(".ant-drawer-body", element?.parentNode?.parentNode);
    }    

    /**
     * 设置调整尺寸
     */
    private setResizable(drawerBody: Element, resizableRef: ComponentRef<any>) {
        if (!drawerBody)
            return;
        let resizableElement = this.util.dom.getNativeElement(resizableRef);
        let containerElement = this.util.dom.find(".x-drawer-container", resizableElement);
        if (!containerElement)
            return;
        let i = drawerBody.childNodes.length;
        let footer;
        while (i > 0) {
            i--;
            let item = drawerBody.childNodes.item(0);
            this.util.dom.appendChild(containerElement, item);
        }
        this.util.dom.appendChild(drawerBody, resizableElement);
        this.util.dom.insertAfter(resizableElement, footer);
    }

    /**
     * 获取抽屉实例
     */
    getDrawer(): NzDrawerRef {
        return this.util.ioc.get(NzDrawerRef);
    }

    /**
     * 关闭抽屉
     * @param result 返回结果
     */
    close(result?) {
        let drawerRef: NzDrawerRef = this.getDrawer();
        drawerRef && drawerRef.close(result);
    }

    /**
     * 获取数据
     */
    getData<T>() {
        return this.util.ioc.get<T>(NZ_DRAWER_DATA);
    }
}