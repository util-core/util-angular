//============== 全屏操作 ============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import screenfull from 'screenfull';
import { Util } from "../util";

/**
 * 全屏操作
 */
export class Fullscreen {
    /**
     * 初始化全屏操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
    }

    /**
     * 切换全屏状态
     * @param element 元素
     * @param isShowNavigationUI 是否显示导航栏
     */
    toggle(element?, isShowNavigationUI?: boolean) {
        if (!this.isEnabled())
            return;
        if (element) {
            this.getInstance().toggle(this.util.dom.getNativeElement(element), this.getOptions(isShowNavigationUI));
            return;
        }
        this.getInstance().toggle();
    }

    /**
     * 是否启用
     */
    private isEnabled() {
        return screenfull && this.getInstance().isEnabled;
    }

    /**
     * 
     * 获取全屏操作实例
     */
    private getInstance() {
        let result: any = screenfull;
        if (result.default && result.default.isEnabled)
            return result.default;
        return result;
    }

    /**
     * 获取配置项
     */
    private getOptions(isShowNavigationUI?: boolean) {
        let options: "auto" | "hide" | "show" = "auto";
        if (isShowNavigationUI === true)
            options = "show";
        else if (isShowNavigationUI === false)
            options = "hide";
        return { navigationUI: options };
    }

    /**
     * 指定元素进入全屏状态
     * @param element 元素
     * @param isShowNavigationUI 是否显示导航栏
     */
    request(element?, isShowNavigationUI?: boolean) {
        if (!this.isEnabled())
            return;
        if (!element)
            return;
        this.getInstance().request(this.util.dom.getNativeElement(element), this.getOptions(isShowNavigationUI));
    }

    /**
     * 退出全屏状态
     */
    exit() {
        if (!this.isEnabled())
            return;
        this.getInstance().exit();
    }

    /**
     * 是否全屏
     */
    isFullscreen() {
        if (this.isEnabled())
            return this.getInstance().isFullscreen;
        return false;
    }

    /**
     * 全屏更改事件
     * @param handler 事件处理器
     */
    onChange(handler: (isFullscreen: boolean) => void) {
        if (!this.isEnabled())
            return;
        this.getInstance().on('change', () => {
            handler && handler(this.getInstance().isFullscreen);
        });
    }

    /**
     * 全屏错误事件
     * @param handler 事件处理器
     */
    onError(handler: (event: Event) => void) {
        if (!this.isEnabled())
            return;
        this.getInstance().on('error', (e) => {
            handler && handler(e);
        });
    }

    /**
     * 清理
     * @param handler 事件处理器
     */
    destroy(handler?: (event: Event) => void) {
        if (!this.isEnabled())
            return;
        this.getInstance().off('change', (e) => {
            handler && handler(e);
        });
        this.getInstance().off('error', (e) => {
            handler && handler(e);
        });
    }
} 