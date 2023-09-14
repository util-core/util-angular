//============== 浏览器本地存储操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { Util } from "../util";

/**
 * 浏览器本地存储操作
 */
export class Storage {
    /**
     * 初始化浏览器本地存储操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
    }

    /**
     * 设置localStorage项
     * @param key 键
     * @param value 值
     * @param expires 过期时间,单位:秒,默认值: 360000
     */
    setLocalItem(key: string, value, expires: number = 360000) {
        if (this.util.helper.isEmpty(key))
            return;
        this.removeLocalItem(key);
        let content = new StorageWrapper(value, Date.now(), expires*1000);
        let json = this.util.helper.toJson(content);
        localStorage.setItem(key, json);
    }

    /**
     * 获取localStorage项
     * @param key 键
     */
    getLocalItem<T>(key: string): T {
        if (this.util.helper.isEmpty(key))
            return null;
        let json = localStorage.getItem(key);
        if (this.util.helper.isEmpty(json))
            return null;
        let content = this.util.helper.toObjectFromJson<StorageWrapper>(json);
        if (!content)
            return null;
        if (Date.now() - content.time > content.expires) {
            this.removeLocalItem(key);
            return null;
        }
        return <T>content.data;
    }

    /**
     * 移除localStorage项
     * @param key 键
     */
    removeLocalItem(key: string) {
        localStorage.removeItem(key);
    }

    /**
     * 清空localStorage项
     */
    clearLocalItems() {
        localStorage.clear();
    }

    /**
     * 设置sessionStorage项
     * @param key 键
     * @param value 值
     * @param expires 过期时间,单位:秒,默认值: 360000
     */
    setSessionItem(key: string, value, expires: number = 360000) {
        if (this.util.helper.isEmpty(key))
            return;
        this.removeSessionItem(key);
        let content = new StorageWrapper(value, Date.now(), expires * 1000);
        let json = this.util.helper.toJson(content);
        sessionStorage.setItem(key, json);
    }

    /**
     * 获取sessionStorage项
     * @param key 键
     */
    getSessionItem<T>(key: string): T{
        if (this.util.helper.isEmpty(key))
            return null;
        let json = sessionStorage.getItem(key);
        if (this.util.helper.isEmpty(json))
            return null;
        let content = this.util.helper.toObjectFromJson<StorageWrapper>(json);
        if (!content)
            return null;
        if (Date.now() - content.time > content.expires) {
            this.removeSessionItem(key);
            return null;
        }
        return <T>content.data;
    }

    /**
     * 移除sessionStorage项
     * @param key 键
     */
    removeSessionItem(key: string) {
        sessionStorage.removeItem(key);
    }

    /**
     * 清空sessionStorage项
     */
    clearSessionItems() {
        sessionStorage.clear();
    }

    /**
     * 获取localStorage全部项
     */
    getLocalItems(): Map<string, any> {
        let result = new Map<string, any>();
        for (var i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = this.getLocalItem<any>(key);
            result.set(key, value);
        }
        return result;
    }

    /**
     * 获取sessionStorage全部项
     */
    getSessionItems(): Map<string, any> {
        let result = new Map<string, any>();
        for (var i = 0; i < sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            let value = this.getSessionItem<any>(key);
            result.set(key, value);
        }
        return result;
    }
}

/**
 * 存储包装器
 */
class StorageWrapper {
    /**
     * 初始化存储包装器
     * @param data 数据
     * @param time 存储时间
     * @param expires 过期间隔
     */
    constructor(public data, public time: number, public expires: number) {
    }
}