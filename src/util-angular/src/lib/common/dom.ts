//============== Dom操作 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { Renderer2, RendererStyleFlags2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Util } from "../util";

/**
 * Dom操作
 */
export class Dom {
    /**
     * dom
     */
    private _document: Document;
    /**
     * 渲染器
     */
    private _renderer: Renderer2;

    /**
     * 初始化Dom操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this._document = util.ioc.get(DOCUMENT);
        this._renderer = util.ioc.get(Renderer2);
    }

    /**
     * 设置样式
     * @param element 元素
     * @param name 样式名称
     * @param value 样式值
     * @param flags 修饰符
     */
    setStyle(element, name: string, value, flags?: RendererStyleFlags2) {
        if (!element)
            return;
        this._renderer.setStyle(this.getNativeElement(element), name, value, flags);
    }

    /**
     * 添加样式类
     * @param element 元素
     * @param name 样式类名
     */
    addClass(element, name: string) {
        if (!element)
            return;
        if (!name)
            return;
        this._renderer.addClass(this.getNativeElement(element), name);
    }

    /**
     * 移除样式类
     * @param element 元素
     * @param name 样式类名
     */
    removeClass(element, name: string) {
        if (!element)
            return;
        this._renderer.removeClass(this.getNativeElement(element), name);
    }

    /**
     * 设置属性
     * @param element 元素
     * @param name 属性名
     * @param value 属性值
     * @param namespace 命名空间
     */
    setAttribute(element, name: string, value?: string, namespace?: string) {
        if (!element)
            return;
        if (!value)
            value = "";
        this._renderer.setAttribute(this.getNativeElement(element), name, value, namespace);
    }

    /**
     * 获取元素
     */
    getNativeElement(element): HTMLElement {
        if (!element)
            return null;
        if (element.nativeElement)
            return element.nativeElement;
        if (element.getNativeElement)
            return element.getNativeElement();
        if (element.location && element.location.nativeElement)
            return element.location.nativeElement;
        if (element.elementRef && element.elementRef.nativeElement)
            return element.elementRef.nativeElement;
        if (element.componentRef && element.componentRef.location && element.componentRef.location.nativeElement)
            return element.componentRef.location.nativeElement;
        return element;
    }

    /**
     * 获取父节点
     * @param node 节点
     */
    getParentNode(node) {
        if (!node)
            return null;
        let element = this.getNativeElement(node);
        return this._renderer.parentNode(element);
    }

    /**
     * 向上查找指定父节点
     * @param node 节点
     * @param selectors 选择器
     */
    getParent(node, selectors: string) {
        if (!node)
            return null;
        let parent: HTMLElement = this.getParentNode(node);
        if (!parent)
            return null;
        if (!selectors)
            return parent;
        let result = parent.querySelector(selectors);
        if (result)
            return result;
        return this.getParent(parent, selectors);
    }

    /**
     * 获取后一个相邻节点
     * @param node 节点
     */
    getNextNode(node) {
        let element = this.getNativeElement(node);
        return this._renderer.nextSibling(element);
    }

    /**
     * 是否存在指定元素
     * @param selectors 选择器
     * @param parentNode 在指定父节点查找
     */
    exists(selectors: string, parentNode?) {
        try {
            let node = this.find(selectors, parentNode);
            return !!node;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * 查找单个元素
     * @param selectors 选择器
     * @param parentNode 在指定父节点查找
     */
    find(selectors: string, parentNode?) {
        if (!selectors)
            return null;
        if (!parentNode)
            return this._document.querySelector(selectors);
        let element = this.getNativeElement(parentNode);
        if (!element)
            return null;
        return element.querySelector(selectors);
    }

    /**
     * 查找全部元素
     * @param selectors 选择器
     * @param parentNode 在指定父节点查找
     */
    findAll(selectors: string, parentNode?) {
        if (!selectors)
            return null;
        if (!parentNode)
            return this._document.querySelectorAll(selectors);
        let element = this.getNativeElement(parentNode);
        if (!element)
            return null;
        return element.querySelectorAll(selectors);
    }

    /**
     * 创建元素
     * @param parent name 元素名,范例: div
     * @param namespace 命名空间
     */
    createElement(name: string, namespace?: string) {
        return this._renderer.createElement(name, namespace);
    }

    /**
     * 创建文本
     * @param parent value 值
     */
    createText(value: string) {
        return this._renderer.createText(value);
    }

    /**
     * 添加子节点
     * @param parent 父节点
     * @param newChild 子节点
     */
    appendChild(parent, newChild) {
        let parentNode = this.getNativeElement(parent);
        if (!this.isValidElement(parentNode))
            return;
        let childNode = this.getNativeElement(newChild);
        if (!childNode)
            return;
        return this._renderer.appendChild(parentNode, childNode);
    }

    /**
     * 是否有效元素
     */
    isValidElement(element) {
        if (!element)
            return false;
        return element.nodeType === 1;
    }

    /**
     * 在节点前插入新节点
     * @param node 节点
     * @param newNode 新节点
     */
    insertBefore(node, newNode) {
        let element = this.getNativeElement(node);
        if (!element)
            return;
        let newElement = this.getNativeElement(newNode);
        if (!newElement)
            return;
        let parentNode = this.getParentNode(element);
        if (!this.isValidElement(parentNode))
            return;
        return this._renderer.insertBefore(parentNode, newElement, element);
    }

    /**
     * 在节点后插入新节点
     * @param node 节点
     * @param newNode 新节点
     */
    insertAfter(node, newNode) {
        let element = this.getNativeElement(node);
        if (!element)
            return;
        let newElement = this.getNativeElement(newNode);
        if (!newElement)
            return;
        let parentNode = this.getParentNode(element);
        if (!this.isValidElement(parentNode))
            return;
        let nextNode = this.getNextNode(node);
        if (nextNode)
            return this._renderer.insertBefore(parentNode, newElement, nextNode);
        return this._renderer.appendChild(parentNode, newElement);
    }

    /**
     * 移除节点
     * @param node 节点
     * @param isHostElement 是否移除宿主元素
     */
    removeNode(node, isHostElement?: boolean) {
        let element = this.getNativeElement(node);
        if (!element)
            return;
        let parentNode = this.getParentNode(element);
        if (!this.isValidElement(parentNode))
            return;
        this._renderer.removeChild(parentNode, element, isHostElement);
    }

    /**
     * 移除子节点
     * @param selectors 选择器
     * @param parentNode 父节点
     * @param isHostElement 是否移除宿主元素
     */
    removeChild(selectors: string, parentNode?, isHostElement?: boolean) {
        if (!selectors)
            return;
        let parentElement = this.getNativeElement(parentNode);
        if (this.isValidElement(parentElement)) {
            let element = this.find(selectors, parentElement);
            if (!element)
                return;
            this._renderer.removeChild(parentElement, element, isHostElement);
        }
        let element = this.find(selectors);
        if (!element)
            return;
        this._renderer.removeChild(this._document, element, isHostElement);
    }

    /**
     * 移除子节点集合
     * @param selectors 选择器
     * @param parentNode 父节点
     * @param isHostElement 是否移除宿主元素
     */
    removeChildren(selectors: string, parentNode?, isHostElement?: boolean) {
        if (!selectors)
            return;
        let parentElement = this.getNativeElement(parentNode);
        if (this.isValidElement(parentElement)) {
            let elements = this.findAll(selectors, parentElement);
            if (!elements || elements.length === 0)
                return;
            elements.forEach(element => {
                if (!element)
                    return;
                this._renderer.removeChild(parentElement, element, isHostElement);
            });
        }
        let elements = this.findAll(selectors);
        if (!elements || elements.length === 0)
            return;
        elements.forEach(element => {
            if (!element)
                return;
            this._renderer.removeChild(this._document, element, isHostElement);
        });
    }
}