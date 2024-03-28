//============== 必填项验证扩展指令 =====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Optional, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isEmpty } from '../common/helper';

/**
 * 必填项验证扩展指令
 */
@Directive({
    selector: '[x-required-extend]',
    exportAs: 'xRequiredExtend'
})
export class RequiredExtendDirective  {
    /**
     * 是否必填项
     */
    @Input("x-required-extend") isRequired: boolean;

    /**
     * 初始化必填项验证扩展指令
     * @param ngControl 控件
     */
    constructor(@Optional() protected ngControl: NgControl) {
        let control = ngControl && ngControl.control;
        if (!control)
            return;
        control.setValidators(formControl => {
            if (!this.isRequired)
                return null;
            let value = formControl.value;
            if (isEmpty(value))
                return { 'required': true };
            return null;
        });
    }
}