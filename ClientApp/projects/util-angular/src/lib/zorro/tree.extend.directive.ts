//============== NgZorro树形扩展指令=======================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NzTreeNodeOptions, NzFormatEmitEvent, NzTreeComponent } from "ng-zorro-antd/tree";
import { Util } from "../util";
import { FailResult } from "../core/fail-result";
import { TreeQueryParameter } from "../core/tree-query-parameter";

/**
 * NgZorro树形扩展指令
 */
@Directive({
    selector: '[x-tree-extend]',
    exportAs: 'xTreeExtend'
})
export class TreeExtendDirective implements OnInit {
    /**
     * 操作入口
     */
    protected util: Util;
    /**
     * 是否显示进度条
     */
    loading: boolean;
    /**
     * 展开节点的标识列表
     */
    expandedKeys: string[];
    /**
     * 复选框选中节点的标识列表
     */
    checkedKeys: string[];
    /**
     * 选中节点的标识列表
     */
    selectedKeys: string[];
    /**
     * 数据源
     */
    @Input() dataSource: NzTreeNodeOptions[];
    /**
     * 初始化时是否自动加载数据，默认为true,设置成false则手工加载
     */
    @Input() autoLoad: boolean;
    /**
     * 数据加载地址，范例：/api/test
     */
    @Input() url: string;
    /**
     * 首次加载地址，如果未设置则使用url属性地址
     */
    @Input() loadUrl: string;
    /**
     * 查询地址，如果未设置则使用url属性地址
     */
    @Input() queryUrl: string;
    /**
     * 加载子节点地址，如果未设置则使用url属性地址
     */
    @Input() loadChildrenUrl: string;
    /**
     * 查询参数
     */
    @Input() queryParam: TreeQueryParameter;
    /**
     * 查询参数变更事件
     */
    @Output() queryParamChange = new EventEmitter<TreeQueryParameter>();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化树形扩展指令
     */
    constructor( public tree:NzTreeComponent ) {
        this.util = new Util();
        this.dataSource = new Array<any>();
        this.autoLoad = true;
        this.queryParam = new TreeQueryParameter();
    }

    /**
     * 初始化
     */
    ngOnInit() {
        if (this.autoLoad)
            this.load();
    }

    /**
     * 加载,对于异步请求,仅加载第一级节点
     */
    private load() {
        this.query({
            isSearch: false,
            url: this.loadUrl
        });
    }

    /**
     * 查询
     * @param options 配置
     */
    query(options?: {
        /**
         * 是否搜索
         */
        isSearch?: boolean,
        /**
         * 按钮
         */
        button?,
        /**
         * 请求地址
         */
        url?: string,
        /**
         * 查询参数
         */
        param?,
        /**
         * 请求前处理函数，返回false则取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         * @param result 结果
         */
        ok?: (result) => void;
        /**
         * 请求失败处理函数
         */
        fail?: (result: FailResult) => void;
        /**
         * 请求完成处理函数
         */
        complete?: () => void;
    }) {
        options = options || {};
        let url = options.url || this.queryUrl || this.url;
        if (!url)
            return;
        let param = options.param || this.queryParam;
        this.util.webapi.get<any>(url).paramIf("is_search", "false", options.isSearch === false).param(param).button(options.button).handle({
            before: () => {
                this.loading = true;
                if (options.before)
                    return options.before();
                return true;
            },
            ok: result => {
                this.loadData(result);
                options.ok && options.ok(result);
                this.loadAfter(result);
                this.onLoad.emit(result);
            },
            fail: options.fail,
            complete: () => {
                this.loading = false;
                options.complete && options.complete();
            }
        });
    }

    /**
     * 加载完成操作
     * @param result
     */
    loadAfter(result) {
    }

    /**
     * 加载数据
     */
    private loadData(result) {
        if (!result)
            return;
        this.dataSource = result.nodes || [];
        this.expandedKeys = this.expandedKeys ? [...this.expandedKeys] : result.expandedKeys || [];
        this.checkedKeys = this.checkedKeys ? [...this.checkedKeys] : result.checkedKeys || [];
        this.selectedKeys = this.selectedKeys ? [...this.selectedKeys] : result.selectedKeys || [];
    }

    /**
     * 刷新
     * @param queryParam 查询参数
     */
    refresh(queryParam?: TreeQueryParameter) {
        if (queryParam) {
            this.queryParam = queryParam;
            this.queryParamChange.emit(queryParam);
        }
        this.queryParam.order = null;
        this.query();
    }

    /**
     * 清空数据
     */
    clear() {
        this.dataSource = [];
    }

    /**
     * 展开事件处理
     * @param event
     */
    expandChange(event) {
        this.loadChildren(event);
    }

    /**
     * 加载子节点列表
     */
    private loadChildren(event: NzFormatEmitEvent) {
        if (!event)
            return;
        let node = event.node;
        if (!node)
            return;
        let children = node.getChildren();
        if (children && children.length > 0)
            return;
        this.queryParam.operation = "LoadChild";
        this.queryParam.parentId = node.key;
        this.query({
            ok: result => {
                if (result && result.nodes && result.nodes.length > 0) {
                    node.addChildren(result.nodes);
                    return;
                }
                node.isLoading = false;
                node.isLeaf = true;
            },
            complete: () => {
                this.queryParam.operation = null;
                this.queryParam.parentId = null;
            }
        });
    }

    /**
     * 获取树节点列表
     */
    getNodes() {
        return this.tree.getTreeNodes();
    }

    /**
     * 获取节点
     * @param id 标识
     */
    getNodeById(id: string) {
        return this.tree.getTreeNodeByKey(id);
    }

    /**
     * 获取选中复选框的节点列表
     */
    getCheckedNodes() {
        return this.tree.getCheckedNodeList();
    }

    /**
     * 获取选中复选框的标识列表
     */
    getCheckedIds(): string {
        return this.getCheckedNodes().map(value => value.key).join(",");
    }

    /**
     * 获取选中的节点列表
     */
    getSelectedNodes() {
        return this.tree.getSelectedNodeList();
    }

    /**
     * 获取选中的标识列表
     */
    getSelectedIds(): string {
        return this.getSelectedNodes().map(value => value.key).join(",");
    }

    /**
     * 获取展开的节点列表
     */
    getExpandedNodes() {
        return this.tree.getExpandedNodeList();
    }

    /**
     * 获取展开的标识列表
     */
    getExpandedIds(): string {
        return this.getExpandedNodes().map(value => value.key).join(",");
    }
}