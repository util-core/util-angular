﻿//============== NgZorro选择框扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Util } from "../util";
import { SelectItem } from "../core/select-item";
import { SelectOption } from '../core/select-option';
import { SelectOptionGroup } from "../core/select-option-group";
import { SelectList } from "../core/select-list";
import { QueryParameter } from '../core/query-parameter';

/**
 * NgZorro选择框扩展指令
 */
@Directive({
    selector: '[x-select-extend]',
    exportAs: 'xSelectExtend',
    standalone: true
})
export class SelectExtendDirective implements OnInit {
    /**
     * 清理对象
     */
    private readonly destroy$ = inject(DestroyRef);
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 文本框是否被修改过
     */
    private _isDirty: boolean;
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
     */
    constructor() {
        this.util = Util.create();
        this.queryParam = new QueryParameter();
        this.autoLoad = true;
        this.loading = false;
        this.searchDelay = 500;
    }

    /**
     * 指令初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.initPageSize();
            this.initOrder();
            this.initSearch();
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
            takeUntilDestroyed(this.destroy$),
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
        this.loading = false;
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
        return this.util.webapi.get<SelectItem[]>(this.url)
            .param(this.queryParam)
            .getClient();
    }

    /**
     * 加载数据
     * @param data 列表项集合
     */
    loadData(data?: SelectItem[]) {
        this._data = data || this._data;
        if (!this._data)
            return;
        this._data = this.util.helper.distinct(this._data, t => t.value);
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
         * 选中的标识列表,支持数组或逗号分隔的字符串
         */
        selectedKeys?,
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
        let selectedKeys = this.getSelectedKeys(options.selectedKeys);
        this.util.webapi.get<SelectItem[]>(url)
            .paramIf("load_keys", selectedKeys, !!selectedKeys)
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
     * 获取选中的标识列表
     */
    private getSelectedKeys(selectedKeys) {
        if (!selectedKeys)
            return null;
        let result = this.getNotLoadedKeys(selectedKeys);
        return result.join(",");
    }

    /**
     * 获取未加载的标识集合
     */
    private getNotLoadedKeys(keys) {
        if (this.util.helper.isArray(keys))
            return keys.filter(key => !this.exists(key));
        if (keys.indexOf(",") >= 0) {
            let list = this.util.helper.toList<string>(keys);
            return list.filter(key => !this.exists(key));
        }
        if (this.exists(keys))
            return [];
        return [keys];        
    }

    /**
     * 通过标识判断是否存在
     * @param id 标识或对象
     */
    private exists(id): boolean {
        if (!id)
            return false;
        if (!this.data)
            return false;
        id = id.id || id;
        return this.data.some(item => item.value === id);
    }

    /**
     * 刷新
     * @param queryParam 查询参数
     */
    refresh(queryParam?: QueryParameter) {
        this.isScrollLoadCompleted = false;
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
    search(value) {        
        if (!this._isDirty && value === '')
            return;
        if (value && value.value)
            value = value.value;
        this._isDirty = true;
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