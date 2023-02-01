//============== NgZorro树形扩展指令=======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter,Optional } from '@angular/core';
import { NzTreeNodeOptions, NzTreeNode, NzFormatEmitEvent, NzTreeComponent } from "ng-zorro-antd/tree";
import { NzTreeSelectComponent } from "ng-zorro-antd/tree-select";
import { Util } from "../util";
import { isUndefined } from "../common/helper";
import { FailResult } from "../core/fail-result";
import { LoadMode } from "../core/load-mode";
import { TreeQueryParameter } from "../core/tree-query-parameter";
import { AppConfig, initAppConfig } from '../config/app-config';

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
     * 树组件实例
     */
    public tree: NzTreeComponent | NzTreeSelectComponent;
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
     * 加载模式
     */
    @Input() loadMode: LoadMode;
    /**
     * 需要加载的标识列表
     */
    @Input() loadKeys: string;
    /**
     * 根节点异步加载模式是否展开子节点
     */
    @Input() isExpandForRootAsync: boolean;
    /**
     * 是否默认展开所有节点 - Tree组件
     */
    @Input() nzExpandAll: boolean;
    /**
     * 是否默认展开所有节点 - TreeSelect组件
     */
    @Input() nzDefaultExpandAll: boolean;
    /**
     * 是否异步加载
     */
    @Input() nzAsyncData: boolean;
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
     * 展开事件
     */
    @Output() onExpand = new EventEmitter<any>();
    /**
     * 折叠事件
     */
    @Output() onCollapse: EventEmitter<any> = new EventEmitter();
    /**
     * 子节点加载前事件,返回false停止加载
     */
    @Input() onLoadChildrenBefore: (node) => boolean;
    /**
     * 子节点加载完成事件
     */
    @Output() onLoadChildren: EventEmitter<any> = new EventEmitter();
    /**
     * 加载完成事件
     */
    @Output() onLoad = new EventEmitter<any>();

    /**
     * 初始化树形扩展指令
     */
    constructor(@Optional() treeComponent: NzTreeComponent, @Optional() treeSelectComponent: NzTreeSelectComponent, @Optional() public config: AppConfig) {
        this.initAppConfig();
        this.util = new Util(null, this.config);
        this.tree = treeComponent || treeSelectComponent;
        this.dataSource = new Array<any>();
        this.autoLoad = true;
        this.queryParam = new TreeQueryParameter();
        this.checkedKeys = [];
        this.selectedKeys = [];
    }

    /**
     * 初始化应用配置
     */
    private initAppConfig() {
        if (!this.config)
            this.config = new AppConfig();
        initAppConfig(this.config);
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
    load() {
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
        this.util.webapi.get<any>(url)
            .paramIf("load_keys", this.loadKeys, !isUndefined(this.loadKeys))
            .paramIf("is_search", "false", options.isSearch === false)
            .paramIf("is_expand_all", "true", this.nzExpandAll || this.nzDefaultExpandAll)
            .paramIf("loadMode", this.getLoadMode(), !isUndefined(this.getLoadMode()))
            .param(param).button(options.button).handle({
                before: () => {
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
                    options.complete && options.complete();
                }
            });
    }

    /**
     * 获取加载模式
     */
    private getLoadMode() {
        if (this.loadMode)
            return this.loadMode;
        if (this.nzAsyncData)
            return LoadMode.Async;
        return undefined;
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
        this.checkedKeys = result.checkedKeys || [];
        this.selectedKeys = result.selectedKeys || [];
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
        this.checkedKeys = [];
        this.selectedKeys = [];
    }

    /**
     * 折叠展开事件处理
     * @param event 节点展开事件
     */
    expandChange(event: NzFormatEmitEvent) {
        if (!event)
            return;
        let node = event.node;
        if (!node)
            return;
        let expand = event.node.isExpanded;
        this.loadChildren(node, expand);
        if (expand) {
            this.onExpand.emit(node);
            return;
        }
        this.onCollapse.emit(node);
    }

    /**
     * 加载下级节点
     */
    private loadChildren(node: NzTreeNode, expand) {
        if (!node)
            return;
        if (!expand)
            return;
        if (this.isLeaf(node))
            return;
        if (this.hasChildren(node))
            return;
        this.requestLoadChildren(node);
    }

    /**
     * 是否存在子节点
     */
    private hasChildren(node: NzTreeNode) {
        let children = node.getChildren();
        if (children && children.length > 0)
            return true;
        return false;
    }

    /**
     * 是否叶节点
     * @param node 节点
     */
    isLeaf(node: NzTreeNode) {
        if (!node)
            return false;
        return node.isLeaf;
    }

    /**
     * 请求加载下级节点
     */
    private requestLoadChildren(node: NzTreeNode) {
        this.queryParam.parentId = node.key;
        let url = this.loadChildrenUrl || this.url;
        this.util.webapi.get<any>(url).param(this.queryParam)
            .paramIf("loadMode", this.getLoadMode(), !isUndefined(this.getLoadMode()))
            .paramIf("is_expand_for_root_async", "false", this.isExpandForRootAsync === false)
            .handle({
                before: () => {
                    if (this.onLoadChildrenBefore)
                        return this.onLoadChildrenBefore(node);
                    return true;
                },
                ok: result => {
                    this.handleLoadChildren(node, result);
                    this.onLoadChildren.emit({ node: node, result: result });
                },
                complete: () => {
                    node.isLoading = false;
                    this.queryParam.parentId = null;
                }
        });
    }

    /**
     * 请求加载下级节点成功回调处理
     */
    private handleLoadChildren(node: NzTreeNode, result) {
        if (result && result.nodes && result.nodes.length > 0) {
            node.addChildren(result.nodes);
            return;
        }
        node.isLeaf = true;
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