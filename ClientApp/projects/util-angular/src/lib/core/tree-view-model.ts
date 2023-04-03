//============== 树形视图模型 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { ViewModel } from "./view-model";

/**
 * 树形视图模型
 */
export class TreeViewModel extends ViewModel {
    /**
     * 父标识
     */
    parentId?: string;
    /**
     * 父名称
     */
    parentName?;
    /**
     * 路径
     */
    path?;
    /**
     * 层级
     */
    level?;
    /**
     * 排序号
     */
    sortId?: number;
    /**
     * 启用
     */
    enabled?: boolean;
    /**
     * 是否展开
     */
    expanded?: boolean;
    /**
     * 是否叶节点
     */
    leaf?: boolean;
    /**
     * 复选框是否被勾选
     */
    checked?: boolean;
    /**
     * 是否隐藏
     */
    hide?: boolean;
}