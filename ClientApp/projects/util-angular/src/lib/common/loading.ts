//============== 加载操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//==================================================
import { LoadingService } from '@delon/abc/loading';
import { Util } from "../util";
import { LoadingConfig } from "../config/loading-config";
import { I18nKeys } from "../config/i18n-keys";

/**
 * 加载操作
 */
export class Loading {
    /**
     * 加载服务
     */
    private loadingService: LoadingService;
    /**
     * 加载配置
     */
    private loadingConfig: LoadingConfig;

    /**
     * 初始化国际化操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.loadingService = this.util.ioc.get(LoadingService);
        this.loadingConfig = this.util.getAppConfig().loading || {};
    }

    /**
     * 启用加载状态
     * @param delay 
     */
    open() {
        if (this.loadingConfig.custom) {
            this.openCustom();
            return;
        }
        if (this.loadingConfig.icon) {
            this.openIcon();
            return;
        }
        this.loadingService.open({
            type: this.getType(),
            text: this.getText(), 
            delay: this.loadingConfig.delay
        });
    }

    /**
     * 启用自定义图标
     */
    private openCustom() {        
        this.loadingService.open({
            type: "custom",
            text: this.getText(),
            custom: {
                html: this.util.sanitizer.trustHtml(this.loadingConfig.custom.html),
                style: this.loadingConfig.custom.style
            },
            delay: this.loadingConfig.delay
        });
    }

    /**
     * 获取文本
     */
    private getText() {
        let result = this.loadingConfig.text;
        if (!result && this.loadingConfig.type === "text")
            result = I18nKeys.loading;
        return this.util.i18n.get(result);
    }

    /**
     * 启用NgZorro图标
     */
    private openIcon() {
        this.loadingService.open({
            type: "icon",
            text: this.getText(),
            icon: this.loadingConfig.icon,
            delay: this.loadingConfig.delay
        });
    }

    /**
     * 获取类型
     */
    private getType(): 'text' | 'icon' | 'spin' | 'custom' {        
        if (this.loadingConfig.type)
            return this.loadingConfig.type;
        return "spin";
    }

    /**
     * 关闭加载状态
     */
    close() {
        this.loadingService.close();
    }
}