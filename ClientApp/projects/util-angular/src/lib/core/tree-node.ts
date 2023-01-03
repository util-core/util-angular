//============== 树形节点 ============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================

/**
 * 树形节点
 */
export class TreeNode {
    /**
     * 标识
     */
    id?: string;
    /**
     * 父标识
     */
    parentId?: string;
    /**
     * 层级
     */
    level?:number;
    /**
     * 排序号
     */
    sortId?: number;
    /**
     * 是否已展开
     */
    expanded?: boolean;
    /**
     * 是否叶节点
     */
    leaf?:boolean;
}