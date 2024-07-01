//============== 抽屉配置 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef, Type } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { NzDrawerSize, NzDrawerPlacement, NzDrawerRef } from "ng-zorro-antd/drawer";

/**
 * 抽屉配置
 */
export interface IDrawerOptions {
    /**
     * 标题
     */
    title?: string | TemplateRef<{}>,
    /**
     * 组件类型
     */
    component?,
    /**
     * 内容
     */
    content?: TemplateRef<{ $implicit: any; drawerRef: NzDrawerRef }> | Type<any>,
    /**
     * 传入内容组件的参数
     */
    data?,
    /**
     * 右上角的操作区域
     */
    extra?: string | TemplateRef<{}>,
    /**
     * 页脚
     */
    footer?: string | TemplateRef<any>,
    /**
     * 是否显示左上角的关闭按钮，默认值: true
     */
    closable?: boolean,
    /**
     * 是否显示左上角的关闭按钮，默认值: true
     */
    showClose?: boolean,
    /**
     * 点击遮罩是否允许关闭，默认值: true
     */
    maskClosable?: boolean,
    /**
     * 按下ESC键是否允许关闭，默认值: true
     */
    keyboard?: boolean,
    /**
     * 是否禁用按下ESC键或点击遮罩关闭抽屉，默认值: false
     */
    disableClose?: boolean,
    /**
     * 是否显示遮罩，默认值: true
     */
    mask?: boolean,
    /**
     * 是否显示遮罩，默认值: true
     */
    showMask?: boolean,
    /**
     * 当用户在历史中前进/后退时是否关闭抽屉，默认值: true
     */
    closeOnNavigation?: boolean,
    /**
     * 文字方向
     */
    direction?: Direction,
    /**
     * 抽屉方向，默认值: 'right'
     */
    placement?: NzDrawerPlacement,
    /**
     * 抽屉尺寸
     */
    size?: NzDrawerSize,
    /**
     * 宽度, 只在方向为 'right' 或 'left' 时生效，优先级高于 size
     */
    width?: string | number,
    /**
     * 高度, 只在方向为 'top'或'bottom' 时生效，优先级高于 size
     */
    height?: string | number,
    /**
     * 最小宽度,调整抽屉尺寸时使用
     */
    minWidth?: number;
    /**
     * 最大宽度,调整抽屉尺寸时使用
     */
    maxWidth?: number;    
    /**
     * 遮罩样式
     */
    maskStyle?,
    /**
     * 抽屉主体样式
     */
    bodyStyle?,
    /**
     * 抽屉外层容器样式类名
     */
    wrapClassName?: string,
    /**
     * 设置 z-index，默认值: 1000
     */
    zIndex?: number,
    /**
     * x 坐标偏移量,单位: px，默认为 0
     */
    offsetX?: number,
    /**
     * y 坐标偏移量,单位: px，默认为 0
     */
    offsetY?: number,   
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
    onCancel?: () => (() => Promise<any>) | (() => boolean),
    /**
     * 关闭前事件，返回 false 阻止关闭
     */
    onCloseBefore?: (() => Promise<any>) | (() => boolean),
    /**
     * 关闭后事件
     * @param result 返回结果
     */
    onClose?: (result) => void;
}