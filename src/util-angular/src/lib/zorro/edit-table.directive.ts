//============== NgZorro表格编辑扩展指令 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===========================================================
import { Directive, Input, Self, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TableExtendDirective } from "./table-extend.directive";
import { EditRowDirective } from "./edit-row.directive";
import { Util } from "../util";
import { HttpMethod } from '../http/http-method';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro表格编辑扩展指令
 */
@Directive({
    selector: '[x-edit-table]',
    exportAs: 'xEditTable',
    standalone: true
})
export class EditTableDirective {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 编辑行标识
     */
    editId;
    /**
     * 当前编辑行
     */
    private currentRow: EditRowDirective;
    /**
     * 编辑行集合
     */
    private rows: Map<string, EditRowDirective>;
    /**
     * 创建标识列表
     */
    private creationIds: string[];
    /**
     * 更新标识列表
     */
    private updateIds: string[];
    /**
     * 移除行数据列表
     */
    private removeRows: any[];
    /**
     * 保存地址
     */
    @Input() saveUrl: string;
    /**
     * 是否双击启动行编辑
     */
    @Input() dblClickStartEdit: boolean;
    /**
     * 是否批量编辑, false表示单行编辑模式
     */
    @Input() isBatch: boolean;

    /**
     * 初始化编辑表格扩展指令
     * @param table 表格扩展指令
     * @param element 表格元素
     * @param cdr 变更检测
     */
    constructor(private table: TableExtendDirective<any>, @Self() private element: ElementRef, private cdr: ChangeDetectorRef) {
        this.util = table.util;
        this.dblClickStartEdit = true;
        this.rows = new Map<string, EditRowDirective>();
        this.creationIds = [];
        this.updateIds = [];
        this.removeRows = [];
    }

    /**
     * 注册编辑行
     * @param rowId 行标识
     * @param row 编辑行
     */
    register(rowId, row: EditRowDirective) {
        if (!rowId || !row)
            return;
        if (this.rows.has(rowId))
            return;
        this.rows.set(rowId, row);
        row.onChange.subscribe(id => this.handleEditChange(id));
    }

    /**
     * 处理行编辑事件
     * @param rowId 行标识
     */
    private handleEditChange(rowId) {
        if (this.creationIds.some(id => id === rowId))
            return;
        if (this.updateIds.some(id => id === rowId))
            return;
        this.updateIds.push(rowId);
    }

    /**
     * 注销编辑行
     * @param rowId 行标识
     */
    unRegister(rowId) {
        if (!rowId)
            return;
        if (!this.rows.has(rowId))
            return;        
        let row = this.rows.get(rowId);
        row.onChange.unsubscribe();
        this.rows.delete(rowId);
    }

    /**
     * 验证
     */
    validate() {
        if (this.isValid())
            return true;
        this.currentRow.focusToInvalid();
        return false;
    }

    /**
     * 是否验证通过
     */
    isValid() {
        if (!this.currentRow)
            return true;
        return this.currentRow.isValid();
    }

    /**
     * 是否新增
     */
    isNew() {
        if (!this.currentRow)
            return true;
        return this.currentRow.isNew;
    }

    /**
     * 是否编辑状态
     * @param rowId 行标识
     */
    isEdit(rowId) {
        if (!rowId)
            return false;
        if (this.editId === rowId)
            return true;
        return false;
    }

    /**
     * 添加行
     * @param options 参数
     */
    addRow(options: {
        /**
         * 行数据
         */
        row,
        /**
         * 添加前操作，返回 false 阻止添加
         */
        before?: (row) => boolean,
    }) {
        event && event.stopPropagation();
        if (!options)
            return;
        if (!this.validate())
            return;
        let row = options.row;
        if (!row)
            return;
        this.initRow(row);
        if (options.before && !options.before(row))
            return;
        if (this.creationIds.some(id => id === row.id))
            return;
        this.creationIds.push(row.id);
        this.table.addRow(row);
        setTimeout(() => this.editRow({
            rowId: row.id,
            after: (row: EditRowDirective) => {
                if (row)
                    row.isNew = true;
                this.focusToFirst();
            }
        }), 100);
    }

    /**
     * 初始化行
     * @param row 行
     */
    protected initRow(row) {
        if (row.id)
            return;
        row.id = this.util.helper.uuid();
    }

    /**
     * 设置焦点到第一个组件
     */
    focusToFirst() {
        if (!this.currentRow)
            return;
        this.currentRow.focusToFirst();
    }

    /**
     * 编辑行
     * @param options 参数
     */
    editRow(options: {
        /**
         * 行标识
         */
        rowId,
        /**
         * 编辑前操作，返回 false 阻止编辑
         */
        before?: (row) => boolean,
        /**
         * 编辑后操作
         */
        after?: (row) => void,
    }) {
        if (!options)
            return;
        event && event.preventDefault();
        event && event.stopPropagation();
        let rowId = options.rowId || options;
        if (!rowId)
            return;
        if (!this.rows.has(rowId))
            return;
        let row = this.rows.get(rowId);
        if (options.before && !options.before(row))
            return;
        if (!this.validate())
            return;
        if (!this.isBatch) {
            this.saveDirty(options, rowId, row);
            return;
        }
        this.setCurrentRow(options, rowId, row);
    }

    /**
     * 保存已修改状态
     */
    private saveDirty(options, rowId, row) {
        if (rowId === this.editId || !this.isDirty()) {
            this.setCurrentRow(options, rowId, row);
            return;
        }
        this.saveRow({
            confirm: I18nKeys.saveDirtyConfirmation,
            complete: () => {
                this.setCurrentRow(options, rowId, row);
                this.focusToFirst();
            }
        });
    }

    /**
     * 设置当前行
     */
    private setCurrentRow(options,rowId,row) {
        this.editId = rowId;
        this.currentRow = row;
        options.after && options.after(row);
        this.cdr.markForCheck();
    }

    /**
     * 单击编辑
     * @param id 行标识
     */
    clickEdit(rowId) {
        if (this.dblClickStartEdit && !this.currentRow)
            return;
        this.editRow(rowId);
    }

    /**
     * 双击编辑
     * @param rowId 行标识
     */
    dblClickEdit(rowId) {
        this.editRow(rowId);
    }

    /**
     * 移除行
     * @param rowId 行标识
     */
    remove(rowId?) {
        let ids = [];
        if (rowId)
            ids.push(rowId);
        let result = this.table.removeRows(ids);
        if (!result)
            return;
        if (!this.isBatch)
            return;
        result.forEach(item => {
            if (this.creationIds.some(id => id === item.id)) {
                this.util.helper.remove(this.creationIds, id => id === item.id);
                this.cdr.markForCheck();
                return;
            }
            this.util.helper.remove(this.updateIds, id => id === item.id);
            this.removeRows.push(item);
            this.cdr.markForCheck();
        });
    }

    /**
     * 清理
     */
    clear() {        
        this.creationIds = [];
        this.updateIds = [];
        this.removeRows = [];
        this.clearEditRow();
    }

    /**
     * 清理编辑行指令集合
     */
    clearRows() {
        this.rows.clear();
    }

    /**
     * 取消编辑状态
     */
    unedit() {
        if (!this.currentRow)
            return;        
        if (this.currentRow.isValid()) {
            this.clearEditRow();
            return;
        }
        if (this.currentRow.isNew) {
            this.remove(this.editId);
            this.clearEditRow();
            return;
        }
        this.currentRow.focusToInvalid();
    }

    /**
     * 清空编辑行
     */
    clearEditRow() {
        this.editId = null;
        this.currentRow = null;
        this.cdr.markForCheck();
    }

    /**
     * 保存单行
     * @param options 参数
     */
    saveRow(options?: {
        /**
         * 按钮
         */
        button?,
        /**
         * 服务端Api地址
         */
        url?: string,
        /**
         * 确认消息,
         */
        confirm?: string,
        /**
         * 保存前操作，返回 false 阻止保存
         */
        before?: (data) => boolean,
        /**
         * 保存成功回调函数
         */
        ok?: (result) => void;
        /**
         * 完成回调函数
         */
        complete?: () => void;
    }) {
        if (!options)
            return;
        if (!this.validate())
            return;
        let url = this.getSaveRowUrl(options.url);
        if (!url) {
            console.log("表格编辑saveUrl未设置");
            return;
        }
        let data = this.currentRow.data;
        if (!data)
            return;
        if (!this.isDirty()) {
            if (this.util.config.table.isShowNoNeedSaveMessage)
                this.util.message.warn(I18nKeys.noNeedSave);
            return;
        }
        this.util.form.submit({
            url: url,
            data: data,
            httpMethod: this.getSaveRowHttpMethod(options.url),
            button: options.button,
            confirm: options.confirm,
            before: data => options.before && options.before(data),
            ok: result => {
                this.clear();
                options.ok && options.ok(result);
            },
            complete: options.complete
        });
    }

    /**
     * 获取保存单行地址
     */
    private getSaveRowUrl(url) {
        if (url)
            return url;
        if (this.saveUrl)
            return this.saveUrl;
        if (!this.table.url)
            return null;
        if (this.isNew)
            return this.table.url;
        return this.getUrl(this.table.url, this.editId);
    }

    /**
     * 获取保存单行HttpMethod
     */
    private getSaveRowHttpMethod(url) {
        if (url || this.saveUrl)
            return HttpMethod.Post;
        return this.isNew() ? HttpMethod.Post : HttpMethod.Put;
    }

    /**
     * 保存
     * @param options 参数
     */
    save(options?: {
        /**
         * 按钮
         */
        button?,
        /**
         * 服务端Api地址
         */
        url?: string,
        /**
         * 确认消息,
         */
        confirm?: string,
        /**
         * 创建保存参数
         */
        createData?: (data) => any,
        /**
         * 是否已修改
         *
         */
        isDirty?: (data) => boolean,
        /**
         * 保存前操作，返回 false 阻止保存
         */
        before?: (data) => boolean,
        /**
         * 保存成功回调函数
         */
        ok?: (result) => void;
        /**
         * 完成回调函数
         */
        complete?: () => void;
    }) {
        if (!options)
            return;
        if (!this.validate())
            return;
        let url = options.url || this.saveUrl || this.getUrl(this.table.url, "save");
        if (!url) {
            console.log("表格编辑saveUrl未设置");
            return;
        }
        let data = this.createSaveData(options.createData);
        if (!data)
            return;
        if (!this.isDirty(data, options.isDirty)) {
            if (this.util.config.table.isShowNoNeedSaveMessage)
                this.util.message.warn(I18nKeys.noNeedSave);
            return;
        }
        if (options.before && !options.before(data))
            return;
        this.processData(data);
        this.util.form.submit({
            httpMethod: HttpMethod.Post,
            url: url,
            data: data,
            button: options.button,
            confirm: options.confirm,
            ok: result => {
                this.clear();
                options.ok && options.ok(result);
                this.table.query({
                    ok: result => {
                        if (result.page > result.pageCount) {
                            this.table.query({
                                page: result.page - 1
                            });
                        }
                    }
                });
            },
            complete: options.complete
        });
    }

    /**
     * 获取地址
     */
    private getUrl(url: string, path: string = null) {
        return this.util.helper.joinUrl(url, path);
    }

    /**
     * 创建保存操作参数
     */
    private createSaveData(createData: (data) => any) {
        let result = {
            creationList: this.table.getByIds(this.creationIds),
            updateList: this.table.getByIds(this.updateIds),
            deleteList: this.removeRows
        };
        if (!createData)
            return result;
        return createData(result);
    }

    /**
     * 是否已修改
     */
    private isDirty(data?, handler?: (data) => boolean) {
        if (!this.isBatch)
            return this.creationIds.some(id => id === this.editId) || this.updateIds.some(id => id === this.editId);
        if (data.creationList && data.creationList.length > 0)
            return true;
        if (data.updateList && data.updateList.length > 0)
            return true;
        if (data.deleteList && data.deleteList.length > 0)
            return true;
        return handler && handler(data);
    }

    /**
     * 处理数据
     */
    private processData(data) {
        if (data.creationList)
            data.creationList = this.util.helper.toJson(data.creationList);
        if (data.updateList)
            data.updateList = this.util.helper.toJson(data.updateList);
        if (data.deleteList)
            data.deleteList = this.util.helper.toJson(data.deleteList);
    }
}

