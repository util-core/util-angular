//============== NgZorro上传扩展指令 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, OnDestroy, EventEmitter, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime,filter, takeUntil, tap,map } from 'rxjs/operators';
import { NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Util } from "../util";
import { AppConfig, initAppConfig } from '../config/app-config';
import { ModuleConfig } from '../config/module-config';
import { UploadServiceBase } from '../upload/upload.service'

/**
 * NgZorro上传扩展指令
 */
@Directive({
    selector: '[x-upload-extend]',
    exportAs: 'xUploadExtend'
})
export class UploadExtendDirective implements OnInit, OnDestroy {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 清理对象
     */
    private destroy$ = new Subject<void>();
    /**
     * 模型变更对象
     */
    private modelChange$ = new BehaviorSubject(null);
    /**
     * 加载状态
     */
    loading;
    /**
     * 文本框输入值,用于验证必填项
     */
    inputValue;
    /**
     * 上传文件列表
     */
    files: NzUploadFile[];
    /**
     * 模型数据
     */
    data;
    /**
     * 模型
     */
    @Input()
    get model() {
        return this.data;
    }
    set model(value) {
        this.modelChange$.next(value);
    }

    /**
     * 初始化上传扩展指令
     * @param config 应用配置
     * @param moduleConfig 模块配置
     * @param uploadService 上传服务
     */
    constructor(@Optional() public config: AppConfig, @Optional() moduleConfig: ModuleConfig, @Optional() public uploadService: UploadServiceBase) {
        this.initAppConfig();
        this.util = new Util(null, config, moduleConfig);
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
     * 指令清理
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * 指令初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.initLoadModel();
        }, 0);
    }

    /**
     * 初始化加载模型数据
     */
    private initLoadModel() {
        if (!this.uploadService)
            throw new Error("未设置UploadServiceBase服务");
        this.modelChange$.pipe(
            takeUntil(this.destroy$),
            filter(value => !!value),
            debounceTime(100),
            tap(value => this.data = value),
            map(value => {
                if (this.util.helper.isArray(value))
                    return value.map(item => this.uploadService.toUploadFile(item));                
                return [this.uploadService.toUploadFile(value)];
            }),
        ).subscribe((value: NzUploadFile[]) => {
            this.files = value;
            this.setInputValue();
        });
    }

    /**
     * 设置文本框输入值
     */
    private setInputValue() {
        if (this.files && this.files.length > 0) {
            this.inputValue = "1";
            return;
        }
        this.inputValue = undefined;
    }

    /**
     * 上传变更处理
     * @param data 上传变更参数
     */
    handleChange(data: NzUploadChangeParam) {
        if (!data || !data.file)
            return;
        switch (data.file.status) {
            case 'uploading':
                this.loading = true;
                break;
            case 'done':
                this.loading = false;
                if (!data.file.response)
                    return;
                if (data.type === 'success') {
                    this.modelChange$.next(data.file.response);
                    this.setInputValue();
                }
                break;
            case 'removed':
                this.loading = false;
                break;
            case 'error':
                this.loading = false;
                break;
        }
    }
}