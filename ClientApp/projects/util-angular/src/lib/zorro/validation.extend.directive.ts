//============== NgZorro验证扩展指令 ====================
//Copyright 2023 何镇汐
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
        this.util = new Util(null, this.config);
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
        let result = this.getDefaultMessage(I18nKeys.requiredMessage);
        if (this.requiredMessage)
            result = this.requiredMessage;
        return this.replace(result);
    }

    /**
     * 获取默认验证消息
     */
    private getDefaultMessage(key) {
        return this.util.i18n.get(key);
    }

    /**
     * 替换{0}为显示名称,{1}为值
     */
    private replace(message, value?) {
        message = message.replace(/\{0\}/, this.getDisplayName());
        return message.replace(/\{1\}/, String(value));
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
        let result = this.getDefaultMessage(I18nKeys.minLengthMessage);
        if (this.minLengthMessage)
            result = this.minLengthMessage;
        return this.replace(result, this.minlength);
    }

    /**
     * 获取最小值验证消息
     */
    private getMinMessage() {
        let result = this.getDefaultMessage(I18nKeys.minMessage);
        if (this.minMessage)
            result = this.minMessage;
        return this.replace(result, this.min);
    }

    /**
     * 获取最大值验证消息
     */
    private getMaxMessage() {
        let result = this.getDefaultMessage(I18nKeys.maxMessage);
        if (this.maxMessage)
            result = this.maxMessage;
        return this.replace(result, this.max);
    }

    /**
     * 获取电子邮件验证消息
     */
    private getEmailMessage() {
        let result = this.getDefaultMessage(I18nKeys.emailMessage);
        if (this.emailMessage)
            result = this.emailMessage;
        return this.replace(result);
    }

    /**
     * 获取手机号验证消息
     */
    private getPhoneMessage() {
        let result = this.getDefaultMessage(I18nKeys.phoneMessage);
        if (this.patternMessage)
            result = this.patternMessage;
        return this.replace(result);
    }

    /**
     * 获取身份证验证消息
     */
    private getIdCardMessage() {
        let result = this.getDefaultMessage(I18nKeys.idCardMessage);
        if (this.patternMessage)
            result = this.patternMessage;
        return this.replace(result);
    }

    /**
     * 获取正则表达式验证消息
     */
    private getPatternMessage() {
        if (this.patternMessage)
            return this.replace(this.patternMessage);
        return null;
    }
}

