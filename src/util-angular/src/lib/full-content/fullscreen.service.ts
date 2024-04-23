//============== 全屏服务 =====================================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Injectable } from '@angular/core';
import { Util } from "../util";
import { FullContentService } from "./full-content.service";

/**
 * 全屏服务
 */
@Injectable({ providedIn: 'root' })
export class FullscreenService {
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 是否全屏
     */
    private _isFullscreen: boolean;
    /**
     * 当前全屏内容服务
     */
    private _current: FullContentService;

    /**
     * 初始化
     * @param util 操作入口
     */
    init(util: Util) {
        this.util = util;
        this._current = new FullContentService(util);
        this.util.fullscreenHelper.onChange((isFullscreen: boolean) => {
            this._isFullscreen = isFullscreen;
            if (!isFullscreen)
                this.destroyContent();
            this.util.changeDetector.markForCheck();
        });
        this.util.fullscreenHelper.onError((event) => {
            console.error(event);
        });
    }

    /**
     * 销毁内容区
     */
    destroyContent() {
        this._current.destroy();
        this._current = new FullContentService(this.util);
    }

    /**
     * 是否全屏
     */
    isFullscreen() {
        return this._isFullscreen;
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
         * 外层class类
         */
        wrapClass?,
        /**
         * 是否创建标题和页脚进行包装
         */
        isPack?: boolean
    }) {
        if (!options)
            return;
        if (!options.content)
            return;
        if (this._current.hasContent(options.content)) {
            this._current.exit();
            return;
        }
        this._current.fullscreen(options);
    }
}