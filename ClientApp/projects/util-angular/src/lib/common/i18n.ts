//============== 国际化操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { NzI18nInterface, NzI18nService, zh_CN, en_US } from 'ng-zorro-antd/i18n';
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
     * 获取NgZorro国际化标识
     * @param lang 语言文化标识
     */
    getNzI18n(lang: string): NzI18nInterface {
        if (!lang)
            return zh_CN;
        lang = this.getSafeLang(lang);
        switch (lang) {
            case 'zh':
            case 'zh-cn':
                return zh_CN;
            case 'en':
            case 'en-us':
                return en_US;
            default:
                return zh_CN;
        }
    }

    /**
     * 获取安全语言文化标识
     */
    private getSafeLang(lang: string) {
        if (!lang)
            return null;
        lang = lang.replace("_", "-");
        return lang.toLowerCase();
    }

    /**
     * 获取当前语言文化标识
     */
    getCurrentLang() {
        return this.nzI18nService.getLocaleId();
    }

    /**
     * 获取本地化文本
     * @param key 键
     * @param args 参数列表
     */
    get(key: string, args?: Record<string, unknown>) {
        return this.alainI18nService.fanyi(key, args);
    }
}