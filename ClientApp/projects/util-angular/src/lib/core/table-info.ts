//============== 表信息 ===========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=================================================
import { ColumnInfo } from './column-info';

/**
 * 表信息
 */
export class TableInfo {
    /**
     * 表格尺寸
     */
    size;
    /**
     * 是否显示表格边框
     */
    bordered;
    /**
     * 表格宽度
     */
    width;
    /**
     * 表格高度
     */
    height;
    /**
     * 列集合
     */
    columns: ColumnInfo[];
}