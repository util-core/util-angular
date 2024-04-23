//================ 弹出层配置 =================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================

/**
 * 弹出层配置
 */
export class DialogConfig {
    /**
     * 是否可拖动, 默认值: true
     */
    draggable?: boolean;
    /**
     * 是否可调整窗口尺寸, 默认值: true
     */
    resizable?: boolean;
    /**
     * 是否可最大化窗口, 默认值: true
     */
    fullScreen?: boolean;
    /**
     * 是否垂直居中显示, 默认值: true
     */
    centered?: boolean;
    /**
     * 是否添加默认外层容器样式, 默认值: false
     */
    addWrapClass?: boolean;
    /**
     * 默认外层容器样式类名, 默认值: modal-wrap
     */
    defaultWrapClassName?: string;    
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
    /**
     * 获取最小高度
     * @param height 屏幕高度
     */
    getMinHeight?: (height: number) => number;
    /**
     * 获取最大高度
     * @param height 屏幕高度
     */
    getMaxHeight?: (height: number) => number;    
}