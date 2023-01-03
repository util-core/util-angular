//============== 列表项 =============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===================================================
import { ISort } from './sort';

/**
 * 列表项
 */
export class SelectItem implements ISort {
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
}