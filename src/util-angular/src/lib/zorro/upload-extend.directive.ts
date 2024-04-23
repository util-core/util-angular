//============== NgZorro上传扩展指令 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter, Optional, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, tap, map } from 'rxjs/operators';
import { NzUploadFile, NzUploadComponent, NzUploadChangeParam, UploadFilter } from 'ng-zorro-antd/upload';
import { Util } from "../util";
import { UploadServiceBase } from '../zorro/upload.service'
import { StateCode } from '../core/state-code';

/**
 * NgZorro上传扩展指令
 */
@Directive({
    selector: '[x-upload-extend]',
    exportAs: 'xUploadExtend',
    standalone: true
})
export class UploadExtendDirective implements OnInit {
    /**
     * 清理对象
     */
    private readonly destroy$ = inject(DestroyRef);
    /**
     * 操作入口
     */
    protected util: Util;
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
     * @param uploadService 上传服务
     * @param cdr 变更检测
     * @param instance 上传组件实例
     */
    constructor( @Optional() public uploadService: UploadServiceBase, private cdr: ChangeDetectorRef,
        @Optional() public instance: NzUploadComponent) {
        this.util = Util.create();
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
            takeUntilDestroyed(this.destroy$),
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
     * 设置文本框输入值
     */
    private setInputValue() {
        if (this.data) {
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
                    let response = param.file.response;       
                    if (response && response.code && response.code !== StateCode.Ok)
                        this.util.message.warn(response.message);
                    if (this.isUploadComplete(param)) {
                        this.loading = false;
                        let model = this.getModel(param);
                        this.modelChange$.next(model);
                        this.onUploadComplete.emit(model);
                        if (!model && this.isClearFiles) {
                            this.files = [];
                            this.cdr.markForCheck();
                        }
                        return;
                    }
                    this.updateModel(param);
                }
                break;
            case 'removed':
                this.loading = false;
                break;
            case 'error':
                if (param.file.error && param.file.error.error) {
                    this.util.message.warn(param.file.error.error);
                }
                if (this.isUploadComplete(param)) {
                    this.loading = false;
                    if (this.isClearFiles) {
                        this.files = [];
                        this.cdr.markForCheck();
                    }
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
     * 上传过滤器
     */
    filters: UploadFilter[] = [
        {
            name: 'type',
            fn: (files: NzUploadFile[]) => {
                if (!this.instance || (!this.instance.nzAccept && !this.instance.nzFileType))
                    return files;
                let validFiles: NzUploadFile[];
                if (this.instance.nzAccept) {
                    let accepts = (<string>this.instance.nzAccept).split(',').map(extension => this.util.helper.getExtension(`.${extension}`));
                    validFiles = files.filter(file => !file.name || ~accepts.indexOf(this.util.helper.getExtension(file.name)));
                }
                if (!validFiles && this.instance.nzFileType) {
                    const types = this.instance.nzFileType.split(',');
                    validFiles = files.filter(file => ~types.indexOf(file.type));
                }
                let invalidFiles = this.util.helper.except(files, validFiles);
                if (invalidFiles && invalidFiles.length > 0)
                    this.util.message.warn(this.getMessageByType(invalidFiles));
                return validFiles;
            }
        },
        {
            name: 'size',
            fn: (files: NzUploadFile[]) => {
                if (!this.instance || this.instance.nzSize === 0)
                    return files;
                let validFiles = files.filter(file => file.size / 1024 <= this.instance.nzSize);
                let invalidFiles = this.util.helper.except(files, validFiles);
                if (invalidFiles && invalidFiles.length > 0)
                    this.util.message.warn(this.getMessageBySize(invalidFiles, this.instance.nzSize));
                return validFiles;
            }
        },
        {
            name: 'limit',
            fn: (files: NzUploadFile[]) => {
                if (!this.instance || !this.instance.nzMultiple || !this.instance.nzLimit)
                    return files;
                if (files.length > this.instance.nzLimit) {
                    this.util.message.warn(this.getMessageByLimit(this.instance.nzLimit));
                    return [];
                }
                return files;
            }
        }
    ];

    /**
     * 验证文件类型
     * @param file 文件
     * @param accept 接受扩展名列表
     */
    validateType(file: NzUploadFile, accept: string): boolean {
        if (!accept)
            return true;
        let accepts = accept.split(',').map(extension => this.util.helper.getExtension(`.${extension}`));
        if (~accepts.indexOf(this.util.helper.getExtension(file.name)))
            return true;
        this.util.message.warn(this.getMessageByType([file]));
        return false;
    }

    /**
     * 验证文件大小
     * @param file 文件
     * @param sizeLimit 大小限制
     */
    validateSize(file: NzUploadFile, sizeLimit: number): boolean {
        if (!sizeLimit)
            return true;
        if (file.size / 1024 > sizeLimit) {
            this.util.message.warn(this.getMessageBySize([file], sizeLimit));
            return false;
        }
        return true;
    }

    /**
     * 验证上传文件数量
     * @param file 文件
     * @param files 文件列表
     * @param limit 最大数量
     */
    validateLimit(file: NzUploadFile, files: NzUploadFile[], limit: number): boolean {
        if (!file || !files || files.length === 0 || !limit)
            return true;
        if (files.length > limit) {
            if (file.uid === files[0].uid)
                this.util.message.warn(this.getMessageByLimit(limit));
            return false;
        }
        return true;
    }

    /**
     * 获取文件类型错误消息
     */
    private getMessageByType(files: NzUploadFile[]) {
        return `${files.map(t => this.replace(this.util.config.upload.typeLimitMessage, t.name) + '<br/>').join('')}`;
    }

    /**
     * 获取文件大小错误消息
     */
    private getMessageBySize(files: NzUploadFile[], size) {
        return `${files.map(t => this.replace(this.util.config.upload.sizeLimitMessage, t.name, size) + '<br/>').join('')}`;
    }

    /**
     * 获取文件数量错误消息
     */
    private getMessageByLimit(limit) {
        return this.replace(this.util.config.upload.fileLimitMessage, limit);
    }

    /**
     * 替换{0},{1}
     */
    private replace(message, value1, value2 = null) {
        return message.replace(/\{0\}/, String(value1)).replace(/\{1\}/, String(value2));
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