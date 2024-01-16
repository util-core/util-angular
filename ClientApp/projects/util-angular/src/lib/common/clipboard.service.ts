//============== 剪贴板操作 =============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================
import { Util } from "../util";
import { Clipboard } from '@angular/cdk/clipboard';

/**
 * 剪贴板操作
 */
export class ClipboardService {
    /**
     * 初始化剪贴板操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
    }

    /**
     * 复制到剪贴板
     * @param value 值
     */
    copy(value: string) {
        let clipboard = this.util.ioc.get(Clipboard);
        return clipboard.copy(value);
    }
}