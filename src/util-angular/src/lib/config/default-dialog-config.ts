//================ 默认弹出层配置 ====================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================================
import { DialogConfig } from "./dialog-config";

/**
 * 默认弹出层配置
 */
export const DefaultDialogConfig: DialogConfig = {
    draggable: true,
    resizable: true,
    fullScreen: true,
    centered: true,
    defaultWrapClassName: "modal-wrap",
    getWidth: (width: number) => {
        if (width < 1000)
            return `${width}px`;
        if (width < 1400)
            return "70%";
        return "60%";
    },
    getMinWidth: (width: number) => {
        if (width < 600)
            return width;
        return 600;
    },
    getMaxWidth: (width: number) => {
        return width;
    },
    getMinHeight: (height: number) => {
        if (height < 300)
            return height;
        return 300;
    },
    getMaxHeight: (height: number) => {
        if (height < 800)
            return height;
        return 800;
    }
}