//================ 默认Tinymce富文本编辑器配置 ==============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//==========================================================================
import { TinymceConfig } from "./tinymce-config";

/**
 * 默认Tinymce富文本编辑器配置
 */
export const DefaultTinymceConfig: TinymceConfig = {
    branding: false,
    pasteDataImages: true,
    menubar:true,
    toolbarMode: "wrap",
    plugins: "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount image textpattern help emoticons autosave autoresize",
    toolbar: 'code undo redo restoredraft | cut copy | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat |  table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |  indent2em'
};