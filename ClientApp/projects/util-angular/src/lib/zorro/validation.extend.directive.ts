//============== NgZorro验证扩展指令 ====================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Input, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Util } from "../util";
import { AppConfig,initAppConfig } from '../config/app-config';

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
     * 初始化输入框扩展指令
     * @param config 应用配置
     * @param controlModel 组件模型 
     */
    constructor(@Optional() public config: AppConfig, @Optional() protected controlModel: NgModel ) {
        this.util = new Util();
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
        return "";
    }

    /**
     * 获取必填项验证消息
     */
    private getRequiredMessage() {
        let result = this.config.validation.requiredMessage;
        if (this.requiredMessage)
            result = this.requiredMessage;
        return this.replace(result);
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
        if (this.displayName)
            return this.displayName;
        return this.config.text.defaultDisplayName;
    }

    /**
     * 获取最小长度验证消息
     */
    private getMinLengthMessage() {
        let result = this.config.validation.minLengthMessage;
        if (this.minLengthMessage)
            result = this.minLengthMessage;
        return this.replace(result, this.minlength);
    }

    /**
     * 获取最小值验证消息
     */
    private getMinMessage() {
        let result = this.config.validation.minMessage;
        if (this.minMessage)
            result = this.minMessage;
        return this.replace(result, this.min);
    }

    /**
     * 获取最大值验证消息
     */
    private getMaxMessage() {
        let result = this.config.validation.maxMessage;
        if (this.maxMessage)
            result = this.maxMessage;
        return this.replace(result, this.max);
    }
}

