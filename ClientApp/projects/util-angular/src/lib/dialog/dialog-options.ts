//============== 弹出层配置 ======================
//Copyright 2023 何镇汐
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
     * 弹出层组件
     */
    component?,
    /**
     * 内容
     */
    content?: string | TemplateRef<any>,
    /**
     * 传入弹出层组件中的参数
     */
    data?,
    /**
     * 是否垂直居中显示
     */
    centered?:boolean,
    /**
     * 标题
     */
    title?: string | TemplateRef<any>,
    /**
     * 是否显示页脚，默认为 true
     */
    showFooter?: boolean,
    /**
     * 页脚
     */
    footer?: string | TemplateRef<any> | Array<ModalButtonOptions>;
    /**
     * 是否显示右上角的关闭按钮，默认为 true
     */
    showClose?: boolean,
    /**
     * 是否显示取消按钮，默认为 true
     */
    showCancel?: boolean,
    /**
     * 取消按钮的文字
     */
    cancelText?: string,
    /**
     * 取消按钮的加载状态
     */
    cancelLoading?: boolean,
    /**
     * 是否显示确定按钮，默认为 true
     */
    showOk?: boolean,
    /**
     * 确定按钮的文字
     */
    okText?: string,
    /**
     * 确定按钮的类型, 可选值: default,primary,dashed,danger
     */
    okType?: NzButtonType,
    /**
     * 确认按钮是否为危险按钮
     */
    okDanger?: boolean,
    /**
     * 确认按钮的加载状态
     */
    okLoading?: boolean,
    /**
     * 是否显示遮罩，默认为 true
     */
    showMask?: boolean,
    /**
     * 是否禁用按下ESC键或点击屏幕关闭遮罩，默认 false
     */
    disableClose?: boolean,
    /**
     * 宽度
     */
    width?: string | number,
    /**
     * 弹出层样式
     */
    style?,
    /**
     * 弹出层主体样式
     */
    bodyStyle?,
    /**
     * 遮罩样式
     */
    maskStyle?,
    /**
     * 弹出层样式类名
     */
    className?: string,
    /**
     * 弹出层外层容器样式类名
     */
    wrapClassName?:string,
    /**
     * 点击确定按钮事件，返回 false 阻止关闭
     * @param instance 弹出层组件实例
     */
    onOk?: ( instance ) => ( false | void | {} ) | Promise<false | void | {}>,
    /**
     * 打开前事件，返回 false 阻止弹出
     */
    onOpenBefore?: () => boolean,
    /**
     * 打开后事件
     */
    onOpen?: () => void,
    /**
     * 关闭前事件，返回 false 阻止关闭
     */
    onCloseBefore?: ( result ) => ( false | void | {} ) | Promise<false | void | {}>,
    /**
     * 关闭后事件
     * @param result 返回结果
     */
    onClose?: ( result ) => void;
}