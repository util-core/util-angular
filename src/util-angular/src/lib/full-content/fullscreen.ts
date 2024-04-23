//============== 全屏服务 =====================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Util } from "../util";
import { FullscreenService } from "./fullscreen.service";

/**
 * 全屏服务
 */
export class Fullscreen {
    /**
     * 全屏服务
     */
    private _fullscreenService: FullscreenService;

    /**
     * 初始化全屏服务
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this._fullscreenService = util.ioc.get(FullscreenService);
        this._fullscreenService.init(util);
    }

    /**
     * 是否全屏
     */
    get isFullscreen() {
        return this._fullscreenService.isFullscreen();
    }

    /**
     * 注册全屏变更事件处理
     * @param handler 事件处理器
     */
    onChange(handler: (isFullscreen: boolean) => void) {
        this.util.fullscreenHelper.onChange((isFullscreen: boolean) => {
            handler && handler(isFullscreen);
        });
    }

    /**
     * 切换全屏
     * @param options 配置参数
     */
    toggle(options: {
        /**
         * 内容
         */
        content,
        /**
         * 标题
         */
        title?: string,
        /**
         * 外层class类,设置为true,设置默认样式类 x-fullscreen
         */
        wrapClass?,
        /**
         * 是否创建标题和页脚进行包装,默认值: true
         */
        isPack?: boolean
    }) {
        this._fullscreenService.toggle(options);
    }

    /**
     * 退出全屏
     */
    exit() {
        this.util.fullscreenHelper.exit();
    }
}