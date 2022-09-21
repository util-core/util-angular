//================ 应用配置 ==============================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable } from '@angular/core';
import { TextConfig } from "./text-config";
import { ValidationConfig } from "./validation-config";
import { TableConfig } from "./table-config";
import { DefaultTextConfig } from "./default-text-config";
import { DefaultValidationConfig } from "./default-validation-config";
import { DefaultTableConfig } from "./default-table-config";

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
    pageSize?: number;
    /**
     * 文本配置
     */
    text?: TextConfig;
    /**
     * 验证配置
     */
    validation?: ValidationConfig;
    /**
     * 表格配置
     */
    table?: TableConfig;
}

/**
 * 初始化应用配置
 * @param config 应用配置
 */
export function initAppConfig(config: AppConfig) {
    if (!config)
        config = new AppConfig();
    config.pageSize = config.pageSize || 10;
    config.text = config.text || DefaultTextConfig;
    config.validation = config.validation || DefaultValidationConfig;
    config.table = config.table || DefaultTableConfig;
}