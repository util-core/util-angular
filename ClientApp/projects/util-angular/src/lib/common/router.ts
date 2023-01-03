//============== 路由操作=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Router as AngularRouter, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { Ioc } from '../common/ioc';

/**
 * 路由操作
 */
export class Router {
    /**
     * 初始化路由操作
     * @param ioc Ioc操作
     */
    constructor(private ioc: Ioc) {
    }

    /**
     * 返回上一次视图
     */
    back(): void {
        let location: Location = this.ioc.get(Location);
        location.back();
    }

    /**
     * 导航
     * @param commands 导航参数，范例: ['team', 33, 'user', 11]，表示 /team/33/user/11
     * @param extras 附加参数，范例: {queryParams: {id:'1'}}，表示 ?id=1
     */
    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        let router = this.ioc.get(AngularRouter);
        return router.navigate(commands, extras);
    }

    /**
     * 导航
     * @param commands 导航参数，范例: ['team', 33, 'user', 11]，表示 /team/33/user/11
     * @param queryParams 查询参数，范例: {id:'1'}，表示 ?id=1
     */
    navigateByQuery(commands: any[], queryParams): Promise<boolean> {
        return this.navigate(commands, { queryParams: queryParams });
    }

    /**
     * 导航
     * @param url 地址
     * @param extras 附加参数，范例: {queryParams: {id:'1'}}，表示 ?id=1
     */
    navigateByUrl(url: string, extras?: NavigationExtras): Promise<boolean> {
        let router = this.ioc.get(AngularRouter);
        return router.navigateByUrl(url, extras);
    }

    /**
     * 获取路径参数值,从路由快照中获取参数
     * @param paramName 参数名
     */
    getParam(paramName: string): string | null {
        let route = this.ioc.get(ActivatedRoute);
        return route.snapshot.paramMap.get(paramName);
    }

    /**
     * 获取查询参数值,从路由快照中的查询字符串获取参数
     * @param paramName 参数名
     */
    getQueryParam(paramName: string): string | null {
        let route = this.ioc.get(ActivatedRoute);
        return route.snapshot.queryParamMap.get(paramName);
    }
}