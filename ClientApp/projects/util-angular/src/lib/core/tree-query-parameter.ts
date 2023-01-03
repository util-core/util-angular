//============== 树形查询参数 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import { QueryParameter } from "./query-parameter";

/**
 * 树形查询参数
 */
export class TreeQueryParameter extends QueryParameter {
    /**
     * 父标识
     */
    parentId?: string;
    /**
     * 启用
     */
    enabled?: boolean;
    /**
     * 操作
     */
    operation?: string;
}