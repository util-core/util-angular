//============== 组件基类=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Component } from '@angular/core';
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
}