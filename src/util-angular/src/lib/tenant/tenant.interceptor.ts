//================== 租户拦截器 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from "./tenant.service";
import { Util } from "../util";

/**
 * 租户拦截器
 */
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
    /**
     * 拦截请求
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const util = Util.create();
        if (!util.config.tenant)
            return next.handle(request);
        if (!util.config.tenant.isEnabled)
            return next.handle(request);
        let tenantId = util.tenant.getTenantId();
        if (!tenantId)
            return next.handle(request);
        let headers = request.headers.append(TenantService.TenantKey, tenantId);
        let clone = request.clone({ headers: headers });
        return next.handle(clone);
    }
}

/**
* 租户拦截器函数
*/
export const tenantInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    const util = Util.create();
    if (!util.config.tenant)
        return next(request);
    if (!util.config.tenant.isEnabled)
        return next(request);
    let tenantId = util.tenant.getTenantId();
    if (!tenantId)
        return next(request);
    let headers = request.headers.append(TenantService.TenantKey, tenantId);
    let clone = request.clone({ headers: headers });
    return next(clone);
}