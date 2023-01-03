//============== 列表=============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { sort } from './sort';
import { SelectItem } from "./select-item";
import { SelectOption } from "./select-option";
import { SelectOptionGroup } from "./select-option-group";
import { groupBy } from "../common/helper";

/**
 * 列表
 */
export class SelectList {
    /**
     * 初始化列表
     * @param items 列表项集合
     */
    constructor(private items: SelectItem[]) {
    }

    /**
     * 转换为列表配置项集合
     */
    toOptions(): SelectOption[] {
        return this.getSortedItems().map(value => new SelectOption(value));
    }

    /**
     * 获取已排序的列表项集合
     */
    private getSortedItems() {
        return sort(this.items);
    }

    /**
     * 转换为列表配置项集合
     */
    toGroups(): SelectOptionGroup[] {
        let result = new Array<SelectOptionGroup>();
        let groups = groupBy(this.getSortedItems(), t => t.group);
        groups.forEach((items, key) => {
            result.push(new SelectOptionGroup(key, items.map(item => new SelectOption(item)), false));
        });
        return result;
    }

    /**
     * 是否列表组
     */
    isGroup(): boolean {
        return this.items.every(value => !!value.group);
    }
}