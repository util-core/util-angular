﻿//============== 加载模式 ========================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================

/**
 * 加载模式
 */
export enum LoadMode {
    /**
     * 同步
     */
    Sync = "0",
    /**
     * 异步
     */
    Async = "1",
    /**
     * 根节点异步加载，下级节点一次性加载
     */
    RootAsync = "2"
}