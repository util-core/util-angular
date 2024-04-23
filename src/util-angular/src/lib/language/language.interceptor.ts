//================== 多语言拦截器 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Util } from "../util";

/**
 * 多语言拦截器
 */
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
    /**
     * 拦截请求
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let util = Util.create();
        let culture = util.i18n.getCurrentLang();
        if (util.helper.isEmpty(culture))
            return next.handle(request);
        let headers = request.headers.append("Content-Language", culture);
        let clone = request.clone({ headers: headers });
        return next.handle(clone);
    }
}

/**
 * 多语言拦截器函数
 */
export const languageInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    let util = Util.create();
    let culture = util.i18n.getCurrentLang();    
    if (util.helper.isEmpty(culture))
        return next(request);
    let headers = request.headers.append("Content-Language", culture);
    let clone = request.clone({ headers: headers });
    return next(clone);
}