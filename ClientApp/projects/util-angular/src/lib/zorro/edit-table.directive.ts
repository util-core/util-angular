//============== NgZorro表格编辑扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===========================================================
import { Directive, HostListener, Input, Optional } from '@angular/core';
import { TableExtendDirective } from "./table.extend.directive";
import { EditRowDirective } from "./edit-row.directive";
import { Util } from "../util";
import { HttpMethod } from '../http/http-method';
import { AppConfig, initAppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro表格编辑扩展指令
 */
@Directive({
    selector: '[x-edit-table]',
    exportAs: 'xEditTable'
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
     * 初始化编辑表格扩展指令
     * @param table 表格扩展指令
     * @param config 应用配置
     */
    constructor(private table: TableExtendDirective<any>, @Optional() protected config: AppConfig) {
        this.initAppConfig();
        this.util = new Util(null, this.config);
        this.dblClickStartEdit = true;
        this.rows = new Map<string, EditRowDirective>();
        this.creationIds = [];
        this.updateIds = [];
        this.removeRows = [];
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
     * 处理全局点击事件
     */
    @HostListener('document:click')
    handleClick() {
        if (!this.validate())
            return;
        this.clearEditRow();
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
                setTimeout(() => this.focusToFirst(), 0);
            }
        }), 0);
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
        this.editId = rowId;
        this.currentRow = row;
        options.after && options.after(row);
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
        result.forEach(item => {
            if (this.creationIds.some(id => id === item.id)) {
                this.util.helper.remove(this.creationIds, id => id === item.id);
                return;
            }
            this.util.helper.remove(this.updateIds, id => id === item.id);
            this.removeRows.push(item);
        });
    }

    /**
     * 清理
     */
    clear() {
        this.clearEditRow();
        this.rows.clear();
        this.creationIds = [];
        this.updateIds = [];
        this.removeRows = [];
    }

    /**
     * 清空编辑行
     */
    clearEditRow() {
        this.editId = null;
        this.currentRow = null;
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
        confirm?:string,
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
    } ) {
        if (!options)
            return;
        if (!this.validate())
            return;
        let url = options.url || this.saveUrl || this.getUrl(this.table.url, "save" );
        if (!url) {
            console.log("表格编辑saveUrl未设置");
            return;
        }
        let data = this.createSaveData(options.createData);
        if (!data)
            return;
        if (!this.isDirty(data, options.isDirty)) {
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
                options.ok && options.ok( result );
                this.table.query( {
                    ok: result => {
                        if ( result.page > result.pageCount ) {
                            this.table.query( {
                                page: result.page - 1
                            } );
                        }
                    }
                } );
            }
        });
    }

    /**
     * 获取地址
     */
    private getUrl(url: string, path: string = null) {
        return this.util.helper.getUrl(url, null, path);
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
    private isDirty(data, handler: (data) => boolean) {
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

