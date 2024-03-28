//============== 表格设置组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import {
    ChangeDetectionStrategy, Component, Input, Injector, TemplateRef, ViewChild, Optional,
    ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap, map } from 'rxjs/operators';
import { NzCustomColumn, NzTheadComponent } from 'ng-zorro-antd/table';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { Util } from '../util';
import { AppConfig, initAppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';
import { ColumnInfo } from '../core/column-info';
import { TableInfo } from '../core/table-info';
import { TableSettingsServiceBase } from './table-settings.service';

/**
 * 表格设置组件
 */
@Component({
    selector: 'x-table-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table-settings.component.html',
    styles: [`
        .x-table-settings-dialog-container ::ng-deep .dialog-body {
           background-color:#80808014;
        }
        .x-table-settings-dialog ::ng-deep .ant-checkbox-wrapper:hover {
            background-color:#f8f8f8;
        }
        .x-table-settings-dialog ::ng-deep .ant-divider-horizontal {
            margin:14px 0;
        }
        .x-table-settings-dialog ::ng-deep .cdk-drag-preview {
            display: table;
        }
        .x-table-settings-dialog ::ng-deep .cdk-drag-placeholder {
            opacity: 0;
        }
        .x-table-settings-dialog .card-table-config {
            margin-bottom:16px;
        }
        .x-table-settings-dialog .card-table-config ::ng-deep .ant-card-body {
            padding-bottom: 0;
        }
    `]
})
export class TableSettingsComponent implements OnInit, OnDestroy {
    /**
     * 表格尺寸配置
     */
    tableSizeOptions = [
        { text: 'util.default', value: 'default', icon: 'table' },
        { text: 'util.small', value: 'small', icon: 'borderless-table' },
        { text: 'util.middle', value: 'middle', icon: 'border-outer' }
    ];

    /**
     * 对齐方式配置
     */
    tableAlignOptions = [
        { value: 'left', icon: 'align-left' },
        { value: 'center', icon: 'align-center' },
        { value: 'right', icon: 'align-right' }
    ];
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 清理对象
     */
    protected destroy$ = new Subject<void>();
    /**
     * 列宽变更对象
     */
    protected columnWidthChange$ = new BehaviorSubject<{ width: number, title: string }>(null);
    /** 
     * 全部选中
     */
    protected allChecked: boolean;
    /**
     * 选中中间状态
     */
    protected indeterminate: boolean;
    /**
     * 表格信息
     */
    protected info: TableInfo;
    /**
     * 初始表格信息
     */
    protected initInfo: TableInfo;
    /**
     * 表格设置对话框宽度
     */
    width;
    /**
     * 是否显示表格设置对话框
     */
    isVisible = false;
    /**
     * 是否隐藏表格配置区域,默认值: false
     */
    isHideTableConfig?: boolean;
    /**
     * 是否显示表格标题对齐设置下拉菜单
     */
    isTitleAlignVisible = false;
    /**
     * 是否显示表格对齐设置下拉菜单
     */
    isAlignVisible = false;
    /**
     * 是否显示自动省略设置下拉菜单
     */
    isEllipsisVisible = false;
    /**
     * 标题省略控件值
     */
    ellipsisValue = false;
    /**
     * 编辑列标识
     */
    editId;
    /**
     * 加载状态
     */
    loading: boolean;
    /**
     * 表格尺寸
     */
    size;
    /**
     * 是否显示表格边框
     */
    bordered;
    /**
     * 表格滚动宽高
     */
    scroll;
    /**
     * 自定义列集合
     */
    columns: NzCustomColumn[];
    /**
     * 生效的列信息集合
     */
    columnInfos: ColumnInfo[];
    /**
     * 是否树形表格
     */
    @Input() isTreeTable: boolean;
    /**
     * 存储键
     */
    @Input() key;
    /**
     * 是否启用固定列
     */
    @Input() enableFixedColumn: boolean;
    /**
     * 初始表格尺寸
     */
    @Input() initSize;
    /**
     * 初始表格边框
     */
    @Input() initBordered;
    /**
     * 初始表格滚动宽高度
     */
    @Input() initScroll;
    /**
     * 表格滚动宽度
     */
    @Input() scrollWidth;
    /**
     * 表格滚动高度
     */
    @Input() scrollHeight;
    /**
     * 初始设置的列集合
     */
    @Input() initColumns: ColumnInfo[];

    /**
     * 初始化表格设置组件
     * @param injector 注入器
     * @param config 应用配置
     * @param service 表格设置服务
     * @param cdr 变更检测
     */
    constructor(@Optional() injector: Injector, @Optional() protected config: AppConfig, protected service: TableSettingsServiceBase,
        protected cdr: ChangeDetectorRef) {
        initAppConfig(config);
        this.util = new Util(injector, config);
        this.size = config.table.tableSize;
        this.width = config.table.tableSettingsWidth;
        this.isHideTableConfig = config.table.isHideTableConfig;
        this.loading = false;
        this.isTreeTable = false;
        this.columnInfos = [];
        this.initResizeColumn();
    }

    /**
     * 初始化调整列宽
     */
    protected initResizeColumn() {
        this.columnWidthChange$.pipe(
            takeUntil(this.destroy$),
            filter(value => value !== null),
            tap(item => {
                this.info.columns = this.info.columns.map(column => {
                    return column.title === item.title ? { ...column, width: this.util.helper.toNumber(item.width, 0).toString() } : column;
                });
                this.handleWidthChange();
                this.restoreConfig();
            }),
            debounceTime(3000)
        ).subscribe(async item => {
            if (this.config.table.isResizeColumnSave)
                await this.save(this.info);
        });
    }

    /**
     * 列宽变化事件处理
     */
    handleWidthChange() {
        if (!this.info)
            return;
        let result = 0;
        for (var i = 0; i < this.info.columns.length; i++) {
            let item = this.info.columns[i];
            if (!item.enabled)
                continue;
            result += this.getWidthNumber(item.width);
        }
        this.info.width = result;
    }

    /**
     * 初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.loadInitColumns();
            this.backTableInfo();
            this.load();
            this.restoreConfig();
            this.cdr.markForCheck();
        }, 10);
    }

    /**
     * 清理
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * 备份初始表格信息
     */
    protected backTableInfo() {
        this.initInfo = new TableInfo();
        this.initInfo.size = this.initSize;
        this.initInfo.bordered = this.initBordered;
        this.initInfo.width = this.scrollWidth;
        this.initInfo.height = this.scrollHeight;
        this.initInfo.columns = this.util.helper.clone(this.initColumns);
    }

    /**
     * 加载表格配置
     */
    protected load() {
        this.loadTableInfo();
        this.initAllChecked();
        this.handleWidthChange();
    }

    /**
     * 初始化初始列信息集合
     */
    protected loadInitColumns() {
        this.initColumns = this.getInitColumns();
    }

    /**
     * 获取初始列信息集合
     */
    protected getInitColumns() {
        return this.initColumns
            .filter(item => item.title && (!item.acl || this.util.acl.can(item.acl)))
            .map(item => {
                item.enabled = true;
                return item;
            });
    }

    /**
     * 加载表格配置
     */
    protected loadTableInfo() {
        this.info = this.getTableInfo();
        if (!this.info) {
            this.info = new TableInfo();
            this.info.columns = [...this.initColumns];
        }
        this.info.size = this.info.size || this.initSize;
        if (this.util.helper.isUndefined(this.info.bordered))
            this.info.bordered = this.initBordered;
        this.info.width = this.info.width || this.scrollWidth;
        this.info.height = this.info.height || this.scrollHeight;
        this.loadTableColumns();
    }

    /**
     * 获取表格配置
     */
    protected getTableInfo() {
        return this.service.get(this.key);
    }

    /**
     * 加载表格列信息
     */
    protected loadTableColumns() {
        this.removeColumns();
        for (let i = 0; i < this.initColumns.length; i++) {
            let initColumn = this.initColumns[i];
            let infoColumn = this.info.columns.find(t => t.title === initColumn.title);
            if (infoColumn) {
                this.loadColumn(initColumn, infoColumn);
                continue;
            }
            this.insertColumn(initColumn, i);
        }
        this.initLines();
    }

    /**
     * 移除已经删除的列信息
     */
    protected removeColumns() {
        let removeColumns = this.info.columns.filter(item => !this.initColumns.some(t => t.title === item.title));
        this.util.helper.remove(this.info.columns, t => removeColumns.some(item => item.title === t.title));
    }

    /**
     * 加载表格列信息
     * @param initColumn 初始列信息
     * @param infoColumn 存储列信息
     */
    protected loadColumn(initColumn: ColumnInfo, infoColumn: ColumnInfo) {
        initColumn.enabled = infoColumn.enabled;
        infoColumn.width = this.getColumnWidth(infoColumn, initColumn);
        if (this.util.helper.isUndefined(infoColumn.fixWidth))
            infoColumn.fixWidth = initColumn.fixWidth;
        if (this.util.helper.isUndefined(infoColumn.left))
            infoColumn.left = initColumn.left;
        if (this.util.helper.isUndefined(infoColumn.right))
            infoColumn.right = initColumn.right;
        if (this.util.helper.isUndefined(infoColumn.titleAlign))
            infoColumn.titleAlign = initColumn.titleAlign || this.config.table.titleAlign;
        if (infoColumn.left)
            infoColumn.isDisableRight = true;
        if (infoColumn.right)
            infoColumn.isDisableLeft = true;
    }

    /**
     * 插入新加入的列信息
     * @param initColumn 初始列信息
     * @param index 索引
     */
    protected insertColumn(initColumn: ColumnInfo, index) {
        let column = this.util.helper.clone(initColumn);
        column.width = this.getWidthNumber(column.width).toString();
        if (column.left)
            column.isDisableRight = true;
        if (column.right)
            column.isDisableLeft = true;
        this.info.columns.splice(index, 0, column);
    }

    /**
     * 获取列宽
     */
    protected getColumnWidth(column: ColumnInfo, initColumn: ColumnInfo) {
        let result = column.width;
        if (!result)
            result = initColumn.width;
        return this.getWidthNumber(result).toString();
    }

    /**
     * 获取宽度
     */
    protected getWidthNumber(width: string): number {
        if (!width)
            width = this.config.table.defaultWidth;
        if (width.endsWith("%")) {
            width = this.util.helper.trimEnd(width, "%");
            return this.util.helper.toNumber(width) * 15;
        }
        if (width.endsWith("px"))
            width = this.util.helper.trimEnd(width, "px");
        if (this.util.helper.isNumber(width))
            return this.util.helper.toNumber(width);
        return 100;
    }

    /**
     * 初始化已选列行号
     */
    protected initLines() {
        let columns = this.info.columns.filter(t => t.enabled);
        for (let i = 0; i < columns.length; i++) {
            let item = columns[i];
            item.line = i + 1;
        }
    }

    /**
     * 初始化全选状态
     */
    protected initAllChecked() {
        if (this.initColumns.every(item => item.enabled)) {
            this.allChecked = true;
            this.indeterminate = false;
            return;
        }
        if (this.initColumns.every(item => !item.enabled)) {
            this.allChecked = false;
            this.indeterminate = false;
            return;
        }
        this.allChecked = false;
        this.indeterminate = true;
    }

    /**
     * 还原表格配置
     * @param info 表格配置
     */
    protected restoreConfig() {
        if (!this.info)
            return;
        if (this.info.size)
            this.size = this.info.size;
        this.bordered = this.info.bordered;
        this.scroll = this.getScroll();
        this.columns = [...this.toColumns(this.info.columns)];
        this.columnInfos = [...this.util.helper.clone(this.info.columns)];
    }

    /**
     * 获取表格滚动宽高
     */
    protected getScroll() {
        if (this.info.width && this.info.height)
            return { x: this.getSize(this.info.width), y: this.getSize(this.info.height) };
        if (this.info.width)
            return { x: this.getSize(this.info.width) };
        if (this.info.height)
            return { y: this.getSize(this.info.height) };
        return this.initScroll;
    }

    /**
     * 获取尺寸
     */
    protected getSize(value) {
        if (this.util.helper.isNumber(value))
            return `${value}px`;
        return value;
    }

    /**
     * 转换为ng zorro 自定义列
     */
    protected toColumns(columnInfos: ColumnInfo[]): NzCustomColumn[] {
        if (!columnInfos)
            return [];
        return columnInfos.map(column => <NzCustomColumn>{ value: column.title, default: column.enabled, width: this.getWidthNumber(column.width), fixWidth: this.getFixWidth(column) });
    }

    /**
     * 获取是否固定宽度
     */
    protected getFixWidth(column: ColumnInfo) {
        if (!this.util.helper.isUndefined(column.fixWidth))
            return column.fixWidth;
        if (column.left)
            return true;
        if (column.right)
            return true;
        return false;
    }

    /**
     * 显示表格设置弹出框
     */
    show() {
        this.loadInitColumns();
        this.load();
        this.isVisible = true;
        this.cdr.detectChanges();
    }

    /**
     * 全选变更事件处理
     */
    handleAllChecked() {
        if (this.allChecked) {
            this.handleInit();
            return;
        }
        this.initColumns = this.initColumns.map(item => ({ ...item, enabled: false }));
        this.info.columns = [...this.initColumns];
        this.indeterminate = false;
        this.info.width = 0;
    }

    /**
     * 列选中变更事件处理
     */
    handleChecked(item: ColumnInfo) {
        let column = this.info.columns.find(t => t.title === item.title);
        column.enabled = item.enabled;
        this.initLines();
        this.indeterminate = true;
        if (item.enabled) {
            if (this.initColumns.every(item => item.enabled)) {
                this.allChecked = true;
                this.indeterminate = false;
            }
            this.handleWidthChange();
            return;
        }
        if (this.initColumns.every(item => !item.enabled)) {
            this.allChecked = false;
            this.indeterminate = false;
        }
        this.handleWidthChange();
    }

    /**
     * 设置固定列事件处理
     */
    handleFixedColumn(column: ColumnInfo) {
        if (column.left) {
            this.fixLeftColumns(column);
            return;
        }
        if (column.right) {
            column.left = false;
            column.isDisableRight = false;
            column.isDisableLeft = true;
            return;
        }
        column.isDisableLeft = false;
        column.isDisableRight = false;
    }

    /**
     * 将前面所有列全部固定到左侧
     */
    protected fixLeftColumns(column: ColumnInfo) {
        let index = this.info.columns.findIndex(t => t.title === column.title);
        let columns = this.info.columns.filter((value, i) => i <= index);
        for (let i = 0; i < columns.length; i++)
            this.fixLeft(columns[i]);
    }

    /**
     * 固定到左侧
     */
    protected fixLeft(column: ColumnInfo) {
        column.left = true;
        column.right = false;
        column.isDisableLeft = false;
        column.isDisableRight = true;
    }

    /**
     * 取消事件处理
     */
    handleCancel() {
        this.isVisible = false;
    }

    /**
     * 重置事件处理
     */
    handleReset() {
        this.loadInitColumns();
        this.load();
        this.info.columns = [...this.info.columns];
    }

    /**
     * 恢复初始设置
     */
    handleInit() {
        this.loadInitColumns();
        this.info = this.util.helper.clone(this.initInfo);
        this.info.columns = this.info.columns.map(column => {
            return {
                ...column,
                width: this.getWidthNumber(column.width).toString(),
                titleAlign: column.titleAlign || this.config.table.titleAlign,
                isDisableLeft: column.right,
                isDisableRight: column.left
            };
        });
        this.initLines();
        this.initAllChecked();
        this.handleWidthChange();
    }

    /**
     * 确定事件处理
     */
    handleOk = async () => {
        if (!this.key) {
            this.util.message.error("表格配置存储标识未设置");
            return;
        }
        await this.save(this.info);
        this.restoreConfig();
        this.isVisible = false;
        this.util.message.info(I18nKeys.succeeded);
        this.cdr.markForCheck();
    }

    /**
     * 保存
     */
    protected save = async (info) => {
        this.loading = true;
        await this.service.save(this.key, info).finally(() => {
            this.loading = false;
        });
    }

    /**
     * 是否禁止拖动
     * @param index 列索引
     */
    isDragDisabled(index) {
        if (!this.isTreeTable)
            return false;
        if (index === 0)
            return true;
        return false;
    }

    /**
     * 拖拽事件处理
     */
    handleDropped(event: CdkDragDrop<any>) {
        let list: CdkDrag<ColumnInfo>[] = event.container.getSortedItems();
        let previous = list.find((v, i) => i === event.previousIndex);
        let current = list.find((v, i) => i === event.currentIndex);
        this.util.render.setStyle(previous.element, "left", "180px");
        let previousIndex = this.info.columns.findIndex(t => t.title === previous.data.title);
        let currentIndex = this.info.columns.findIndex(t => t.title === current.data.title);
        if (this.isTreeTable && (previousIndex === 0 || currentIndex === 0))
            return;
        moveItemInArray(this.info.columns, previousIndex, currentIndex);
        this.initLines();
    }

    /**
     * 调整尺寸事件处理
     */
    handleResize({ width }: NzResizeEvent, title: string) {
        this.columnWidthChange$.next({ width, title });
    }

    /**
     * 表格标题对齐方式变更事件处理
     * @param index 选中索引
     */
    handleTitleAlignChange(index) {
        if (!this.info)
            return;
        this.info.columns.forEach(item => {
            switch (index) {
                case 0:
                    item.titleAlign = 'left';
                    break;
                case 1:
                    item.titleAlign = 'center';
                    break;
                case 2:
                    item.titleAlign = 'right';
                    break;
            }
        });
        this.info.columns = [...this.info.columns];
        this.isTitleAlignVisible = false;
    }

    /**
     * 表格对齐方式变更事件处理
     * @param index 选中索引
     */
    handleAlignChange(index) {
        if (!this.info)
            return;
        this.info.columns.forEach(item => {
            switch (index) {
                case 0:
                    item.align = 'left';
                    break;
                case 1:
                    item.align = 'center';
                    break;
                case 2:
                    item.align = 'right';
                    break;
            }
        });
        this.info.columns = [...this.info.columns];
        this.isAlignVisible = false;
    }

    /**
     * 表格自动省略变更事件处理
     */
    handleEllipsisChange(value) {
        if (!this.info)
            return;
        this.info.columns.forEach(item => {
            item.ellipsis = value;
        });
        this.info.columns = [...this.info.columns];
        this.isEllipsisVisible = false;
    }

    /**
     * 启动单元格编辑
     * @param title 列标题
     * @param element 编辑组件
     */
    startEdit(title) {
        this.editId = title;
    }

    /**
     * 结束单元格编辑
     */
    stopEdit() {
        this.editId = null;
    }

    /**
     * 移除列
     */
    removeColumn(item: ColumnInfo) {
        let column = this.initColumns.find(t => t.title === item.title);
        column.enabled = false;
        this.handleChecked(column);
    }

    /**
     * 获取宽度
     * @param title 标题
     * @param defaultWidth 默认宽度
     */
    getWidth(title: string, defaultWidth) {        
        if (!this.columns)
            return defaultWidth;
        let column = this.columns.find(item => item.value == title);
        if (!column)
            return defaultWidth;
        return this.getPxWidth(column.width, defaultWidth, this.config.table.defaultWidth);
    }

    /**
     * 获取宽度
     */
    protected getPxWidth(width, defaultWidth = 0, defaultWidth2: any = 0) {
        if (!width)
            width = defaultWidth;
        if (!width)
            width = defaultWidth2;
        if (this.util.helper.isNumber(width))
            return `${width}px`
        if (width.endsWith("px"))
            return width;
        if (width.endsWith("%")) {
            width = this.util.helper.trimEnd(width, "%");
            width = this.util.helper.toNumber(width) * 15;
            return `${width}px`
        }
        return "0px";
    }

    /**
     * 是否固定到左边
     * @param title 标题
     */
    isLeft(title: string) {
        if (!this.columnInfos)
            return false;
        let column = this.columnInfos.find(t => t.title === title);
        if (!column)
            return false;
        if (!column.left)
            return false;
        let index = this.columnInfos.findIndex(t => t.title === title);
        let columns = this.columnInfos.filter((value, i) => i < index);
        let result = 0;
        for (let i = 0; i < columns.length; i++) {
            let item = columns[i];
            if (!item.enabled)
                continue;
            result += this.getWidthNumber(item.width);
        }
        return this.getPxWidth(result);
    }

    /**
     * 是否固定到右边
     * @param title 标题
     */
    isRight(title: string) {
        if (!this.columnInfos)
            return false;
        let column = this.columnInfos.find(t => t.title === title);
        if (!column)
            return false;
        if (!column.right)
            return false;
        let index = this.columnInfos.findIndex(t => t.title === title);
        let columns = this.columnInfos.filter((value, i) => i > index);
        let result = 0;
        for (let i = 0; i < columns.length; i++) {
            let item = columns[i];
            if (!item.enabled)
                continue;
            result += this.getWidthNumber(item.width);
        }
        return this.getPxWidth(result);
    }

    /**
     * 获取对齐方式
     * @param title 标题
     */
    getAlign(title: string) {
        let result = this.config.table.align;
        if (!this.columnInfos)
            return result;
        let column = this.columnInfos.find(t => t.title === title);
        if (!column)
            return result;
        if (column.align)
            return column.align;
        return result;
    }

    /**
     * 获取标题对齐方式
     * @param title 标题
     */
    getTitleAlign(title: string) {
        let result = this.config.table.titleAlign;
        if (!this.columnInfos)
            return result;
        let column = this.columnInfos.find(t => t.title === title);
        if (!column)
            return result;
        if (column.titleAlign)
            return column.titleAlign;
        return result;
    }

    /**
     * 获取自动省略
     * @param title 标题
     */
    getEllipsis(title: string) {
        if (!this.info)
            return false;
        if (!this.columnInfos)
            return false;
        let column = this.columnInfos.find(t => t.title === title);
        if (!column)
            return false;
        if (column.ellipsis)
            return column.ellipsis;
        return false;
    }
}