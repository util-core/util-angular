//============== 文件信息 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================

/**
 * 文件信息
 */
export class FileInfo {
    /**
     * 文件标识
     */
    id;
    /**
     * 文件连接标识
     */
    connectionId;
    /**
     * 文件名
     */
    name;    
    /**
     * 扩展名
     */
    extension;
    /**
     * 文件大小
     */
    size:number;
    /**
     * 文件路径
     */
    path;
    /**
     * 存储空间
     */
    bucket;
    /**
     * 文件地址
     */
    url;
    /**
     * 缩略图文件地址
     */
    thumbUrl;
}