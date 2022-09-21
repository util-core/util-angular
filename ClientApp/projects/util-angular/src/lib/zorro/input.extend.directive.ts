//============== NgZorro输入框扩展指令 ====================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter, Optional } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { Util } from "../util";
import { AppConfig } from '../config/app-config';
import { TextConfig } from '../config/text-config';
import { DefaultTextConfig } from "../config/default-text-config";

/**
 * NgZorro输入框扩展指令
 */
@Directive({
    selector: '[x-input-extend]',
    exportAs: 'xInputExtend'
})
export class InputExtendDirective implements OnInit {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 必填项验证消息
     */
    @Input() requiredMessage: string;

    /**
     * 初始化输入框扩展指令
     * @param appConfig 应用配置
     * @param config 文本配置
     */
    constructor(@Optional() protected appConfig: AppConfig, @Optional() protected controlModel: NgModel) {
        this.util = new Util();
    }

    /**
     * 组件初始化
     */
    ngOnInit() {
    }
}

