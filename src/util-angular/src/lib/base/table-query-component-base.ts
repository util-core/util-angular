//================ 表格查询基类 ==================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, ViewChild, Component, AfterViewInit } from '@angular/core';
import { ViewModel } from "../core/view-model";
import { QueryParameter } from "../core/query-parameter";
import { QueryComponentBase } from "./query-component-base";
import { TableExtendDirective } from "../zorro/table-extend.directive";

/**
 * 表格查询基类
 */
@Component({
    template: ''
})
export abstract class TableQueryComponentBase<TViewModel extends ViewModel, TQuery extends QueryParameter> extends QueryComponentBase<TQuery> implements AfterViewInit {
    /**
     * 表格扩展指令
     */
    @ViewChild(TableExtendDirective) protected table: TableExtendDirective<TViewModel>;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
    }

    /**
     * 视图加载完成
     */
    ngAfterViewInit() {
        if (!this.table)
            return;
        this.table.loadAfter = result => {
            this.onLoad(result);
        }
    }

    /**
     * 数据加载完成操作
     * @param result 结果
     */
    onLoad(result) {
    }

    /**
     * 查询
     * @param button 按钮
     */
    query(button?) {
        if (!this.table)
            return;
        this.table.query({
            button: button,
            page: 1
        });
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
     * @param data 数据
     */
    protected onRefresh(data) {
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
     * 清空复选框
     */
    clearCheckboxs() {
        if (!this.table)
            return;
        this.table.clearChecked();
    }

    /**
     * 获取勾选的实体列表
     */
    getCheckedNodes() {
        if (!this.table)
            return [];
        return this.table.getChecked();
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
     * 获取勾选的实体标识列表
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
     * 是否勾选
     */
    isChecked() {
        if (!this.table)
            return false;
        return this.table.isChecked();
    }
}
