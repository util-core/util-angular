//============== 动画操作 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//==================================================
import { Util } from '../util';

/**
 * 动画操作
 */
export class Animation {
    /**
     * 标识
     */
    _id = -1;

    /**
     * 初始化动画操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 请求动画帧
     * @param callback 回调函数
     */
    request(callback: FrameRequestCallback) {
        cancelAnimationFrame(this._id);
        this._id = requestAnimationFrame(callback);
    }
}