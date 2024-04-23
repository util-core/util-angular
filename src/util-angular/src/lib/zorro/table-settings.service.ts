//============== 表格设置服务 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { Injectable } from '@angular/core';
import { Util } from '../util';
import { TableInfo } from '../core/table-info';

/**
 * 表格设置服务
 */
export abstract class TableSettingsServiceBase {
    /**
     * 获取表格配置
     * @param key 存储键
     */
    abstract get(key: string): TableInfo;
    /**
     * 保存表格配置
     * @param key 存储键
     * @param info 表格配置
     */
    abstract save(key: string, info: TableInfo): Promise<void>;
}

/**
 * 表格设置服务
 */
@Injectable()
export class TableSettingsService extends TableSettingsServiceBase {
    /**
     * 操作入口
     */
    protected util: Util;

    /**
     * 初始化
     */
    constructor() {
        super();
        this.util = Util.create();
    }

    /**
     * 获取表格配置
     * @param key 存储键
     */
    get(key: string): TableInfo {
        return this.util.storage.getLocalItem<TableInfo>(this.getKey(key));
    }

    /**
     * 获取存储标识
     */
    protected getKey(key) {
        return `${key}${this.getUserId()}`;
    }

    /**
     * 获取用户标识
     */
    protected getUserId() {
        let userId = this.util.session.userId;
        return userId ? `_${userId}`: '';
    }

    /**
     * 保存表格配置
     * @param key 存储键
     * @param info 表格配置
     */
    async save(key: string, info: TableInfo) {
        key = this.getKey(key);
        this.util.storage.setLocalItem(key, info, 36000000);
    }
}