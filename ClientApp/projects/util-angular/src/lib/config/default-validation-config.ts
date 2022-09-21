//============== 默认验证配置 =========================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//====================================================
import { ValidationConfig } from "./validation-config";

/**
 * 默认验证配置
 */
export const DefaultValidationConfig: ValidationConfig = {
    requiredMessage: "{0}必须填写",
    groupRequiredMessage: "该项必须勾选",
    uploadRequiredMessage: "请选择文件",
    minLengthMessage: "{0}最小长度为 {1} 位",
    minMessage: "{0}最小值为 {1}",
    maxMessage: "{0}最大值为 {1}",
    emailMessage: "请输入有效的电子邮件",
    fileTypeMessage: "{0} 文件格式不正确",
    fileSizeMessage: "{0} 文件过大，单个文件不能超过 {1} KB",
    fileLimitMessage: "您选择的文件过多，单次上传文件最多不能超过 {0} 个"
};