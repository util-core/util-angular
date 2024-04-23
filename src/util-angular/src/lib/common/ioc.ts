//============== Ioc操作==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Type, InjectionToken } from '@angular/core';

/**
 * Ioc操作
 */
export class Ioc {
    /**
     * 初始化Ioc操作
     * @param injector 注入器
     */
    constructor(public injector: Injector) {
    }

    /**
     * 获取实例
     * @param token 注入令牌
     */
    get<T>(token: Type<T> | InjectionToken<T>): T;
    get(token: any): any;
    get(token: any): any {
        if (this.injector)
            return this.injector.get(token, null, { optional: true });
        return null;
    }
}