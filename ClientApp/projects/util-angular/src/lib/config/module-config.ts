//================ 模块配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { Injectable } from '@angular/core';

/**
 * 模块配置
 */
@Injectable()
export class ModuleConfig {
    /**
     * Api前缀,用于设置服务转发路径,范例: order/v1
     */
    apiPrefix?: string;
}