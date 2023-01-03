//============== 验证配置 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================

/**
 * 验证配置
 */
export class ValidationConfig {
    /**
     * 必填项验证消息
     */
    requiredMessage?;
    /**
     * 组必填项验证消息
     */
    groupRequiredMessage?;
    /**
     * 上传必填项验证消息
     */
    uploadRequiredMessage?;
    /**
     * 最小长度验证消息
     */
    minLengthMessage?;
    /**
     * 最大长度验证消息
     */
    maxLengthMessage?;
    /**
     * 最小值验证消息
     */
    minMessage?;
    /**
     * 最大值验证消息
     */
    maxMessage?;
    /**
     * 电子邮件验证消息
     */
    emailMessage?;
    /**
     * 文件类型过滤消息
     */
    fileTypeMessage?;
    /**
     * 文件大小过滤消息
     */
    fileSizeMessage?;
    /**
     * 文件数量过滤消息
     */
    fileLimitMessage?;
}