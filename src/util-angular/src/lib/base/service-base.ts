//============== 服务基类=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector } from '@angular/core';
import { Util } from "../util";

/**
 * 服务基类
 */
export abstract class ServiceBase {
    /**
     * 公共操作
     */
    protected util: Util;

    /**
     * 初始化服务
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        this.util = new Util(injector);
    }
}