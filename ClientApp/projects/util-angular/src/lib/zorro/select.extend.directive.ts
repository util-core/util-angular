//============== NgZorro选择框扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter, Optional } from '@angular/core';
import { Util } from "../util";
import { SelectItem } from "../core/select-item";
import { SelectOption } from '../core/select-option';
import { SelectOptionGroup } from "../core/select-option-group";
import { SelectList } from "../core/select-list";
import { QueryParameter } from '../core/query-parameter';
import { AppConfig, initAppConfig } from '../config/app-config';

/**
 * NgZorro选择框扩展指令
 */
@Directive({
    selector: '[x-select-extend]',
    exportAs: 'xSelectExtend'
})
export class SelectExtendDirective implements OnInit {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 加载状态
     */
    @Input() loading: boolean;
    /**
     * 按组显示
     */
    isGroup: boolean;
    /**
     * 列表项集合
     */
    options: SelectOption[];
    /**
     * 列表组集合
     */
    optionGroups: SelectOptionGroup[];
    /**
     * 数据源
     */
    private _data: SelectItem[];
    /**
     * 数据源
     */
    @Input() get data(): SelectItem[] {
        return this._data;
    }
    set data(value: SelectItem[]) {
        this._data = value;
        this.loadData();
    }
    /**
     * Api地址
     */
    @Input() url: string;
    /**
     * 查询参数
     */
    @Input() queryParam;
    /**
     * 初始排序条件
     */
    @Input() order: string;
    /**
     * 初始化时是否自动加载数据，默认为true,设置成false则手工加载
     */
    @Input() autoLoad: boolean;
    /**
     * 是否下拉加载
     */
    @Input() isScrollLoad: boolean;
    /**
     * 查询参数变更事件
     */
    @Output() queryParamChange = new EventEmitter<any>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化选择框扩展指令
     * @param config 应用配置
     */
    constructor(@Optional() public config: AppConfig) {
        this.initAppConfig();
        this.util = new Util(null, this.config);
        this.queryParam = new QueryParameter();
        this.autoLoad = true;
        this.loading = false;
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
     * 组件初始化
     */
    ngOnInit() {
        this.initPageSize();
        this.initOrder();
        this.loadData();
        if (this.data)
            return;
        if (this.autoLoad)
            this.loadUrl();
    }

    /**
     * 初始化分页大小
     */
    private initPageSize() {
        if (this.isScrollLoad)
            return;
        this.queryParam.pageSize = 9999;
    }

    /**
     * 初始化排序
     */
    private initOrder() {
        if (!this.order)
            return;
        this.queryParam.order = this.order;
    }

    /**
     * 加载数据
     * @param data 列表项集合
     */
    loadData(data?: SelectItem[]) {
        this._data = data || this._data;
        if (!this._data)
            return;
        let select = new SelectList(this._data);
        if (select.isGroup()) {
            this.isGroup = true;
            this.optionGroups = select.toGroups();
            return;
        }
        this.isGroup = false;
        this.options = select.toOptions();
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
        this.util.webapi.get<SelectItem[]>(url).param(param).handle({
            before: () => {
                this.loading = true;
                if (options.before)
                    return options.before();
                return true;
            },
            ok: result => {
                this.loadData(result);
                options.ok && options.ok(result);
                this.loadAfter(result);
                this.onLoad.emit(result);
            },
            complete: () => {
                this.loading = false;
                options.complete && options.complete();
            }
        });
    }

    /**
     * 加载完成操作
     * @param result
     */
    loadAfter(result) {
    }

    /**
     * 刷新
     * @param queryParam 查询参数
     */
    refresh(queryParam?: QueryParameter) {
        if (queryParam) {
            this.queryParam = queryParam;
            this.queryParamChange.emit(queryParam);
        }
        this.queryParam.order = null;
        this.loadUrl();
    }
}

