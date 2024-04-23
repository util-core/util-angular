//============== NgZorro按钮扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Util } from "../util";
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro按钮扩展指令
 */
@Directive({
    selector: '[x-button-extend]',
    exportAs: 'xButtonExtend',
    standalone: true
})
export class ButtonExtendDirective {
    /**
    * 操作入口
    */
    protected util: Util;

    /**
     * 初始化按钮扩展指令
     * @param form 表单
     */
    constructor(@Optional() protected form: NgForm) {
        this.util = Util.create();
    }

    /**
     * 是否全屏
     */
    get isFullscreen() {
        return this.util.fullscreen.isFullscreen;
    }

    /**
     * 是否禁用
     */
    isDisabled(disabled) {
        if (!this.util.config.form.invalidDisableSubmit)
            return false;
        return !!disabled;
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

    /**
     * 全屏
     * @param content 内容
     * @param wrapClass 外层class类,设置为true,设置默认样式类 x-fullscreen
     * @param isPack 是否创建标题和页脚进行包装
     * @param title 标题
     */
    fullscreen(content, wrapClass?, isPack?: boolean, title?: string) {
        this.util.fullscreen.toggle({
            content: content,
            title: title,
            wrapClass: wrapClass,
            isPack: isPack
        });
    }
}