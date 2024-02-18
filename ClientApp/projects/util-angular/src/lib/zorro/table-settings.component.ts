//============== 表格设置组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, Optional, ChangeDetectorRef, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import { Util } from '../util';
import { AppConfig, initAppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * 自定义列
 */
interface CustomColumn extends NzCustomColumn {
    /**
     * 访问控制
     */
    acl: string;
}

/**
 * 表格设置组件
 */
@Component({
    selector: 'x-table-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table-settings.component.html'
})
export class TableSettingsComponent implements OnInit {
    /**
     * 操作入口
     */
    private util: Util;
    /**
     * 是否显示
     */
    isVisible = false;
    /** 
     * 全部选中
     */
    allChecked: boolean;
    /**
     * 选中中间状态
     */
    indeterminate: boolean;
    /**
     * 列集合
     */
    columns: NzCustomColumn[];
    /**
     * 临时列集合
     */
    private tempColumns: NzCustomColumn[];
    /**
     * 标识
     */
    @Input() customColumnKey: string;
    /**
     * 初始设置的列集合
     */
    @Input() initColumns: CustomColumn[];

    /**
     * 初始化表格设置组件
     * @param config 应用配置
     */
    constructor(@Optional() protected config: AppConfig, private cdr: ChangeDetectorRef) {
        initAppConfig(config);
        this.util = new Util(null, config);
    }

    /**
     * 初始化
     */
    ngOnInit() {
        setTimeout(() => {
            this.loadColumns();
        }, 10);
    }

    /**
     * 加载自定义列集合
     */
    private loadColumns() {
        let initColumns = this.getInitColumns();
        let storeColumns = this.getColumnsFromStore();
        if (!storeColumns || storeColumns.length === 0) {
            this.initColumns = [...initColumns];
            return;
        }
        for (let i = 0; i < initColumns.length; i++) {
            let item = initColumns[i];
            let column = storeColumns.find(t => t.value === item.value);
            if (column) {
                item.default = column.default;
                continue;
            }
            storeColumns.splice(i, 0, item);
        }
        this.columns = [...storeColumns];
        this.tempColumns = [...storeColumns];
        this.initColumns = [...initColumns];
    }

    /**
     * 从浏览器本地获取自定义列集合
     */
    private getColumnsFromStore() {
        return this.util.storage.getLocalItem<NzCustomColumn[]>(this.getKey());
    }

    /**
     * 获取存储标识
     */
    private getKey() {
        return `${this.customColumnKey}_${this.getUserId()}`;
    }

    /**
     * 获取用户标识
     */
    private getUserId() {
        let userId = this.util.session.userId;
        return userId ? userId : '';
    }

    /**
     * 获取初始自定义列集合
     */
    private getInitColumns() {
        return this.initColumns
            .filter(item => !item.acl || this.util.acl.can(item.acl))
            .map(item => {
                item.default = true;
                return item;
            });
    }    

    /**
     * 显示表格设置弹出框
     */
    show() {
        this.loadColumns();
        this.loadTempColumns();
        this.allChecked = true;
        this.indeterminate = false;
        this.isVisible = true;
        this.cdr.detectChanges();
    }

    /**
     * 加载临时自定义列集合
     */
    private loadTempColumns() {
        if (this.tempColumns && this.tempColumns.length > 0)
            return;
        this.tempColumns = [...this.getInitColumns()];
    }

    /**
     * 全选变更事件处理
     */
    handleAllChecked() {
        this.indeterminate = false;
        if (this.allChecked) {
            this.initColumns = this.initColumns.map(item => ({ ...item, default: true }));
            this.tempColumns = [...this.initColumns];
        }
        else {
            this.initColumns = this.initColumns.map(item => ({ ...item, default: false }));
            this.tempColumns = [...this.initColumns];
        }
    }

    /**
     * 列选中变更事件处理
     */
    handleChecked(item: CustomColumn) {
        let temp = this.tempColumns.find(t => t.value === item.value);
        temp.default = item.default;
        this.indeterminate = true;
        if (item.default) {
            if (this.initColumns.every(item => item.default)) {
                this.allChecked = true;
                this.indeterminate = false;
            }
            return;
        }
        if (this.initColumns.every(item => !item.default)) {
            this.allChecked = false;
            this.indeterminate = false;
        }
    }

    /**
     * 取消事件处理
     */
    handleCancel() {
        this.isVisible = false;
    }

    /**
     * 确定事件处理
     */
    handleOk() {
        if (!this.customColumnKey) {
            this.util.message.error("自定义列标识未设置");
            return;
        }
        this.saveToStorage(this.tempColumns);
        this.columns = [...this.tempColumns];
        this.isVisible = false;
        this.util.message.info(I18nKeys.succeeded);
    }

    /**
     * 保存到浏览器本地存储
     */
    private saveToStorage(columns) {
        const key = this.getKey();
        this.util.storage.setLocalItem(key, columns, 36000000);
    }

    /**
     * 拖拽事件处理
     */
    handleDropped(event: CdkDragDrop<any>) {
        let list: CdkDrag<NzCustomColumn>[] = event.container.getSortedItems();
        let previous = list.find((v, i) => i === event.previousIndex);
        let current = list.find((v, i) => i === event.currentIndex);
        let previousIndex = this.tempColumns.findIndex(t => t.value === previous.data.value);
        let currentIndex = this.tempColumns.findIndex(t => t.value === current.data.value);
        moveItemInArray(this.tempColumns, previousIndex, currentIndex);
    }
}

