//============== 抽屉配置 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { TemplateRef } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { NzDrawerSize, NzDrawerPlacement, NzDrawerRef } from "ng-zorro-antd/drawer";

/**
 * 抽屉配置
 */
export interface IDrawerOptions {
    /**
     * 标题
     */
    title?: string | TemplateRef<any>,
    /**
     * 抽屉组件
     */
    component?,
    /**
     * 内容
     */
    content?: TemplateRef<any>,
    /**
     * 传入抽屉组件中的参数
     */
    data?,    
    /**
     * 是否显示左上角的关闭按钮，默认为 true
     */
    showClose?: boolean,
    /**
     * 抽屉右上角的操作区域
     */
    extra?: string | TemplateRef<{}>,
    /**
     * 是否禁用按下ESC键或点击屏幕关闭遮罩，默认 false
     */
    disableClose?: boolean,
    /**
     * 是否显示遮罩，默认为 true
     */
    showMask?: boolean,
    /**
     * 当用户在历史中前进/后退时是否关闭抽屉组件，默认为 true
     */
    closeOnNavigation?: boolean;
    /**
     * 文字方向
     */
    direction?: Direction;
    /**
     * 遮罩样式
     */
    maskStyle?,
    /**
     * 抽屉主体样式
     */
    bodyStyle?,
    /**
     * 页脚
     */
    footer?: string | TemplateRef<any>,
    /**
     * 预设抽屉宽度（或高度），default(378px) 和 large(736px)
     */
    size?: NzDrawerSize,
    /**
     * 宽度, 只在方向为 'right'或'left' 时生效，优先级高于 size
     */
    width?: string | number,
    /**
     * 高度, 只在方向为 'top'或'bottom' 时生效，优先级高于 size
     */
    height?: string | number,
    /**
     * 最小宽度
     */
    minWidth?: number;
    /**
     * 最大宽度
     */
    maxWidth?: number;
    /**
     * 抽屉外层容器样式类名
     */
    wrapClassName?: string,
    /**
     * 设置抽屉的z-index，默认为 1000
     */
    zIndex?: number,
    /**
     * 抽屉的方向，默认为 'right'
     */
    placement?: NzDrawerPlacement,
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
     * 关闭前事件，返回 false 阻止关闭
     */
    onCloseBefore?: (() => Promise<any>) | (() => boolean),
    /**
     * 关闭后事件
     * @param result 返回结果
     */
    onClose?: (result) => void;
}