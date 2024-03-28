//================ Tinymce富文本编辑器配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=======================================================================

/**
 * Tinymce富文本编辑器配置
 */
export class TinymceConfig {
    /**
     * 隐藏右下角技术支持,设为false时，隐藏编辑器界面右下角的“Powered by Tiny,默认值: false
     */
    branding?: boolean;
    /**
     * 是否允许粘贴图片
     */
    pasteDataImages?: boolean;
    /**
     *  菜单栏
     */
    menubar?: boolean | string;
    /**
     *  工具栏模式,可选值: floating,sliding,scrolling,wrap
     */
    toolbarMode?: string;
    /**
     *  插件列表
     */
    plugins?: string;
    /**
     *  工具栏
     */
    toolbar?: string;
}