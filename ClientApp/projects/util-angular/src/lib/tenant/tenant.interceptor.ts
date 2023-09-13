//================== 租户拦截器 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable, Optional } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from "../config/app-config";
import { TenantService } from "./tenant.service";
import { Util } from "../util";

/**
 * 租户拦截器
 */
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
    /**
     * 初始化租户拦截器
     * @param config 应用配置
     */
    constructor(@Optional() private config: AppConfig) {
    }

    /**
     * 拦截请求
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.config)
            return next.handle(request);
        if (!this.config.tenant)
            return next.handle(request);
        if (!this.config.tenant.isEnabled)
            return next.handle(request);
        let util = new Util();
        let tenantId = util.tenant.getTenantId();
        if (!tenantId)
            return next.handle(request);
        let headers = request.headers.append(TenantService.TenantKey, tenantId);
        let clone = request.clone({ headers: headers });
        return next.handle(clone);
    }
}
