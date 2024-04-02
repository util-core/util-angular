//============== 服务基类=========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, inject } from '@angular/core';
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
    constructor(injector?: Injector) {
        injector = injector || inject(Injector);
        this.util = new Util(injector);
    }
}