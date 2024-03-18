//================ 表格配置 ==============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//========================================================

/**
 * 表格配置
 */
export class TableConfig {
    /**
     * 表格尺寸,默认值: 'default'
     */
    tableSize?: 'default' | 'middle' | 'small';
    /**
     * 表格单元格默认宽度,默认值: "150px"
     */
    defaultWidth?: string;
    /**
     * 序号宽度,默认值: "70px"
     */
    lineNumberWidth?: string;
    /**
     * 复选框宽度,默认值: "30px"
     */
    checkboxWidth?: string;
    /**
     * 单选框宽度,默认值: "36px"
     */
    radioWidth?: string;
    /**
     * 树形表格单元格缩进单位宽度,默认值: "20"
     */
    indentUnitWidth?: string;
    /**
     * 表格标题对齐方式,默认值: "left"
     */
    titleAlign?: 'left' | 'center' | 'right';
    /**
     * 表格内容对齐方式,默认值: "left"
     */
    align?: 'left' | 'center' | 'right';
    /**
     * 是否显示不需要保存的提示消息,默认值: true
     */
    isShowNoNeedSaveMessage?: boolean;
    /**
     * 分页长度列表
     */
    pageSizeOptions?: number[];
    /**
     * 表格设置对话框的宽度,默认值: 60%
     */
    tableSettingsWidth?: string;
    /**
     * 是否隐藏表格设置界面中的表格配置区域,默认值: false
     */
    isHideTableConfig?: boolean;
    /**
     * 拖动列宽时是否保存表格设置,默认值: true
     */
    isResizeColumnSave?: boolean;
}