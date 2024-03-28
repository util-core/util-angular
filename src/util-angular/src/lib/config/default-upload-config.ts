//================ DefaultUploadConfig ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===================================================================
import { UploadConfig } from "./upload-config";

/**
 * 默认上传配置
 */
export const DefaultUploadConfig: UploadConfig = {
    /**
     * 文件大小验证消息
     */
    sizeLimitMessage: "文件 {0} 过大，单个文件不能超过 {1} KB",
    /**
     * 文件数量验证消息
     */
    fileLimitMessage: "您选择的文件过多，单次上传文件最多不能超过 {0} 个",
    /**
     * 文件类型验证消息
     */
    typeLimitMessage: "{0} 的格式不正确,不支持该文件扩展名"
}