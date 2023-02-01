//============== 国际化操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { ALAIN_I18N_TOKEN, AlainI18NService } from '@delon/theme';
import { Util } from "../util";

/**
 * 国际化操作
 */
export class I18n {
    /**
     * NgZorro国际化服务
     */
    private nzI18nService: NzI18nService;
    /**
     * NgAlain国际化服务
     */
    private alainI18nService: AlainI18NService

    /**
     * 初始化国际化操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.nzI18nService = this.util.ioc.get(NzI18nService);
        this.alainI18nService = this.util.ioc.get(ALAIN_I18N_TOKEN);
    }

    /**
     * 获取当前语言文化标识
     */
    getCurrentLang() {
        let lang = this.nzI18nService.getLocaleId();
        if (lang.indexOf("-") <= 0) {
            switch (lang) {
                case "en":
                    return "en-US";
                case "zh":
                    return "zh-CN";
            }
            return lang;
        }
        let list = lang.split("-");
        return `${list[0]}-${list[1].toUpperCase()}`;
    }

    /**
     * 获取本地化文本
     * @param key 键
     * @param args 参数列表
     */
    get(key: string, args?: Record<string, unknown>) {
        if (!key)
            return key;
        if (!this.alainI18nService)
            return key;
        try {
            return this.alainI18nService.fanyi(key, args);
        }
        catch {
            return key;
        }
    }

    /**
     * 设置.AspNetCore.Culture Cookie
     */
    setAspNetCultureCookie() {
        this.util.cookie.set(".AspNetCore.Culture", `c=${this.getCurrentLang()}|uic=${this.getCurrentLang()}`, { expires: 360000 });
    }
}