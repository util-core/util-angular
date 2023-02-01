//============== NgZorro按钮扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Input, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Util } from "../util";
import { AppConfig, initAppConfig } from '../config/app-config';

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
     * @param form 表单
     * @param button 按钮
     * @param config 配置
     */
    constructor(@Optional() protected form: NgForm, @Optional() protected button: NzButtonComponent, @Optional() protected config: AppConfig) {
        this.initAppConfig();
        this.util = new Util(null,this.config);
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
     * 表单无效时禁用按钮
     */
    ngDoCheck() {
        if (!this.form)
            return;
        if (this.util.helper.isEmpty(this.disabled) === false)
            return;
        this.button.disabled = !this.form.valid;
    }
}

