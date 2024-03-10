//============== 列信息 ===========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=================================================

/**
 * 列信息
 */
export class ColumnInfo {
    /**
     * 行号
     */
    line: number;
    /**
     * 列名
     */
    name;
    /**
     * 标题
     */
    title;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 宽度
     */
    width: string;
    /**
     * 是否固定宽度
     */
    fixWidth: boolean;
    /**
     * 是否固定到左侧
     */
    left: boolean;
    /**
     * 是否固定到右侧
     */
    right: boolean;
    /**
     * 对齐方式
     */
    align;
    /**
     * 标题对齐方式
     */
    titleAlign;
    /**
     * 是否自动省略
     */
    ellipsis: boolean;
    /**
     * 访问控制
     */
    acl: string;
}