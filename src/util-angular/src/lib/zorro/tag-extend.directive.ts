//============== NgZorro标签扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Util } from "../util";
import { SelectItem } from "../core/select-item";
import { SelectOption } from '../core/select-option';
import { SelectList } from "../core/select-list";
import { QueryParameter } from '../core/query-parameter';

/**
 * NgZorro标签扩展指令
 */
@Directive({
    selector: '[x-tag-extend]',
    exportAs: 'xTagExtend',
    standalone: true
})
export class TagExtendDirective implements OnInit, OnChanges {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 选中项列表
     */
    private selectedItems: SelectItem[];
    /**
     * 是否首次加载
     */
    private isFirst = true;
    /**
     * 上一次是否全部选中
     */
    private allSelectedPreviousValue?: boolean;
    /**
     * 列表项集合
     */
    options: SelectOption[];
    /**
     * 数据源
     */
    @Input() data: SelectItem[];
    /**
     * 是否全部选中
     */
    @Input() allSelected?: boolean;
    /**
     * 选中文本
     */
    @Input() selectedText?: string;
    /**
     * 选中值
     */
    @Input() selectedValue?: string;
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
     * 选中文本变化事件
     */
    @Output() selectedTextChange = new EventEmitter<string>();
    /**
     * 选中值变化事件
     */
    @Output() selectedValueChange = new EventEmitter<string>();
    /**
     * 全部选中状态变化事件
     */
    @Output() allSelectedChange = new EventEmitter<boolean>();
    /**
     * 查询参数变化事件
     */
    @Output() queryParamChange = new EventEmitter<any>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化标签扩展指令
     * @param cdr 变更检测
     */
    constructor(private cdr: ChangeDetectorRef) {
        this.util = Util.create();
        this.queryParam = new QueryParameter();
        this.autoLoad = true;
        this.selectedItems = [];
    }

    /**
     * 指令初始化
     */
    ngOnInit() {
        setTimeout(() => {
            if (this.data) {
                this.loadData();
                return;
            }
            if (this.autoLoad)
                this.loadUrl();
        });
        setTimeout(() => {
            this.isFirst = false;
        }, 1000);
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
        this.options = select.toOptions();
        this.setSelectedItems();
    }

    /**
     * 变更检测
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!this.data)
            return;
        const { allSelected, selectedText, selectedValue } = changes;
        if (allSelected && allSelected.currentValue !== undefined && allSelected.currentValue !== allSelected.previousValue) {
            if (this.allSelected === true) {
                setTimeout(() => this.selectAll());
                return;
            }
            if (this.allSelected === false) {
                setTimeout(() => this.unSelectAll());
                return;
            }
        }
        if (selectedText && selectedText.currentValue !== selectedText.previousValue) {
            setTimeout(() => this.selectByText());
            return;
        }
        if (selectedValue && selectedValue.currentValue !== selectedValue.previousValue) {
            setTimeout(() => this.selectByValue());
            return;
        }
    }

    /**
     * 全选
     */
    selectAll() {
        if (this.data.every(item => item.selected))
            return;
        this.data = this.data.map(item => new SelectItem(item.text, item.value, item.sortId, true));
        this.loadData();
    }

    /**
     * 设置选中项列表
     */
    private setSelectedItems() {
        this.selectedItems = this.data.filter(t => t.selected);
        let selectedText = this.selectedItems.map(item => item.text).join("|");
        this.setSelectedText(selectedText);
        let selectedValue = this.selectedItems.map(item => item.value).join(",");
        this.setSelectedValue(selectedValue);
        let allSelected = this.data.every(item => item.selected) ? true : undefined;
        this.setAllSelected(allSelected);
    }

    /**
     * 设置选中文本
     */
    private setSelectedText(text: string) {
        if (this.selectedText === text)
            return;
        this.selectedText = text;
        if (this.isFirst)
            return;
        this.selectedTextChange.emit(text);
    }

    /**
     * 设置选中值
     */
    private setSelectedValue(value) {
        if (this.selectedValue === value)
            return;
        this.selectedValue = value;
        if (this.isFirst)
            return;
        this.selectedValueChange.emit(value);
    }

    /**
     * 设置全选状态
     */
    private setAllSelected(value) {
        if (this.allSelectedPreviousValue === value)
            return;
        this.allSelected = value;
        this.allSelectedPreviousValue = value;
        if (this.isFirst)
            return;
        this.allSelectedChange.emit(value);
    }

    /**
     * 全部取消
     */
    unSelectAll() {
        if (this.data.every(item => !item.selected))
            return;
        this.data = this.data.map(item => new SelectItem(item.text, item.value, item.sortId, false));
        this.loadData();
    }

    /**
     * 通过文本选中项列表
     */
    selectByText(text?) {
        if (!text)
            text = this.selectedText;        
        if (!text) {
            this.unSelectAll();
            return;
        }
        let array = text.split('|');
        this.data = this.data.map(item => {
            if (~array.indexOf(item.text))
                item.selected = true;
            else
                item.selected = false;
            return item;
        });
        this.loadData();
    }

    /**
     * 通过值选中项列表
     */
    selectByValue(value?) {
        if (!value)
            value = this.selectedValue;
        if (!value) {
            this.unSelectAll();
            return;
        }
        let array = value.split(',');
        this.data = this.data.map(item => {
            if (~array.indexOf(item.value?.toString()))
                item.selected = true;
            else
                item.selected = false;
            return item;
        });
        this.loadData();        
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
                    if (options.before)
                        return options.before();
                    return true;
                },
                ok: result => {
                    this.loadData(result);
                    this.onLoad.emit(result);
                    if (options.ok)
                        options.ok(result);
                    this.cdr.markForCheck();
                },
                complete: () => {
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
        if (queryParam) {
            this.queryParam = queryParam;
            this.queryParamChange.emit(queryParam);
        }
        this.loadUrl();
    }

    /**
     * 选中事件处理
     * @param selected 是否选中
     * @param text 文本
     */
    selectItem(selected: boolean, text) {
        let data = this.data.map(item => {
            if (item.text === text)
                item.selected = selected;
            return item;
        });
        this.loadData(data);
    }
}