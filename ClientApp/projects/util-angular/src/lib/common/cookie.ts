//============== Cookie操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { CookieService, CookieOptions } from '@delon/util';
import { Util } from "../util";

/**
 * Cookie操作
 */
export class Cookie {
    /**
     * Cookie服务
     */
    private cookieService: CookieService;

    /**
     * 初始化Cookie操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.cookieService = this.util.ioc.get(CookieService);
    }

    /**
     * 获取全部cookie
     */
    getAll() {
        return this.cookieService.getAll();
    }

    /**
     * 获取值
     * @param key 键
     */
    get(key: string) {
        return this.cookieService.get(key);
    }

    /**
     * 设置值
     * @param key 键
     * @param value 值
     * @param options 配置项
     */
    set(key: string, value: string, options?: CookieOptions) {
        return this.cookieService.put(key, value, options);
    }
}