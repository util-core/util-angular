//================ 抽屉配置 ===================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================

/**
 * 抽屉配置
 */
export class DrawerConfig {
    /**
     * 是否可调整窗口尺寸,默认值: true
     */
    resizable?: boolean;
    /**
     * 获取默认宽度
     * @param width 屏幕宽度
     */
    getWidth?: (width: number) => string;
    /**
     * 获取最小宽度
     * @param width 屏幕宽度
     */
    getMinWidth?: (width: number) => number;
    /**
     * 获取最大宽度
     * @param width 屏幕宽度
     */
    getMaxWidth?: (width: number) => number;
}