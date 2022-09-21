//================ 表格查询基类 ==================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, ViewChild, Injectable, AfterViewInit, forwardRef } from '@angular/core';
import { ViewModel } from "../core/view-model";
import { QueryParameter } from "../core/query-parameter";
import { QueryComponentBase } from "./query-component-base";
import { TableExtendDirective } from "../zorro/table.extend.directive";

/**
 * 表格查询基类
 */
@Injectable()
export abstract class TableQueryComponentBase<TViewModel extends ViewModel, TQuery extends QueryParameter> extends QueryComponentBase implements AfterViewInit {
    /**
     * 查询参数
     */
    queryParam: TQuery;
    /**
     * 表格扩展指令
     */
    @ViewChild(forwardRef(() => TableExtendDirective), { "static": true }) protected table: TableExtendDirective<TViewModel>;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
        this.queryParam = this.createQuery();
    }

    /**
     * 创建查询参数
     */
    protected createQuery(): TQuery {
        return <TQuery>new QueryParameter();
    }

    /**
     * 视图加载完成
     */
    ngAfterViewInit() {
        if (!this.table)
            return;
        this.table.loadAfter = result => {
            this.loadAfter(result);
        }
    }

    /**
     * 数据加载完成操作
     * @param result
     */
    loadAfter(result) {
    }

    /**
     * 查询
     * @param button 按钮
     */
    query(button?) {
        this.table.query({
            button: button,
            page: 1
        });
    }

    /**
     * 延迟搜索
     * @param button 按钮
     */
    search(button?) {
        this.table.search({
            button: button,
            delay: this.getDelay()
        });
    }

    /**
     * 删除
     * @param button 按钮
     * @param id 标识
     */
    delete(id?) {
        this.table.delete({
            ids: id,
            handler: () => {
                this.deleteAfter();
            }
        });
    }

    /**
     * 删除后操作
     */
    protected deleteAfter = () => {
    }

    /**
     * 刷新
     * @param button 按钮
     * @param handler 刷新后回调函数
     */
    refresh(button?, handler?: (data) => void) {
        handler = handler || this.refreshAfter;
        this.queryParam = this.createQuery();
        this.table.refresh(this.queryParam, button, handler);
    }

    /**
     * 刷新完成后操作
     */
    protected refreshAfter = data => {
    }

    /**
     * 清空复选框
     */
    clearCheckboxs() {
        this.table.clearChecked();
    }

    /**
     * 获取勾选的实体列表
     */
    getCheckedNodes() {
        return this.table.getChecked();
    }

    /**
     * 获取勾选的实体列表长度
     */
    getCheckedLength(): number {
        return this.table.getCheckedLength();
    }

    /**
     * 获取勾选的实体标识列表
     */
    getCheckedIds() {
        return this.table.getCheckedIds();
    }

    /**
     * 获取勾选的单个节点
     */
    getCheckedNode() {
        return this.table.getCheckedNode();
    }
}
