﻿//================ 表格编辑基类 ==================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Component, ViewChild } from '@angular/core';
import { ViewModel } from "../core/view-model";
import { QueryParameter } from "../core/query-parameter";
import { EditTableDirective } from "../zorro/edit-table.directive";
import { TableQueryComponentBase } from "./table-query-component-base";

/**
 * 表格编辑基类
 */
@Component({
    template: ''
})
export abstract class TableEditComponentBase<TViewModel extends ViewModel, TQuery extends QueryParameter> extends TableQueryComponentBase<TViewModel, TQuery> {
    /**
     * 表格编辑扩展指令
     */
    @ViewChild(EditTableDirective) protected editTable: EditTableDirective;

    /**
     * 初始化表格编辑组件
     */
    constructor() {
        super();
    }

    /**
     * 添加行
     */
    add() {
        if (!this.editTable)
            return;
        this.editTable.addRow({
            row: this.createModel(),
            before: row => this.onAddBefore(row)
        });
    }

    /**
     * 创建参数
     */
    protected createModel(): TViewModel {
        return <TViewModel>{};
    }

    /**
     * 添加前操作，返回 false 阻止添加
     * @param row 行参数
     */
    onAddBefore(row): boolean {
        return true;
    }

    /**
     * 是否编辑状态
     * @param id 标识
     */
    isEdit(id) {
        if (!this.editTable)
            return false;
        return this.editTable.isEdit(id);
    }

    /**
     * 编辑行
     * @param id 行标识
     */
    edit(id) {
        if (!this.editTable)
            return;
        this.editTable.editRow({
            rowId: id,
            after: () => this.editTable.focusToFirst()
        });
    }

    /**
     * 取消编辑状态
     */
    unedit() {
        if (!this.editTable)
            return;
        this.editTable.unedit();
    }

    /**
     * 移除行
     * @param id 标识
     */
    remove(id?) {
        if (!this.editTable)
            return;
        this.editTable.remove(id);
    }

    /**
     * 刷新
     * @param button 按钮
     * @param handler 刷新后回调函数
     */
    refresh(button?, handler?: (data) => void) {
        super.refresh(button, handler);
        if (!this.editTable)
            return;
        this.editTable.clear();
    }

    /**
     * 保存单行
     * @param button 按钮
     */
    saveRow(button?) {
        if (!this.editTable)
            return;
        this.editTable.saveRow({
            button: button,
            confirm: this.getConfirm(),
            before: data => this.onSaveBefore(data),
            ok: result => this.onSave(result),
            url: this.getSaveUrl()
        });
    }

    /**
     * 保存
     * @param button 按钮
     */
    save(button?) {
        if (!this.editTable)
            return;
        this.editTable.save({
            button: button,
            confirm: this.getConfirm(),
            createData: data => this.createData(data),
            isDirty: (data) => this.isDirty(data),
            before: data => this.onSaveBefore(data),
            ok: result => this.onSave(result),
            url: this.getSaveUrl()
        });
    }

    /**
     * 获取确认消息
     */
    protected getConfirm() {
        return null;
    }

    /**
     * 创建保存参数
     * @param data 保存参数
     */
    protected createData(data) {
        return data;
    }

    /**
     * 是否已修改，返回 false 阻止添加
     * @param data 保存参数
     */
    protected isDirty(data) {
        return false;
    }

    /**
     * 保存前操作，返回 false 阻止添加
     * @param data 保存参数
     */
    protected onSaveBefore(data) {
        return true;
    }

    /**
     * 保存成功操作
     * @param result 结果
     */
    protected onSave(result) {
    }

    /**
     * 获取保存地址
     */
    protected getSaveUrl() {
        return null;
    }

    /**
     * 删除
     * @param id 标识
     */
    delete(id?) {
        if (!this.table)
            return;
        if (!this.editTable)
            return;
        this.table.delete({
            ids: id,
            ok: () => {
                this.editTable.clear();
                this.onDelete();
            }
        });
    }
}