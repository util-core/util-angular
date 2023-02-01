//============== Tinymce富文本扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Optional } from '@angular/core';
import { TinymceOptions } from 'ngx-tinymce';
import { Util } from "../util";
import { isUndefined } from "../common/helper";
import { AppConfig, initAppConfig } from '../config/app-config';

/**
 * Tinymce富文本扩展指令
 */
@Directive({
    selector: '[x-tinymce-extend]',
    exportAs: 'xTinymceExtend'
})
export class TinymceExtendDirective  {
     /**
     * 操作入口
     */
    protected util: Util;
    /**
     * Tinymce配置结果
     */
    config;
    /**
     * 是否显示品牌,设为false时，隐藏编辑器界面右下角的"Powered by Tiny"
     */
    @Input() branding: boolean;
    /**
     * 是否允许粘贴图片
     */
    @Input() pasteDataImages: boolean;
    /**
     *  菜单栏
     */
    @Input() menubar: boolean | string;
    /**
     *  工具栏模式
     */
    @Input() toolbarMode: string;
    /**
     *  插件列表
     */
    @Input() plugins: string;
    /**
     *  工具栏
     */
    @Input() toolbar: string;

    /**
     * 初始化Tinymce富文本扩展指令
     * @param appConfig 应用配置
     * @param options Tinymce富文本配置
     */
    constructor(@Optional() protected appConfig: AppConfig,@Optional() protected options: TinymceOptions) {
        this.initAppConfig();
        this.util = new Util(null, this.appConfig);
    }

    /**
     * 初始化应用配置
     */
    private initAppConfig() {
        if (!this.appConfig)
            this.appConfig = new AppConfig();
        initAppConfig(this.appConfig);
    }

    /**
     * 初始化
     */
    ngOnInit() {
        setTimeout(() => {
            if (this.options && this.options.config) {
                this.config = this.options.config;
                return;
            }
            this.config = this.createConfig();
        }, 0);        
    }

    /**
     * 创建配置
     */
    private createConfig() {
        return {
            promotion: false,
            branding: this.getBranding(),
            language: this.getLanguage(),
            language_url: this.getLanguageUrl(),
            paste_data_images: this.getPasteDataImages(),
            menubar: this.getMenubar(),
            toolbar_mode: this.getToolbarMode(),
            plugins: this.getPlugins(),
            toolbar: this.getToolbar()
        };
    }

    /**
     * 获取是否显示品牌
     */
    private getBranding() {
        if (isUndefined(this.branding))            
            return this.appConfig.tinymce.branding;
        return this.branding;
    }

    /**
     * 获取语言
     */
    private getLanguage() {
        let result = this.util.i18n.getCurrentLang();
        switch (result) {
            case 'en':
            case 'en_US':
                return null;
            case 'zh-CN':
                return "zh-Hans";
        }
        return result;
    }

    /**
     * 获取语言包地址
     */
    private getLanguageUrl() {        
        let fileName = this.getLanguageFileName();
        if (!fileName)
            return null;
        return `${this.getBaseUrl()}langs/${fileName}`
    }

    /**
     * 获取语言包文件名
     */
    private getLanguageFileName() {
        let lang = this.getLanguage();
        if (!lang)
            return null;
        return `${lang}.js`;
    }

    /**
     * 获取基地址
     */
    private getBaseUrl() {
        let url = this.options.baseURL;
        if (!url)
            return './assets/tinymce/';
        url = url.replace("\\", "/");
        if (url.endsWith("/"))
            return url;
        return `${url}/`;
    }

    /**
     * 获取是否允许粘贴图片
     */
    private getPasteDataImages() {
        if (isUndefined(this.pasteDataImages))
            return this.appConfig.tinymce.pasteDataImages;
        return this.pasteDataImages;
    }

    /**
     * 获取菜单栏
     */
    private getMenubar() {
        if (isUndefined(this.menubar))
            return this.appConfig.tinymce.menubar;
        return this.menubar;
    }

    /**
     * 获取工具栏模式
     */
    private getToolbarMode() {
        if (isUndefined(this.toolbarMode))
            return this.appConfig.tinymce.toolbarMode;
        return this.toolbarMode;
    }

    /**
     * 获取插件列表
     */
    private getPlugins() {
        if (isUndefined(this.plugins))
            return this.appConfig.tinymce.plugins;
        return this.plugins;
    }

    /**
     * 获取工具栏
     */
    private getToolbar() {
        if (isUndefined(this.toolbar))
            return this.appConfig.tinymce.toolbar;
        return this.toolbar;
    }
}

