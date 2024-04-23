//============== 组件基类=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Component } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Util } from "../util";

/**
 * 组件基类
 */
@Component({
    template: ''
})
export abstract class ComponentBase {
    /**
     * 公共操作
     */
    protected util: Util;
    /**
     * 是否展开
     */
    expand: boolean;

    /**
     * 初始化组件
     */
    constructor() {
        this.util = Util.create();
        this.expand = false;
    }

    /**
     * 创建上下文菜单
     * @param $event 鼠标事件
     * @param menu 下拉菜单组件
     */
    createContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent) {
        $event.stopPropagation();
        return this.util.contextMenu.create($event, menu);
    }

    /**
     * 是否PC
     */
    get isPc() {
        return this.util.responsive.isPc();
    }

    /**
     * 是否平板
     */
    get isPad() {
        return this.util.responsive.isPad();
    }

    /**
     * 是否手机
     */
    get isPhone() {
        return this.util.responsive.isPhone();
    }

    /**
     * 是否极宽尺寸, ≥1600px
     */
    get isXxl() {
        return this.util.responsive.isXxl();
    }
}