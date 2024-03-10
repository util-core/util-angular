//============== 列表项 =============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===================================================
import { ISort } from './sort';

/**
 * 列表项
 */
export class SelectItem implements ISort {
    /**
     * 初始化列表项
     * @param text 文本
     * @param value 值
     * @param selected 选中
     */
    constructor(text?: string, value?, sortId?: number, selected?: boolean) {
        this.text = text;
        this.value = value;
        this.sortId = sortId;
        this.selected = selected;
    }

    /**
     * 文本
     */
    text: string;
    /**
     * 值
     */
    value;
    /**
     * 禁用
     */
    disabled?: boolean;
    /**
     * 排序号
     */
    sortId?: number;
    /**
     * 组
     */
    group?: string;
    /**
     * 选中
     */
    selected?: boolean;
    /**
     * 图标
     */
    icon?: string;
}