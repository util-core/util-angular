//================ 模块应用配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//============================================================
import { InjectionToken } from '@angular/core';
import { AppConfig } from './app-config';

/**
 * 模块应用配置
 */
export const ModuleCofig = new InjectionToken<AppConfig>('AppConfig');