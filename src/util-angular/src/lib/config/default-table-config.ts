//============== 默认表格配置 =========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { TableConfig } from "./table-config";

/**
 * 默认表格配置
 */
export const DefaultTableConfig: TableConfig = {
    tableSize: "default",
    defaultWidth: "150px",
    lineNumberWidth: "70px",
    checkboxWidth: "30px",
    radioWidth: "36px",
    titleAlign: "left",
    align: "left",
    indentUnitWidth: 20,
    isShowNoNeedSaveMessage: true,
    isHideTableConfig: false,
    isResizeColumnSave: true,
    getTableSettingsWidth: (width: number) => {
        if (width < 1600)
            return `${width}px`;
        return "1600px";
    },
    getTableSettingsMinWidth: (width: number) => {
        if (width < 1000)
            return width;
        return 1000;
    },
    getTableSettingsMaxWidth: (width: number) => {
        return width;
    },
    getTableSettingsMinHeight: (height: number) => {
        if (height < 500)
            return height;
        return 500;
    },
    getTableSettingsMaxHeight: (height: number) => {
        if (height < 1200)
            return height;
        return 1200;
    }
};