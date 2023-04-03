//============== NgZorro选择框扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, OnDestroy, EventEmitter, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, switchMap } from 'rxjs/operators';
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
export class SelectExtendDirective implements OnInit, OnDestroy {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 清理对象
     */
    private destroy$ = new Subject<void>();
    /**
     * 搜索变更对象
     */
    private searchChange$ = new BehaviorSubject(null);
    /**
     * 加载状态
     */
    loading: boolean;
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
     * 搜索延迟时间,单位:毫秒
     */
    @Input() searchDelay: number;
    /**
     * 是否下拉加载
     */
    @Input() isScrollLoad: boolean;
    /**
     * 是否下拉加载已完成
     */
    private isScrollLoadCompleted: boolean;
    /**
     * 查询参数变更事件
     */
    @Output() queryParamChange = new EventEmitter<any>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();
    /**
     * 搜索事件
     */
    @Output() onSearch = new EventEmitter<string>();
    /**
     * 滚动到底部事件
     */
    @Output() onScrollToBottom = new EventEmitter<void>();

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
        this.searchDelay = 500;
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
            this.initPageSize();
            this.initOrder();
            this.initSearch();
            this.loadData();
            if (this.data)
                return;
            if (this.autoLoad)
                this.loadUrl();
        }, 0);
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
     * 初始化搜索
     */
    private initSearch() {
        let client$ = this.searchChange$.pipe(
            takeUntil(this.destroy$),
            filter(value => value !== null),
            debounceTime(this.searchDelay),
            distinctUntilChanged(),
            switchMap(value => this.serverSearch(value))
        );
        this.util.webapi.handle<SelectItem[]>(client$, {
            before: () => {
                this.loading = true;
                return true;
            },
            ok: result => {
                this.onLoad.emit(result);
                this.loadData(result);
            },
            complete: () => {
                this.loading = false;
            }
        })
    }

    /**
     * 服务端搜索
     */
    private serverSearch(value: string) {
        this.isScrollLoadCompleted = false;
        this.onSearch.emit(value);
        this.queryParam.page = 1;
        this.queryParam.keyword = value;
        return this.request();
    }

    /**
     * 发送请求
     */
    private request() {
        if (!this.url)
            return null;
        return this.util.webapi.get<SelectItem[]>(this.url).param(this.queryParam).getClient();
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
     * 刷新
     * @param queryParam 查询参数
     */
    refresh(queryParam?: QueryParameter) {
        if (queryParam) {
            this.queryParam = queryParam;
            this.queryParamChange.emit(queryParam);
        }
        this.queryParam.order = this.order;
        this.loadUrl();
    }

    /**
     * 搜索
     * @param value 值
     */
    search(value: string) {
        this.searchChange$.next(value);
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
        this.onScrollToBottom.emit();
        if (!this.isScrollLoad)
            return;
        if (this.isScrollLoadCompleted)
            return;
        this.scrollLoad();
    }

    /**
     * 下拉加载
     */
    private scrollLoad() {
        this.queryParam.page = this.util.helper.toNumber(this.queryParam.page) + 1;
        this.loadUrl({
            ok: result => {
                if (!result || result.length === 0) {
                    this.isScrollLoadCompleted = true;
                    return;
                }
                let data = [...this.data, ...result];
                this.loadData(data);
            }
        });
    }
}