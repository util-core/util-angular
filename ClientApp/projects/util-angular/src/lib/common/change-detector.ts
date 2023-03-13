//============== 变更检测操作==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import { ChangeDetectorRef } from '@angular/core';
import { Util } from '../util';

/**
 * 变更检测操作
 */
export class ChangeDetector {
    /**
     * 初始化变更检测操作
     * @param util 操作入口
     */
    constructor(private util: Util) {
    }

    /**
     * 检测变更
     */
    detectChanges() {
        let detector: ChangeDetectorRef = this.util.ioc.get(ChangeDetectorRef);
        return detector.detectChanges();
    }
}