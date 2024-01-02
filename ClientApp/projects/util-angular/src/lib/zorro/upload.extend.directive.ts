//============== NgZorro上传扩展指令 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, OnDestroy, EventEmitter, Optional, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, takeUntil, tap, map } from 'rxjs/operators';
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
export class UploadExtendDirective implements OnInit,OnDestroy {
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
     * 是否清除文件列表
     */
    @Input() isClearFiles: boolean;
    /**
     * 是否多上传
     */
    @Input() nzMultiple: boolean;
    /**
     * 获取模型数据项回调函数
     */
    @Input() getModelItem: (param: NzUploadChangeParam) => any;
    /**
     * 模型转换为上传文件列表的延迟时间
     */
    @Input() modelToFilesDebounceTime: number;
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
     * 模型变更事件
     */
    @Output() modelChange = new EventEmitter<any>();
    /**
     * 上传完成事件
     */
    @Output() onUploadComplete = new EventEmitter<any>();

    /**
     * 初始化上传扩展指令
     * @param config 应用配置
     * @param moduleConfig 模块配置
     * @param uploadService 上传服务
     */
    constructor(@Optional() public config: AppConfig, @Optional() moduleConfig: ModuleConfig,
        @Optional() public uploadService: UploadServiceBase, private cdr: ChangeDetectorRef) {
        initAppConfig(config);
        this.util = new Util(null, config, moduleConfig);
        this.files = [];
        this.modelToFilesDebounceTime = 100;
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.initLoadModel();
    }

    /**
     * 初始化加载模型数据
     */
    private initLoadModel = () => {
        if (!this.uploadService)
            throw new Error("未设置UploadServiceBase服务");
        this.modelChange$.pipe(
            takeUntil(this.destroy$),
            filter(value => !!value),
            distinctUntilChanged((a, b) => a === b),
            tap(value => {
                this.data = value;
                this.modelChange.emit(value);
            }),
            debounceTime(this.modelToFilesDebounceTime),
            map(value => {
                if (this.util.helper.isArray(value))
                    return value.map(item => this.uploadService.toUploadFile(item));
                return [this.uploadService.toUploadFile(value)];
            })
        ).subscribe((files: NzUploadFile[]) => {
            this.setInputValue();
            if (this.isClearFiles)
                this.files = [];
            else
                this.files = [...files];
            this.cdr.markForCheck();
        });
    }

    /**
     * 指令清理
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * 设置文本框输入值
     */
    private setInputValue() {
        if (this.data ) {
            this.inputValue = "1";
            if (this.data.length && this.data.length === 0)
                this.inputValue = undefined;
            return;
        }
        this.inputValue = undefined;
    }

    /**
     * 上传变更处理
     * @param param 上传变更参数
     */
    handleChange = (param: NzUploadChangeParam) => {        
        if (!param || !param.file)
            return;
        switch (param.file.status) {
            case 'uploading':
                this.loading = true;
                break;
            case 'done':                
                if (param.type === 'success') {                    
                    if (this.isUploadComplete(param)) {
                        this.loading = false;
                        let model = this.getModel(param);
                        this.modelChange$.next(model);
                        this.onUploadComplete.emit(model);                        
                        return;
                    }
                    this.updateModel(param);
                }
                break;
            case 'removed':
                this.loading = false;
                break;
            case 'error':
                if (this.isUploadComplete(param)) {
                    this.loading = false;
                    return;
                }
                break;
        }
    }

    /**
     * 是否上传完成
     */
    private isUploadComplete = (param: NzUploadChangeParam) => {
        if (!param)
            return false;
        if (!param.fileList)
            return false;
        if (param.fileList.some(file => file.status === 'uploading'))
            return false;
        return true;
    }

    /**
     * 获取模型
     */
    private getModel = (param: NzUploadChangeParam) => {
        let item = this.resolveModelItem(param);
        if (this.nzMultiple)
            return [...(this.data || []), item];
        return item;
    }  

    /**
     * 解析模型数据项
     */
    private resolveModelItem = (param: NzUploadChangeParam) => {
        if (this.getModelItem)
            return this.getModelItem(param);
        if (!param.file.response)
            return null;
        return param.file.response.data || param.file.response;
    }      

    /**
     * 更新模型
     */
    private updateModel = (param: NzUploadChangeParam) => {
        this.data = this.getModel(param);
        this.modelChange.emit(this.data);
    }

    /**
     * 清理
     */
    clear() {
        this.loading = false;
        this.data = null;
        this.files = [];
        this.inputValue = null;
    }
}