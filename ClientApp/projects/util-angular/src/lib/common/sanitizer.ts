//============== 清理操作 ============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { SecurityContext } from "@angular/core";
import { DomSanitizer, SafeHtml, SafeValue, SafeUrl } from "@angular/platform-browser";
import { Util } from "../util";

/**
 * 清理操作
 */
export class Sanitizer {
    /**
     * Dom清理器
     */
    private sanitizer: DomSanitizer;

    /**
     * 初始化清理操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.sanitizer = this.util.ioc.get(DomSanitizer);
    }

    /**
     * 获取受信任的html
     * @param value html
     */
    trustHtml(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }

    /**
     * 获取受信任的url
     * @param value url
     */
    trustUrl(value: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(value);
    }

    /**
     * 清理html
     * @param value 原始html
     */
    sanitizeHtml(value: string | SafeValue): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, value);
    }

    /**
     * 清理url
     * @param value 原始url
     */
    sanitizeUrl(value: string | SafeValue): string {
        return this.sanitizer.sanitize(SecurityContext.URL, value);
    }
}