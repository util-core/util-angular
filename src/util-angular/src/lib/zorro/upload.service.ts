//============== 上传服务 ============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { Injectable } from '@angular/core';
import { FileInfo } from '../core/file-info';
import { NzUploadFile } from 'ng-zorro-antd/upload';

/**
 * 上传服务
 */
export abstract class UploadServiceBase {
    /**
     * 将模型数据项转换为上传文件
     * @param modelItem 模型数据项
     */
    abstract toUploadFile(modelItem): NzUploadFile;
}

/**
 * 上传服务
 */
@Injectable()
export class UploadService extends UploadServiceBase {
    /**
     * 将模型数据项转换为上传文件
     * @param item 模型数据项
     */
    toUploadFile(item: FileInfo): NzUploadFile {
        return {
            uid: item.id,
            name: item.name,
            size: item.size,
            type: item.extension,
            url: item.url,
            thumbUrl: item.thumbUrl
        };
    }
}