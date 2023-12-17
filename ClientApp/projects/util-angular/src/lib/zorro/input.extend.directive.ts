//============== 输入框扩展指令 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive } from '@angular/core';

/**
 * 输入框扩展指令
 */
@Directive({
    selector: '[x-input-extend]',
    exportAs: 'xInputExtend'
})
export class InputExtendDirective  {
    /**
     * 是否显示密码
     */
    passwordVisible = false;
}