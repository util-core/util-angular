//============== NgZorro按钮扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Input, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Util } from "../util";
import { AppConfig, initAppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro按钮扩展指令
 */
@Directive({
    selector: '[x-button-extend]',
    exportAs: 'xButtonExtend'
})
export class ButtonExtendDirective  {
     /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 禁用
     */
    @Input() disabled?: string;

    /**
     * 初始化按钮扩展指令
     * @param config 应用配置
     * @param form 表单
     * @param button 按钮
     */
    constructor(@Optional() protected config: AppConfig, @Optional() protected form: NgForm,
        @Optional() protected button: NzButtonComponent) {
        initAppConfig(this.config);
        this.util = new Util(null, this.config);
    }

    /**
     * 表单无效时禁用按钮
     */
    ngDoCheck() {
        if (!this.form)
            return;
        if (!this.config.form.isInvalidFormDisableButton)
            return;
        if (this.util.helper.isEmpty(this.disabled) === false)
            return;
        this.button.disabled = !this.form.valid;
    }

    /**
     * 验证表单
     */
    validateForm() {
        if (!this.form)
            return;
        if (this.form.valid)
            return;
        if (!this.form.controls)
            return;
        Object.values(this.form.controls).forEach(control => {
            if (!control)
                return;
            if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        });
    }

    /**
     * 复制到剪贴板
     * @param value 值
     */
    copyToClipboard(value) {
        if (!value)
            return;
        let result = this.util.clipboard.copy(value);
        if (result) {
            this.util.message.success(I18nKeys.copySucceeded);
            return;
        }
        this.util.message.error(I18nKeys.copyFailed);
    }
}