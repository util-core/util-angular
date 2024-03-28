//================ UploadConfig ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//============================================================

/**
 * 上传配置
 */
export class UploadConfig {
    /**
     * 文件上传地址
     */
    url?: string;
    /**
     * 文件大小验证消息
     */
    sizeLimitMessage?: string;
    /**
     * 文件数量验证消息
     */
    fileLimitMessage?: string;
    /**
     * 文件类型验证消息
     */
    typeLimitMessage?: string;
}