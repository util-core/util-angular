//============== 列表配置组 =======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { SelectOption } from "./select-option";
/**
 * 列表配置组
 */
export class SelectOptionGroup {
    /**
     * 初始化列表配置组
     * @param text 文本
     * @param value 值
     * @param disabled 禁用
     */
    constructor(public text: string, public value: SelectOption[], public disabled?: boolean) {
    }
}