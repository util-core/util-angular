//============== 组件操作==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================
import { Injector, Type, NgModuleRef, EnvironmentInjector, ViewContainerRef } from '@angular/core';
import { Util } from '../util';

/**
 * 组件操作
 */
export class Component {
    /**
     * 初始化组件操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 创建组件
     * @param componentType 组件类型
     * @param options 配置
     */
    create<C>(componentType: Type<C>, options?: {
        index?: number;
        injector?: Injector;
        ngModuleRef?: NgModuleRef<unknown>;
        environmentInjector?: EnvironmentInjector | NgModuleRef<unknown>;
        projectableNodes?: Node[][];
    }) {
        let viewContainerRef: ViewContainerRef = this.util.ioc.get(ViewContainerRef);
        return viewContainerRef.createComponent(componentType, options);
    }
}