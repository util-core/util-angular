//============== NgZorro验证扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Input, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Util } from "../util";
import { AppConfig, initAppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro验证扩展指令
 */
@Directive({
    selector: '[x-validation-extend]',
    exportAs: 'xValidationExtend'
})
export class ValidationExtendDirective {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 显示名称
     */
    @Input() displayName: string;
    /**
     * 必填项验证消息
     */
    @Input() requiredMessage: string;
    /**
     * 最小长度
     */
    @Input() minlength: number;
    /**
     * 最小长度验证消息
     */
    @Input() minLengthMessage: string;
    /**
     * 最大长度
     */
    @Input() maxlength: number;
    /**
     * 最小值
     */
    @Input() min: number;
    /**
     * 最小值验证消息
     */
    @Input() minMessage: string;
    /**
     * 最大值
     */
    @Input() max: number;
    /**
     * 最大值验证消息
     */
    @Input() maxMessage: string;
    /**
     * 电子邮件验证消息
     */
    @Input() emailMessage: string;
    /**
     * 正则表达式验证消息
     */
    @Input() patternMessage: string;
    /**
     * 是否无效手机号
     */
    @Input() isInvalidPhone: boolean;
    /**
     * 是否无效身份证
     */
    @Input() isInvalidIdCard: boolean;

    /**
     * 初始化验证扩展指令
     * @param controlModel 组件模型
     * @param config 应用配置
     */
    constructor(@Optional() protected controlModel: NgModel, @Optional() public config: AppConfig) {
        this.initAppConfig();
        this.util = new Util(null, config);
    }

    /**
     * 初始化应用配置
     */
    private initAppConfig() {
        if (!this.config)
            this.config = new AppConfig();
        initAppConfig(this.config);
    }

    /**
     * 获取错误消息
     */
    getErrorMessage() {
        if (!this.controlModel)
            return "";
        if (this.controlModel.hasError('required'))
            return this.getRequiredMessage();
        if (this.controlModel.hasError('minlength'))
            return this.getMinLengthMessage();
        if (this.controlModel.hasError('min'))
            return this.getMinMessage();
        if (this.controlModel.hasError('max'))
            return this.getMaxMessage();
        if (this.controlModel.hasError('email'))
            return this.getEmailMessage();
        if (this.isInvalidPhone)
            return this.getPhoneMessage();
        if (this.isInvalidIdCard)
            return this.getIdCardMessage();
        if (this.controlModel.hasError('pattern'))
            return this.getPatternMessage();
        return "";
    }

    /**
     * 获取必填项验证消息
     */
    private getRequiredMessage() {
        return this.getI18nMessage(I18nKeys.requiredMessage, this.requiredMessage);
    }

    /**
     * 获取多语言验证消息
     */
    private getI18nMessage(defaultMessage, message,value?) {
        let result = defaultMessage;
        if (message)
            result = message;        
        result = this.util.i18n.get(result);
        return this.replace(result, value);
    }

    /**
     * 替换{0}为显示名称,{1}为值
     */
    private replace(message, value?) {
        let result = message.replace(/\{0\}/, this.getDisplayName());
        if (this.util.helper.isEmpty(value))
            return result;
        return result.replace(/\{1\}/, String(value));
    }

    /**
     * 获取显示名称
     */
    private getDisplayName() {
        return this.util.i18n.get(this.displayName);
    }

    /**
     * 获取最小长度验证消息
     */
    private getMinLengthMessage() {
        return this.getI18nMessage(I18nKeys.minLengthMessage, this.minLengthMessage, this.minlength);
    }

    /**
     * 获取最小值验证消息
     */
    private getMinMessage() {
        return this.getI18nMessage(I18nKeys.minMessage, this.minMessage, this.min);
    }

    /**
     * 获取最大值验证消息
     */
    private getMaxMessage() {
        return this.getI18nMessage(I18nKeys.maxMessage, this.maxMessage, this.max);
    }

    /**
     * 获取电子邮件验证消息
     */
    private getEmailMessage() {
        return this.getI18nMessage(I18nKeys.emailMessage, this.emailMessage);
    }

    /**
     * 获取手机号验证消息
     */
    private getPhoneMessage() {
        return this.getI18nMessage(I18nKeys.phoneMessage, this.patternMessage);
    }

    /**
     * 获取身份证验证消息
     */
    private getIdCardMessage() {
        return this.getI18nMessage(I18nKeys.idCardMessage, this.patternMessage);
    }

    /**
     * 获取正则表达式验证消息
     */
    private getPatternMessage() {
        return this.getI18nMessage(this.patternMessage, this.patternMessage);
    }
}

