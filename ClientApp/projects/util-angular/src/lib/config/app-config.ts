//================ 应用配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable } from '@angular/core';
import { assign } from "../common/helper";
import { TableConfig } from "./table-config";
import { TinymceConfig } from "./tinymce-config";
import { LoadingConfig } from "./loading-config";
import { DefaultTableConfig } from "./default-table-config";
import { DefaultTinymceConfig } from "./default-tinymce-config";

/**
 * 应用配置
 */
@Injectable()
export class AppConfig {
    /**
     * Api端点地址,范例: https://api.a.com
     */
    apiEndpoint?: string;
    /**
     * 分页大小
     */
    pageSize?:number;
    /**
     * 表格配置
     */
    table?: TableConfig;
    /**
     * Tinymce富文本编辑器配置
     */
    tinymce?: TinymceConfig
    /**
     * 加载状态配置
     */
    loading?: LoadingConfig
}

/**
 * 初始化应用配置
 * @param config 应用配置
 */
export function initAppConfig(config: AppConfig) {
    if (!config)
        return;
    config.table = assign(DefaultTableConfig, config.table);
    config.tinymce = assign(DefaultTinymceConfig, config.tinymce);
}