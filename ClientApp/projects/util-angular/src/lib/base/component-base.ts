//============== 组件基类=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Component } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
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
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        this.util = new Util(injector);
    }

    /**
     * 创建上下文菜单
     * @param $event 鼠标事件
     * @param menu 下拉菜单组件
     */
    createContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent) {
        this.util.contextMenu.create($event, menu);
    }
}