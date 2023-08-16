//============== NgZorro表格扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================
import { Directive, Input, Output, OnInit, EventEmitter, Optional } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Util } from "../util";
import { IKey } from "../core/key";
import { QueryParameter } from "../core/query-parameter";
import { PageList } from "../core/page-list";
import { FailResult } from "../core/fail-result";
import { AppConfig, initAppConfig } from '../config/app-config';
import { ModuleConfig } from '../config/module-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro表格扩展指令
 */
@Directive({
    selector: '[x-table-extend]',
    exportAs: 'xTableExtend'
})
export class TableExtendDirective<TModel extends IKey> implements OnInit {
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 是否显示进度条
     */
    loading: boolean = false;
    /**
     * 总行数
     */
    total = 0;
    /**
     * 选择框选中列表
     */
    checkedSelection: SelectionModel<TModel>;
    /**
     * 点击行选中列表
     */
    selectedSelection: SelectionModel<TModel>;
    /**
     * 数据源
     */
    @Input() dataSource: any[];
    /**
     * 初始化时是否自动加载数据，默认为true,设置成false则手工加载
     */
    @Input() autoLoad: boolean;
    /**
     * 分页长度列表
     */
    @Input() pageSizeOptions: number[];
    /**
     * Api地址
     */
    @Input() url: string;
    /**
     * 通过标识加载地址
     */
    @Input() loadByIdUrl: string;
    /**
     * 删除地址，注意：由于支持批量删除，所以采用Post提交，范例：/api/test/delete
     */
    @Input() deleteUrl: string;
    /**
     * 查询参数
     */
    @Input() queryParam;
    /**
     * 初始排序条件
     */
    @Input() order: string;
    /**
     * 复选框选中的标识列表
     */
    @Input() checkedKeys: string | string[];
    /**
     * 查询参数变更事件
     */
    @Output() queryParamChange = new EventEmitter<QueryParameter>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化表格扩展指令
     * @param config 应用配置
     * @param moduleConfig 模块配置
     */
    constructor(@Optional() public config: AppConfig, @Optional() moduleConfig: ModuleConfig) {
        this.initAppConfig();
        this.util = new Util(null, config, moduleConfig);
        this.queryParam = new QueryParameter();
        this.dataSource = new Array<any>();
        this.checkedSelection = new SelectionModel<TModel>(true, []);
        this.selectedSelection = new SelectionModel<TModel>(true, []);
        this.autoLoad = true;
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
     * 初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.queryParam = this.queryParam || new QueryParameter();
            this.initPageSizeOptions();
            this.initPageSize();
            this.initOrder();
            if (this.autoLoad)
                this.load();
        }, 0);
    }

    /**
     * 初始化分页大小选项
     */
    protected initPageSizeOptions() {
        if (this.pageSizeOptions && this.pageSizeOptions.length > 0)
            return;
        let pageSizeOptions = this.config.table.pageSizeOptions;
        if (pageSizeOptions && pageSizeOptions.length > 0) {
            this.pageSizeOptions = pageSizeOptions;
            return;
        }
        this.pageSizeOptions = [10, 20, 30, 40, 50];
    }

    /**
     * 初始化分页大小
     */
    protected initPageSize() {
        if (this.pageSizeOptions.some(value => value === this.config.pageSize))
            return;
        this.queryParam.pageSize = this.pageSizeOptions[0];
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
     * 获取勾选的实体列表
     */
    getChecked(): TModel[] {
        if (!this.dataSource)
            return [];
        return this.dataSource.filter(data => this.checkedSelection.isSelected(data));
    }

    /**
     * 获取勾选的实体列表
     */
    getCheckedNodes(): TModel[] {
        return this.getChecked();
    }

    /**
     * 获取勾选的实体列表长度
     */
    getCheckedLength(): number {
        return this.getChecked().length;
    }

    /**
     * 获取勾选的实体标识列表
     */
    getCheckedIds(): string {
        return this.checkedSelection.selected.map(value => value.id).join(",");
    }

    /**
     * 获取勾选的单个节点
     */
    getCheckedNode(): TModel {
        let list = this.getChecked();
        if (!list || list.length === 0)
            return null;
        return list[0];
    }

    /**
     * 通过标识列表查找
     * @param ids 标识列表
     */
    getByIds(ids: string[]): TModel[] {
        if (!ids || ids.length === 0)
            return [];
        return this.dataSource.filter(item => ids.some(id => id === item.id));
    }

    /**
     * 通过标识查找
     * @param id 标识
     */
    getById(id: string): TModel {
        if (!id)
            return null;
        return this.dataSource.find(data => data.id === id);
    }

    /**
     * 仅勾选一行
     */
    checkRowOnly(row) {
        this.clearChecked();
        this.checkRow(row);
    }

    /**
     * 勾选一行
     */
    checkRow(row) {
        if (this.isChecked(row))
            return;
        this.checkedSelection.select(row);
    }

    /**
     * 切换勾选状态
     */
    toggle(row) {
        this.checkedSelection.toggle(row);
    }

    /**
     * 勾选标识列表
     */
    checkIds(ids) {
        if (!ids)
            return;
        if (this.util.helper.isString(ids)) {
            if (ids.indexOf(",") < 0) {
                let item = this.dataSource.find(data => data.id === ids);
                this.checkRow(item);
                return;
            }
            ids = this.util.helper.toList<string>(ids);
        }
        if (this.util.helper.isArray(ids)) {
            let list = this.dataSource.filter(data => ids.indexOf(data.id) >= 0);
            list.forEach(item => {
                this.checkRow(item);
            });
        }
    }

    /**
     * 切换选中状态
     */
    toggleSelect(row) {
        this.selectedSelection.toggle(row);
    }

    /**
     * 仅选中一行
     */
    selectRowOnly(row) {
        this.clearSelected();
        this.selectRow(row);
    }

    /**
     * 选中一行
     */
    selectRow(row) {
        this.selectedSelection.select(row);
    }

    /**
     * 清空勾选的行
     */
    clearChecked() {
        this.checkedSelection.clear();
    }

    /**
     * 清空选中的行
     */
    clearSelected() {
        this.selectedSelection.clear();
    }

    /**
     * 是否被选中
     * @param row 行
     */
    isSelected(row) {
        return this.selectedSelection.isSelected(row);
    }

    /**
     * 是否选中状态
     * @param row 行
     */
    isChecked(row) {
        return this.checkedSelection.isSelected(row);
    }

    /**
     * 表头主复选框的选中状态
     */
    isMasterChecked() {
        return this.checkedSelection.hasValue() &&
            this.isAllChecked() &&
            this.checkedSelection.selected.length >= this.dataSource.length;
    }

    /**
     * 是否所有行复选框被选中
     */
    isAllChecked() {
        return this.dataSource.every(data => this.checkedSelection.isSelected(data));
    }

    /**
     * 表头主复选框的确定状态
     */
    isMasterIndeterminate() {
        return this.checkedSelection.hasValue() && (!this.isAllChecked() || !this.dataSource.length);
    }

    /**
     * 表头主复选框切换选中状态
     */
    masterToggle() {
        if (this.isMasterChecked()) {
            this.checkedSelection.clear();
            return;
        }
        this.dataSource.forEach(data => this.checkedSelection.select(data));
    }

    /**
     * 移除行
     * @param ids 行标识列表
     */
    removeRows(ids?: string[]) {
        if (!ids || ids.length === 0)
            ids = this.getChecked().map(value => value.id);
        if (!ids || ids.length === 0) {
            this.util.message.warn(I18nKeys.noDeleteItemSelected);
            return null;
        }
        let result = this.util.helper.remove(this.dataSource, row => ids.findIndex(id => row.id === id) > -1);
        this.dataSource = [...this.dataSource];
        this.total = this.total - result.length;
        this.initLineNumbers(this.dataSource);
        this.checkedSelection.deselect(...result);
        return result;
    }

    /**
     * 清理
     */
    clear() {
        this.dataSource = [];
        this.queryParam.page = 1;
        this.total = 0;
        this.checkedSelection.clear();
        this.selectedSelection.clear();
        this.checkedKeys = null;
    }

    /**
     * 加载
     */
    load() {
        this.query();
    }

    /**
     * 查询
     * @param options 配置
     */
    query(options?: {
        /**
         * 按钮
         */
        button?,
        /**
         * 请求地址
         */
        url?: string,
        /**
         * 查询参数
         */
        param?,
        /**
         * 页数
         */
        page?,
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
         * 请求失败处理函数
         */
        fail?: (result: FailResult) => void;
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
        if (options.page)
            param.page = options.page;
        if (!param.page)
            param.page = 1;
        this.util.webapi.get<any>(url).param(param).button(options.button).handle({
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
            fail: options.fail,
            complete: () => {
                this.loading = false;
                options.complete && options.complete();
            }
        });
    }

    /**
     * 获取地址
     * @param url 地址
     * @param path 路径
     */
    protected getUrl(url: string, path: string) {
        if (!url)
            return null;
        return this.util.helper.joinUrl(url, path);
    }

    /**
     * 加载数据
     */
    loadData(result) {
        result = new PageList<TModel>(result);
        result.initLineNumbers();
        this.dataSource = result.data || [];
        this.total = result.total;
        this.checkedSelection.clear();
        this.checkIds(this.checkedKeys);
    }

    /**
     * 加载完成操作
     * @param result
     */
    loadAfter(result) {
    }

    /**
     * 批量删除被选中实体
     * @param options 参数
     */
    delete(options?: {
        /**
         * 待删除的Id列表，多个Id用逗号分隔，范例：1,2,3
         */
        ids?: string,
        /**
         * 服务端删除Api地址
         */
        url?: string,
        /**
         * 请求前处理函数，返回false则取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         */
        ok?: () => void;
    }) {
        options = options || {};
        let ids = options.ids || this.getCheckedIds();
        if (!ids) {
            this.util.message.warn(I18nKeys.noDeleteItemSelected);
            return;
        }
        this.util.message.confirm({
            content: I18nKeys.deleteConfirmation,
            onOk: () => this.deleteRequest(ids, options.before, options.ok, options.url)
        });
    }

    /**
     * 发送删除请求
     */
    private async deleteRequest(ids?: string, before?: () => boolean, ok?: () => void, url?: string) {
        url = this.getDeleteUrl(url);
        if (!url)
            return;
        await this.util.webapi.post(url, ids).handleAsync({
            ok: () => {
                this.util.message.success(I18nKeys.deleteSuccessed);
                this.query({
                    before: before,
                    ok: result => {
                        if (result.page > result.pageCount) {
                            this.query({
                                page: result.page - 1,
                                ok: ok
                            });
                            return;
                        }
                        ok && ok();
                    }
                });
            }
        });
    }

    /**
     * 获取删除Api地址
     */
    private getDeleteUrl(url) {
        return url || this.deleteUrl || this.getUrl(this.url, "delete");
    }

    /**
     * 页索引变化事件处理
     * @param page 页码，第一页传入1
     */
    pageIndexChange(page: number) {
        this.queryParam.page = page;
        this.query();
    }

    /**
     * 分页大小变化事件处理
     * @param pageSize 分页大小
     */
    pageSizeChange(pageSize: number) {
        this.queryParam.pageSize = pageSize;
        this.query();
    }

    /**
     * 排序变化事件处理
     * @param column 排序列
     * @param direction 排序方向
     */
    sortChange(column: string, direction: 'ascend' | 'descend' | null) {
        let order = this.getOrder(column, direction);
        this.sort(order);
    }

    /**
     * 获取排序条件
     */
    private getOrder(column: string, direction: 'ascend' | 'descend' | null) {
        if (!column)
            return null;
        if (direction === null)
            return null;
        column = column.replace(/ ascend/i, "").replace(/ descend/i, "").replace(/ asc/i, "").replace(/ desc/i, "");
        if (direction === "descend")
            return `${column} desc`;
        return column;
    }

    /**
     * 排序
     * @param order 排序条件
     */
    sort(order: string) {
        if (order)
            this.queryParam.order = order;
        else
            this.queryParam.order = this.order;
        this.query();
    }

    /**
     * 添加行
     * @param row 行
     */
    addRow(row) {
        if (!row)
            return;
        if (this.dataSource.some(t => t.id === row.id))
            return;
        this.dataSource = [row, ...this.dataSource];
        this.total = this.total + 1;
        this.initLineNumbers(this.dataSource);
    }

    /**
     * 初始化行号
     */
    private initLineNumbers(data) {
        let result = new PageList<TModel>(data, this.queryParam.page, this.queryParam.pageSize);
        result.initLineNumbers();
    }

    /**
     * 通过标识判断是否存在
     * @param id 标识或对象
     */
    exists(id): boolean {
        if (!id)
            return false;
        id = id.id || id;
        return this.dataSource.some(item => item.id === id);
    }

    /**
     * 刷新
     * @param queryParam 查询参数
     * @param button 按钮
     * @param handler 刷新成功回调函数
     */
    refresh(queryParam?: QueryParameter, button?, handler?: (result) => void) {
        this.clear();
        if (queryParam) {
            this.queryParam = queryParam;
            this.queryParamChange.emit(queryParam);
        }
        this.initPageSize();
        this.queryParam.order = this.order;
        this.query({
            button: button,
            ok: handler
        });
    }

    /**
     * 刷新单个实体
     * @param model 实体对象
     */
    refreshByModel(model) {
        if (this.exists(model)) {
            this.refreshUpdateNode(model);
            return;
        }
        this.query({ page: 1 });
    }

    /**
     * 刷新更新节点
     * @param model 实体对象
     */
    protected refreshUpdateNode(model) {
        if (!model)
            return;
        if (!model.id)
            return;
        let item = this.dataSource.find(t => t.id === model.id);
        if (!item)
            return;
        model["lineNumber"] = item["lineNumber"];
        let index = this.dataSource.indexOf(item);
        this.dataSource[index] = model;
    }
}

