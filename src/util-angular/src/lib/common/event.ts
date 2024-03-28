//============== 事件操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//==================================================
import { fromEvent } from 'rxjs';
import { debounceTime, distinct, map, filter } from 'rxjs/operators';
import { Util } from '../util';

/**
 * 事件操作
 */
export class Event {
    /**
     * 初始化事件操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 滚动到页面底部事件
     * @param options 配置
     */
    onScrollToBottom(options: {
        /**
         * 事件处理操作
         */
        handler?: () => void

    }) {
        options = options || {};
        return fromEvent(window, "scroll")
            .pipe(
                map(t => document.documentElement.scrollTop),
                filter(scrollTop => {
                    if (scrollTop === 0)
                        return false;
                    if (document.documentElement.clientHeight + scrollTop >= document.documentElement.scrollHeight)
                        return true;
                    return false;
                }),
                debounceTime(200),
                distinct()
            )
            .subscribe({
                next: value => {
                    options.handler && options.handler();
                }
            });
    }
}