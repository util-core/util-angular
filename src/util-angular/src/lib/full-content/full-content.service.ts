//============== 全屏内容区服务 =============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===========================================================
import { ComponentRef } from '@angular/core';
import { Util } from "../util";
import { FullContentCloseComponent } from "./full-content-close.component";
import { FullContentFooterComponent } from "./full-content-footer.component";

/**
 * 全屏内容区服务
 */
export class FullContentService {
    /**
     * 操作入口
     */
    private util: Util;
    /**
     * 包装容器
     */
    private _container;
    /**
     * 全屏内容
     */
    private _content;
    /**
     * 挂载点
     */
    private _mount: HTMLElement;
    /**
     * 外层class类
     */
    private _wrapClass;
    /**
     * 是否包装
     */
    private _isPack: boolean;
    /**
     * 标题
     */
    private _title:string;
    /**
     * 关闭组件
     */
    private _closeComponent: ComponentRef<FullContentCloseComponent>;
    /**
     * 页脚组件
     */
    private _footerComponent: ComponentRef<FullContentFooterComponent>;

    /**
     * 初始化全屏内容区服务
     */
    constructor(util: Util) {
        this.util = util;
        this.createMount();
    }

    /**
     * 创建挂载点
     */
    private createMount() {
        this._mount = this.util.dom.createElement("div");
    }    

    /**
     * 是否包含内容
     * @param content 内容
     */
    hasContent(content) {
        return this._content === content;
    }

    /**
     * 获取挂载点
     */
    getMount() {
        return this._mount;
    }

    /**
     * 全屏
     * @param options 配置参数
     */
    fullscreen(options: {
        /**
         * 内容
         */
        content,
        /**
         * 标题
         */
        title?: string,
        /**
         * 外层class类
         */
        wrapClass?,
        /**
         * 是否创建标题和页脚进行包装
         */
        isPack?: boolean
    }) {
        if (!options)
            return;
        this._content = options.content;
        this._title = options.title;
        this._wrapClass = options.wrapClass;
        this._isPack = options.isPack;
        this.pack();
        this.moveOverlayContainer();
        this.util.fullscreenHelper.toggle(this._container);
    }

    /**
     * 包装内容
     */
    private pack() {
        if (this._container)
            return;
        if (!this._content)
            return;
        if (this._isPack === false) {
            this._container = this._content;
            this.insertMount();
            return;
        }
        this.createContainer();
        this.insertMount();
        this.createClose();
        this.createHeader();
        this.createBody();
        this.createFooter();
    }

    /**
     * 创建外层容器
     */
    private createContainer() {
        this._container = this.util.dom.createElement("div");
        this.util.dom.addClass(this._container, "x-fullscreen-contaner");
        this.util.dom.addClass(this._container, "ant-modal-content");
        this.util.dom.addClass(this._container, this.getWrapClass(this._wrapClass));
        this.util.dom.insertBefore(this._content, this._container);
    }

    /**
     * 获取外层样式类
     */
    private getWrapClass(wrapClass) {
        if (wrapClass === true || wrapClass === "true")
            return "x-fullscreen";
        return wrapClass;
    }

    /**
     * 插入挂载点到外层容器
     */
    private insertMount() {
        this.util.dom.appendChild(this._container, this._mount);
    }

    /**
     * 创建关闭按钮
     */
    private createClose() {
        this._closeComponent = this.util.component.create(FullContentCloseComponent);
        this._closeComponent.instance.util = this.util;
        this.util.dom.appendChild(this._container, this._closeComponent);
    }

    /**
     * 创建页头
     */
    private createHeader() {
        let header = this.util.dom.createElement("div");
        this.util.dom.addClass(header, "ant-modal-header");
        this.util.dom.setStyle(header, "height", "55px");
        this.createTitle(header);
        this.util.dom.appendChild(this._container, header);
        return header;
    }

    /**
     * 创建标题
     */
    private createTitle(header) {
        if (!this._title)
            return;
        let title = this.util.dom.createElement("div");
        this.util.dom.addClass(title, "ant-modal-title");        
        let value = this.util.dom.createText(this.util.i18n.get(this._title));
        this.util.dom.appendChild(title, value);
        this.util.dom.appendChild(header, title);
    }

    /**
     * 创建主体
     */
    private createBody() {
        let result = this.util.dom.createElement("div");
        this.util.dom.addClass(result, "ant-modal-body");
        this.util.dom.setStyle(result, "height", "calc(100% - 108px)");
        this.util.dom.setStyle(result, "overflow", "auto");
        this.util.dom.appendChild(this._container, result);
        this.util.dom.appendChild(result, this._content);
        return result;
    }

    /**
     * 创建页脚
     */
    private createFooter() {
        this._footerComponent = this.util.component.create(FullContentFooterComponent);
        this._footerComponent.instance.util = this.util;
        this.util.dom.appendChild(this._container, this._footerComponent);
    }

    /**
     * 移动浮层顶层容器
     */
    private moveOverlayContainer() {
        let overlayContainer = this.util.dom.find(".cdk-overlay-container");
        this.util.dom.appendChild(this._mount, overlayContainer);
    }

    /**
     * 退出全屏
     * 
     */
    exit() {
        this.util.fullscreenHelper.toggle(this._container);
    }

    /**
     * 清理
     */
    destroy() {
        this._closeComponent?.destroy();
        this._footerComponent?.destroy();
        this.unpack();
        this._container = null;
        this._content = null;
        this._mount = null;
    }

    /**
     * 解包
     */
    private unpack() {
        if (!this._container)
            return;        
        this.unpackOverlayContainer();
        this.unpackContent();
    }

    /**
     * 解包浮层顶层容器
     */
    private unpackOverlayContainer() {
        if (this.getMount().childNodes.length === 0)
            return;
        let overlayContainer = this.getMount().childNodes[0];
        this.util.dom.appendChild(document.body, overlayContainer);
    }

    /**
     * 解包内容
     */
    private unpackContent() {
        if (this._isPack === false)
            return;
        let body = this.util.dom.find(".ant-modal-body", this._container);
        if (!body || body.childElementCount === 0)
            return;
        let content = body.childNodes[0];
        this.util.dom.insertBefore(this._container, content);
        this.util.dom.removeNode(this._container);
    }
}