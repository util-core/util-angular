//============== 服务提供器 =================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===========================================================
import { Provider } from '@angular/core';
import { UploadServiceBase, UploadService } from "./zorro/upload.service";
import { TableSettingsServiceBase, TableSettingsService } from "./zorro/table-settings.service";

/**
 * 表格设置服务提供器
 */
export function provideTableSettings(): Provider {
    return { provide: TableSettingsServiceBase, useClass: TableSettingsService };
}

/**
 * 上传服务提供器
 */
export function provideUpload(): Provider {
    return { provide: UploadServiceBase, useClass: UploadService };
}

/**
 * Util服务提供器
 */
export function provideUtil(): Provider[] {
    return [provideTableSettings(), provideUpload()];
}