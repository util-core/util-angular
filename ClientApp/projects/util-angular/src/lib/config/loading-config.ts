//================ 加载配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import type { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * 加载配置
 */
export class LoadingConfig {
    /**
     * 加载类型
     */
    type?: 'text' | 'icon' | 'spin';
    /**
     * 显示文本
     */
    text?: string;
    /**
     * 延迟加载时间，单位：毫秒
     */
    delay?: number;
    /**
     * NgZorro图标
     */
    icon?: {
        /**
         * 图标类型
         */
        type?: string;
        /**
         * 图标主题
         */
        theme?: 'fill' | 'outline' | 'twotone';
        /**
         * 是否旋转
         */
        spin?: boolean;
    }
    /**
     *  自定义加载指示符图标
     */
    custom?: {
        /**
          *  自定义html
          */
        html?: string;
        /**
         *  自定义样式
         */
        style?: { [key: string]: NzSafeAny };
        /**
         *  自定义名称
         */
        [key: string]: NzSafeAny;
    };
}