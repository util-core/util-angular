//=============== 树形表格查询基类================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, ViewChild, OnInit, Component } from '@angular/core';
import { PageList } from "../core/page-list";
import { TreeViewModel } from "../core/tree-view-model";
import { TreeQueryParameter } from "../core/tree-query-parameter";
import { TreeTableExtendDirective } from "../zorro/tree-table-extend.directive";
import { QueryComponentBase } from "./query-component-base";

/**
 * 树形表格查询基类
 */
@Component({
    template: ''
})
export abstract class TreeTableQueryComponentBase<TViewModel extends TreeViewModel, TQuery extends TreeQueryParameter> extends QueryComponentBase<TQuery> implements OnInit {
    /**
     * 树形表格扩展指令
     */
    @ViewChild(TreeTableExtendDirective) protected table: TreeTableExtendDirective<TViewModel>;

    /**
     * 初始化树形表格查询基类
     * @param injector 注入器
     */
    constructor(injector?: Injector) {
        super(injector);
    }

    /**
     * 初始化
     */
    ngOnInit() {
        super.ngOnInit();
        this.loadCheckedIds();
    }

    /**
     * 加载勾选的复选框标识
     */
    protected loadCheckedIds() {
        if (this.checkedIds && !this.util.helper.isEmptyArray(this.checkedIds))
            return;
        let selection = this.getSelection();
        this.checkedIds = this.util.helper.getIds(selection);
    }

    /**
     * 获取选中项列表
     */
    protected getSelection() {
        return this.data;
    }

    /**
     * 加载,对于异步请求,仅加载第一级节点
     * @param button 按钮
     * @param handler 加载成功回调函数
     */
    load(button?, handler?: (data: PageList<TViewModel>) => void) {
        if (!this.table)
            return;
        handler = handler || (items => this.onQuery(items));
        this.table.query({
            isSearch: false,
            url: this.table.loadUrl,
            button: button,
            ok: handler
        });
    }

    /**
     * 查询
     * @param button 按钮
     * @param handler 查询成功回调函数
     */
    query(button?, handler?: (data: PageList<TViewModel>) => void) {
        if (!this.table)
            return;
        handler = handler || (items => this.onQuery(items));
        this.table.search({
            button: button,
            ok: handler
        });
    }

    /**
     * 查询完成操作
     */
    protected onQuery(data: PageList<TViewModel>) {
    }

    /**
     * 删除
     * @param id 标识
     */
    delete(id?) {
        if (!this.table)
            return;
        this.table.delete({
            ids: id,
            ok: () => {
                this.onDelete();
            }
        });
    }

    /**
     * 删除后操作
     */
    protected onDelete() {
    }

    /**
     * 启用
     * @param ids 标识列表
     */
    enable(ids?) {
        if (!this.table)
            return;
        this.table.enable({
            ids: ids
        });
    }

    /**
     * 禁用
     * @param ids 标识列表
     */
    disable(ids?) {
        if (!this.table)
            return;
        this.table.disable({
            ids: ids
        });
    }

    /**
     * 勾选标识列表
     * @param checkedIds 要勾选的标识列表
     */
    checkIds(checkedIds?) {
        if (!this.table)
            return;
        if (checkedIds)
            this.checkedIds = checkedIds;
        this.table.checkIds(this.checkedIds);
    }

    /**
     * 刷新
     * @param button 按钮
     * @param handler 刷新后回调函数
     */
    refresh(button?, handler?: (data) => void) {
        if (!this.table)
            return;
        handler = handler || (items => this.onRefresh(items));
        this.queryParam = this.createQuery();
        this.table.refresh(this.queryParam, button, handler);
    }

    /**
     * 刷新完成操作
     */
    protected onRefresh(data) {
        this.checkIds();
    }

    /**
     * 刷新单个实体
     * @param model 实体对象
     */
    refreshByModel(model) {
        if (!this.table)
            return;
        this.table.refreshByModel(model);
    }

    /**
     * 选中行
     * @param node 节点
     * @param event 事件
     */
    selectRow(node, event?) {
        if (!this.table)
            return;
        this.table.selectRow(node);
        event && event.stopPropagation();
    }

    /**
     * 获取选中列表
     */
    getCheckedNodes() {
        if (!this.table)
            return null;
        return this.table.getChecked();
    }

    /**
     * 获取选中标识列表
     */
    getCheckedIds() {
        if (!this.table)
            return null;
        return this.table.getCheckedIds();
    }

    /**
     * 获取勾选的单个节点
     */
    getCheckedNode() {
        if (!this.table)
            return null;
        return this.table.getCheckedNode();
    }

    /**
     * 获取勾选的实体列表长度
     */
    getCheckedLength(): number {
        if (!this.table)
            return 0;
        return this.table.getCheckedLength();
    }

    /**
     * 获取创建框数据
     */
    protected getCreateData(data?) {
        return { parent: data };
    }

    /**
     * 是否勾选
     */
    isChecked() {
        if (!this.table)
            return false;
        return this.table.isChecked();
    }
}