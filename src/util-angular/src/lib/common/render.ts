//============== 渲染器操作 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Util } from "../util";

/**
 * 渲染器操作
 */
export class Render {
    /**
     * 渲染器服务
     */
    private renderer: Renderer2;

    /**
     * 初始化渲染器操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.renderer = this.util.ioc.get(Renderer2);
    }

    /**
     * 设置样式
     * @param element 元素
     * @param name 样式名称
     * @param value 样式值
     */
    setStyle(element, name, value, flags?: RendererStyleFlags2) {
        if (!element)
            return;
        let nativeElement = element;
        if (element.nativeElement)
            nativeElement = element.nativeElement;
        this.renderer.setStyle(nativeElement, name, value, flags);
    }
}