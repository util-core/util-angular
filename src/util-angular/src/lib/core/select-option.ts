//============== 列表配置项 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { SelectItem } from "./select-item";

/**
 * 列表配置项
 */
export class SelectOption {
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
     * 图标
     */
    icon?: string;

    /**
     * 初始化列表配置项
     * @param item 列表项
     */
    constructor(item: SelectItem) {
        this.text = item.text;
        this.value = item.value;
        this.disabled = item.disabled;
        this.icon = item.icon;
    }
}