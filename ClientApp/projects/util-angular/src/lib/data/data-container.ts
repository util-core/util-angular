//============== 数据容器 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//==================================================
import { SelectionModel } from '@angular/cdk/collections';
import { Util } from '../util';
import { IKey } from "../core/key";

/**
 * 数据容器
 */
export class DataContainer<TModel extends IKey> {
    /**
     * 多选列表
     */
    checkedSelection: SelectionModel<TModel>;
    /**
     * 单选列表
     */
    selectedSelection: SelectionModel<TModel>;
    /**
     * 总行数
     */
    total: number;
    /**
     * 数据
     */
    data: TModel[];
    /**
     * 数据是否全部加载完成
     */
    isLoadCompleted: boolean;

    /**
     * 初始化数据容器
     * @param util 操作入口
     */
    constructor(private util: Util) {
        this.checkedSelection = new SelectionModel<TModel>(true, []);
        this.selectedSelection = new SelectionModel<TModel>(false, []);
        this.total = 0;
        this.data = new Array<TModel>();
    }

    /**
     * 设置数据
     * @param models 数据列表
     * @param total 总行数
     */
    setData(models: TModel[], total?: number) {
        this.clear();
        this.data = models || new Array<TModel>();
        this.total = total;
    }

    /**
     * 添加数据
     * @param models 数据列表
     */
    addData(models: TModel[]) {
        if (this.util.helper.isEmptyArray(models)) {
            this.isLoadCompleted = true;
            return;
        }
        let result = [];
        models.forEach(model => {
            if( this.exists(model) )
                return;
            result.push(model);
        });
        this.data = [...this.data, ...result];
    }

    /**
     * 更新数据
     * @param model 对象
     */
    updateData(model: TModel) {
        if (!model)
            return;
        let item = this.data.find(t => t.id === model.id);
        if (!item)
            return;
        let index = this.data.indexOf(item);
        this.data[index] = model;
    }

    /**
     * 移除数据
     * @param items 标识列表或对象列表
     */
    removeData(items: string | any[]) {
        if (!items)
            return;
        let ids = <any[]>items;
        if (this.util.helper.isString(ids))
            ids = this.util.helper.toArray(<string>items);
        if (ids.length === 0)
            return;
        ids = ids.map(t => t.id || t);
        let result = this.util.helper.remove(this.data, item => ids.findIndex(id => item.id === id) > -1);
        this.selectedSelection.deselect(...result);
        this.checkedSelection.deselect(...result);
        this.total = this.total - result.length;
    }

    /**
     * 刷新数据,如果已存在则替换,不存在则添加到集合起始位置
     * @param models 数据列表
     */
    refreshData(...models: TModel[]) {
        if (this.util.helper.isEmptyArray(models))
            return;
        models.forEach(model => {
            if (this.exists(model)) {
                this.updateData(model);
                return;
            }
            this.util.helper.insert(this.data, model, 0);
            this.total = this.total + 1;
        });
    }

    /**
     * 是否包含数据
     */
    hasData() {
        return this.data && this.data.length > 0;
    }

    /**
     * 通过标识判断是否存在
     * @param id 标识或对象
     */
    exists(id): boolean {
        if (!id)
            return false;
        id = id.id || id;
        return this.data.some(item => item.id === id);
    }

    /**
     * 获取勾选的实体列表
     */
    getChecked(): TModel[] {
        if (!this.data)
            return [];
        return this.data.filter(item => this.isChecked(item));
    }

    /**
     * 获取勾选的标识列表
     */
    getCheckedIds(): string {
        return this.checkedSelection.selected.map(value => value.id).join(",");
    }

    /**
     * 获取勾选的实体
     */
    getCheckedItem(): TModel {
        let list = this.getChecked();
        if (!list || list.length === 0)
            return null;
        return list[0];
    }

    /**
     * 获取勾选的数量
     */
    getCheckedLength(): number {
        return this.getChecked().length;
    }

    /**
     * 获取选择的实体
     */
    getSelected(): TModel {
        if (!this.data)
            return null;
        let items = this.data.filter(item => this.isSelected(item));
        if (items && items.length > 0)
            return items[0];
        return null;
    }

    /**
     * 通过标识列表查找实体集合
     * @param ids 标识列表
     */
    getByIds(ids: string[]): TModel[] {
        if (!ids || ids.length === 0)
            return [];
        return this.data.filter(item => ids.some(id => id === item.id));
    }

    /**
     * 通过标识查找
     * @param id 标识
     */
    getById(id: string): TModel {
        if (!id)
            return null;
        return this.data.find(item => item.id === id);
    }

    /**
     * 勾选标识列表
     */
    checkIds(ids) {
        if (!ids)
            return;
        if (!ids.some) {
            let item = this.data.find(data => data.id === ids);
            this.check(item);
            return;
        }
        let list = this.data.filter(data => ids.indexOf(data.id) > -1);
        list.forEach(item => {
            if (this.isChecked(item))
                return;
            this.check(item);
        });
    }

    /**
     * 仅勾选一项
     */
    checkOnly(item) {
        this.clearChecked();
        this.check(item);
    }

    /**
     * 勾选项
     */
    check(item) {
        this.checkedSelection.select(item);
    }

    /**
     * 切换勾选状态
     */
    toggle(item) {
        this.checkedSelection.toggle(item);
    }

    /**
     * 切换全部选中状态
     */
    masterToggle() {
        if (this.isMasterChecked()) {
            this.clearChecked();
            return;
        }
        this.data.forEach(item => this.check(item));
    }

    /**
     * 仅选中一项
     */
    selectOnly(item) {
        this.clearSelected();
        this.select(item);
    }

    /**
     * 选中项
     */
    select(item) {
        this.selectedSelection.select(item);
    }

    /**
     * 是否选中
     * @param item 数据项
     */
    isSelected(item) {
        return this.selectedSelection.isSelected(item);
    }

    /**
     * 是否选中
     * @param item 数据项
     */
    isChecked(item) {
        return this.checkedSelection.isSelected(item);
    }

    /**
     * 是否所有项被选中
     */
    isAllChecked() {
        return this.data.every(item => this.isChecked(item));
    }

    /**
     * 主复选框的选中状态
     */
    isMasterChecked() {
        return this.checkedSelection.hasValue() &&
            this.isAllChecked() &&
            this.checkedSelection.selected.length >= this.data.length;
    }

    /**
     * 主复选框的中间状态
     */
    isMasterIndeterminate() {
        return this.checkedSelection.hasValue() && (!this.isAllChecked() || !this.data.length);
    }

    /**
     * 清理
     */
    clear() {
        this.total = 0;
        this.data = new Array<TModel>();
        this.isLoadCompleted = false;
        this.clearChecked();
        this.clearSelected();
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
}