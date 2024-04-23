//============== 响应式操作 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { DOCUMENT } from '@angular/common';
import { Util } from "../util";

/**
 * 响应式操作
 */
export class Responsive {
    /**
     * dom
     */
    private _document: Document;

    /**
     * 初始化响应式操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this._document = util.ioc.get(DOCUMENT);
    }

    /**
     * 是否超窄尺寸, <576px
     */
    isXs() {
        return this.getWidth() < 576;
    }

    /**
     * 是否窄尺寸, ≥576px
     */
    isSm() {
        return this.getWidth() >= 576;
    }

    /**
     * 是否中尺寸, ≥768px
     */
    isMd() {
        return this.getWidth() >= 768;
    }

    /**
     * 是否宽尺寸, ≥992px
     */
    isLg() {
        return this.getWidth() >= 992;
    }

    /**
     * 是否超宽尺寸, ≥1200px
     */
    isXl() {
        return this.getWidth() >= 1200;
    }

    /**
     * 是否极宽尺寸, ≥1600px
     */
    isXxl() {
        return this.getWidth() >= 1600;
    }

    /**
     * 是否PC
     */
    isPc() {
        return this.getWidth() >= 1200;
    }

    /**
     * 是否平板
     */
    isPad() {
        return this.getWidth() >= 600 && this.getWidth() < 1200;
    }

    /**
     * 是否手机
     */
    isPhone() {
        return this.getWidth() < 600;
    }

    /**
     * 获取屏幕宽度
     */
    getWidth() {
        if (!this._document)
            return 0;
        if (!this._document.defaultView)
            return 0;
        return this._document.defaultView.innerWidth;
    }

    /**
     * 获取屏幕高度
     */
    getHeight() {
        if (!this._document)
            return 0;
        if (!this._document.defaultView)
            return 0;
        return this._document.defaultView.innerHeight;
    }
}