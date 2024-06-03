//============== NgZorro分段控制器扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Directive, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Util } from "../util";
import { SelectItem } from '../core/select-item';
import { SelectOption } from "../core/select-option";
import { SelectList } from "../core/select-list";
import { QueryParameter } from '../core/query-parameter';

/**
 * NgZorro分段控制器扩展指令
 */
@Directive({
    selector: '[x-segmented-extend]',
    exportAs: 'xSegmentedExtend',
    standalone: true
})
export class SegmentedExtendDirective implements OnInit, OnChanges {
    /**
    * 操作入口
    */
    protected util: Util;
    /**
     * 加载状态
     */
    loading: boolean;
    /**
     * 列表项集合
     */
    options: { label, value, disabled, icon }[];
    /**
     * 索引
     */
    index: number;
    /**
     * 数据源
     */
    @Input() data: SelectItem[];
    /**
     * 值
     */
    @Input() value;
    /**
     * Api地址
     */
    @Input() url: string;
    /**
     * 查询参数
     */
    @Input() queryParam;
    /**
     * 初始化时是否自动加载数据，默认为true,设置成false则手工加载
     */
    @Input() autoLoad: boolean;
    /**
     * 值变更事件
     */
    @Output() valueChange = new EventEmitter<any>();
    /**
     * 查询参数变更事件
     */
    @Output() queryParamChange = new EventEmitter<any>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化分段控制器扩展指令
     */
    constructor() {
        this.util = Util.create();
        this.queryParam = new QueryParameter();
        this.autoLoad = true;
        this.loading = false;
        this.options = [];
    }

    /**
     * 初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.init();
            if (this.data)
                return;
            if (this.autoLoad)
                this.loadUrl();
        }, 10);
    }

    /**
     * 初始化
     */
    protected init() {
        if (!this.options || this.options.length === 0)
            return;
        this.initIndex();
        if (!this.value)
            this.setValue(this.options[0].value);
    }

    /**
     * 初始化索引
     */
    private initIndex(options?: SelectOption[]) {
        let index = 0;
        if (options)
            index = options.findIndex(t => t.selected);
        if (this.value)
            index = this.options.findIndex(t => t.value === this.value);
        if (index === -1)
            index = 0;
        this.index = index;
    }

    /**
     * 设置值
     */
    setValue(value) {
        if (this.value !== value)
            this.valueChange.emit(value);
        this.value = value;
    }

    /**
     * 变更检测
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!this.data)
            return;
        const { data, value } = changes;
        if (data && data.currentValue !== data.previousValue) {
            setTimeout(() => this.loadData());
            return;
        }
        if (value && value.currentValue !== value.previousValue) {
            setTimeout(() =>this.initIndex());
        }
    }

    /**
     * 加载数据
     * @param data 列表项集合
     */
    loadData(data?: SelectItem[]) {
        this.data = data || this.data;
        if (!this.data)
            return;
        let select = new SelectList(this.data);
        let options = select.toOptions();
        if (!options || !options.map)
            return;
        this.options = options.map(t => {
            return {
                label: this.util.i18n.get(t.text),
                value: t.value,
                disabled: t.disabled,
                icon: t.icon
            };
        });
        this.initIndex(options);
    }

    /**
     * 从服务器加载
     */
    loadUrl(options?: {
        /**
         * 请求地址
         */
        url?: string,
        /**
         * 查询参数
         */
        param?,
        /**
         * 请求前处理函数，返回false则取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         * @param result 结果
         */
        ok?: (result) => void;
        /**
         * 请求完成处理函数
         */
        complete?: () => void;
    }) {
        options = options || {};
        let url = options.url || this.url;
        if (!url)
            return;
        let param = options.param || this.queryParam;
        this.util.webapi.get<SelectItem[]>(url)
            .param(param)
            .handle({
                before: () => {
                    this.loading = true;
                    if (options.before)
                        return options.before();
                    return true;
                },
                ok: result => {
                    this.onLoad.emit(result);
                    if (options.ok) {
                        options.ok(result);
                        return;
                    }
                    this.loadData(result);
                },
                complete: () => {
                    this.loading = false;
                    options.complete && options.complete();
                }
            });
    }

    /**
     * 值变更事件处理
     */
    handleValueChange(index) {
        if (index < this.options.length)
            this.setValue(this.options[index].value);
    }
}