//============== 弹出层配置 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef } from '@angular/core';
import { ModalButtonOptions } from "ng-zorro-antd/modal";
import { NzButtonType } from 'ng-zorro-antd/button';

/**
 * 弹出层配置
 */
export interface IDialogOptions {
    /**
     * 标题,支持多语言
     */
    title?: string | TemplateRef<any>,
    /**
     * 对话框组件
     */
    component?,
    /**
     * 内容
     */
    content?: string | TemplateRef<any>,
    /**
     * 传入对话框组件中的参数
     */
    data?,
    /**
     * 页脚
     */
    footer?: string | TemplateRef<{}> | Array<ModalButtonOptions>;
    /**
     * 是否显示页脚, 默认值: true
     */
    showFooter?: boolean,
    /**
     * 是否垂直居中显示,默认值: true
     */
    centered?: boolean,
    /**
     * 是否可拖动, 默认值: true
     */
    draggable?: boolean;
    /**
     * 是否显示关闭按钮, 默认值: true
     */
    closable?: boolean,
    /**
     * 是否显示关闭按钮, 默认值: true
     */
    showClose?: boolean,
    /**
     * 是否显示取消按钮, 默认值: true
     */
    showCancel?: boolean,
    /**
     * 是否显示确定按钮, 默认值: true
     */
    showOk?: boolean,   
    /**
     * 取消按钮的文字,支持多语言
     */
    cancelText?: string,
    /**
     * 确定按钮的文字,支持多语言
     */
    okText?: string,
    /**
     * 取消按钮是否加载状态, 默认值: false
     */
    cancelLoading?: boolean,
    /**
     * 确定按钮是否加载状态,默认值: false
     */
    okLoading?: boolean,
    /**
     * 是否禁用取消按钮,默认值: false
     */
    cancelDisabled?: boolean,
    /**
     * 是否禁用确定按钮,默认值: false
     */
    okDisabled?: boolean,
    /**
     * 确定按钮的类型, 可选值: 'primary' | 'default' | 'dashed' | 'link' | 'text' | null
     */
    okType?: NzButtonType,
    /**
     * 确认按钮是否危险按钮, 默认值: false
     */
    okDanger?: boolean,
    /**
     * 是否显示遮罩，默认值: true
     */
    mask?: boolean,
    /**
     * 是否显示遮罩，默认值: true
     */
    showMask?: boolean,
    /**
     * 按下ESC键是否允许关闭，默认值: true
     */
    keyboard?: boolean,
    /**
     * 点击遮罩是否允许关闭，默认值: true
     */
    maskClosable?: boolean,
    /**
     * 是否禁用按下ESC键或点击遮罩关闭对话框，默认值: false
     */
    disableClose?: boolean,
    /**
     * 当用户在历史中前进/后退时是否关闭对话框，默认值: true
     */
    closeOnNavigation?: boolean,
    /**
     * 宽度, 使用数字时，默认单位为 px, 默认值: 520
     */
    width?: string | number,
    /**
    * 最小宽度
    */
    minWidth?: number;
    /**
     * 最大宽度
     */
    maxWidth?: number;
    /**
     * 最小高度
     */
    minHeight?: number;
    /**
     * 最大高度
     */
    maxHeight?: number;
    /**
     * 图标类型,仅确认框模式下有效, 默认值: 'question-circle'
     */
    iconType?: string,
    /**
     * 关闭按钮图标, 默认值: 'close'
     */
    closeIcon?: string | TemplateRef<void>,
    /**
     * 自动聚焦及聚焦位置，为 null 时禁用,默认值: 'auto'
     */
    autofocus?: 'ok' | 'cancel' | 'auto' | null,
    /**
     * 浮层样式
     */
    style?,
    /**
     * 对话框主体样式
     */
    bodyStyle?,
    /**
    * 遮罩样式
    */
    maskStyle?,
    /**
     * 对话框样式类名
     */
    className?: string,
    /**
     * 对话框外层容器样式类名
     */
    wrapClassName?: string,
    /**
     * 是否添加默认外层容器样式, 默认值: modal-wrap
     */
    addWrapClass?: boolean;
    /**
     * 设置 z-index，默认值: 1000
     */
    zIndex?: number,
    /**
     * 点击确定按钮事件，返回 false 阻止关闭
     * @param instance 对话框组件实例
     */
    onOk?: (instance) => (false | void | {}) | Promise<false | void | {}>,
    /**
     * 打开前事件，返回 false 阻止弹出
     */
    onOpenBefore?: () => boolean,
    /**
     * 打开后事件
     */
    onOpen?: () => void,
    /**
    * 取消事件，返回 false 阻止关闭
    */
    onCancel?: (result) => (false | void | {}) | Promise<false | void | {}>,
    /**
     * 关闭前事件，返回 false 阻止关闭
     */
    onCloseBefore?: (result) => (false | void | {}) | Promise<false | void | {}>,
    /**
     * 关闭后事件
     * @param result 返回结果
     */
    onClose?: (result) => void;
    /**
     * 全屏事件
     * @param isFullscreen 是否全屏
     */
    onFullscreen?: (isFullscreen: boolean) => void;
}