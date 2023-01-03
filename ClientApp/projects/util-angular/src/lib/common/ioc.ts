//============== Ioc操作==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Type, InjectionToken, InjectFlags } from '@angular/core';

/**
 * Ioc操作
 */
export class Ioc {
    /**
     * 初始化Ioc操作
     * @param injector 全局注入器
     * @param componentInjector 组件注入器
     */
    constructor(private injector: Injector, private componentInjector: Injector) {
    }

    /**
     * 获取实例
     * @param token 实例标记，一般为类或接口名称,范例：util.ioc.get(Http)
     */
    get<T>(token: Type<T> | InjectionToken<T>): T;
    get(token: any): any;
    get(token: any): any {
        if (this.componentInjector) {
            let result = this.componentInjector.get(token, null, InjectFlags.Optional);
            if (result != null)
                return result;
        }
        if (this.injector)
            return this.injector.get(token, null, InjectFlags.Optional);
        return null;
    }
}