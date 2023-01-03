//============== 确认框配置 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';

/**
 * 确认框配置
 */
export interface IConfirmOptions {
    /**
     * 标题
     */
    title?: string | TemplateRef<any>,
    /**
     * 内容
     */
    content?: string | TemplateRef<any>,
    /**
     * 是否垂直居中显示
     */
    centered?: boolean,
    /**
     * 宽度
     */
    width?: string | number,
    /**
     * 是否禁用按下ESC键或点击屏幕关闭遮罩，默认 false
     */
    disableClose?: boolean,
    /**
     * 是否显示右上角的关闭按钮，默认为 true
     */
    showClose?: boolean,
    /**
     * 是否显示遮罩，默认为 true
     */
    showMask?: boolean,
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
    cancelLoading?:boolean,
    /**
     * 是否显示确定按钮，默认为 true
     */
    showOk?: boolean,
    /**
     * 确定按钮的文字
     */
    okText?: string,
    /**
     * 确定按钮的颜色, 可选值: default,primary,dashed,danger
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
     * 点击确定按钮回调事件，返回 false 阻止关闭
     * @param instance 弹出层组件实例
     */
    onOk?: (instance) => (false | void | {}) | Promise<false | void | {}>,
    /**
     * 点击右上角叉或取消按钮的回调，返回 false 阻止关闭
     * @param instance 弹出层组件实例
     */
    onCancel?: (instance) => (false | void | {}) | Promise<false | void | {}>;
}