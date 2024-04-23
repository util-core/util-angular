//================ 默认抽屉配置 ======================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================================
import { DrawerConfig } from "./drawer-config";

/**
 * 默认抽屉配置
 */
export const DefaultDrawerConfig: DrawerConfig = {
    resizable: true,
    getWidth: (width: number) => {
        if (width < 600)
            return `${width}px`;
        return "30%";
    },
    getMinWidth: (width: number) => {
        if (width < 380)
            return width;
        return 380;
    },
    getMaxWidth: (width: number) => {
        return width;
    },
}