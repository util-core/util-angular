//================== 多语言拦截器 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable, Optional, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Util } from "../util";

/**
 * 多语言拦截器
 */
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
    /**
     * 初始化多语言拦截器
     * @param injector 注入器
     */
    constructor(@Optional() private injector: Injector) {
    }

    /**
     * 拦截请求
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let util = new Util(this.injector);
        let culture = util.i18n.getCurrentLang();
        if (util.helper.isEmpty(culture))
            return next.handle(request);
        let headers = request.headers.append("Content-Language", culture);
        let clone = request.clone({ headers: headers });
        return next.handle(clone);
    }
}
