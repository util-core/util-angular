//============== NgZorro树形扩展指令=======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Directive, Input, Output, OnInit, EventEmitter, Optional, ChangeDetectorRef } from '@angular/core';
import { NzTreeNodeOptions, NzTreeNode, NzFormatEmitEvent, NzTreeComponent } from "ng-zorro-antd/tree";
import { NzTreeSelectComponent } from "ng-zorro-antd/tree-select";
import { Util } from "../util";
import { isUndefined } from "../common/helper";
import { FailResult } from "../core/fail-result";
import { LoadMode } from "../core/load-mode";
import { TreeQueryParameter } from "../core/tree-query-parameter";
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro树形扩展指令
 */
@Directive({
    selector: '[x-tree-extend]',
    exportAs: 'xTreeExtend',
    standalone: true
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
    @Input() onLoadChildrenBefore: (node,param?) => boolean;
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
     * @param treeComponent 树形组件
     * @param treeSelectComponent 下拉树形组件
     * @param cdr 变更检测
     */
    constructor(@Optional() treeComponent: NzTreeComponent, @Optional() treeSelectComponent: NzTreeSelectComponent,
        protected cdr: ChangeDetectorRef) {
        this.util = Util.create();
        this.tree = treeComponent || treeSelectComponent;
        this.dataSource = new Array<any>();
        this.autoLoad = true;
        this.queryParam = new TreeQueryParameter();
        this.checkedKeys = [];
        this.selectedKeys = [];
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
                    this.cdr.markForCheck();
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
     * 是否包含子节点
     */
    hasChildren(node: NzTreeNode): boolean {
        let children = node.getChildren();
        return children && children.length > 0;
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
        if (this.onLoadChildrenBefore && this.onLoadChildrenBefore(node, this.queryParam)=== false)
            return;
        this.util.webapi.get<any>(url).param(this.queryParam)
            .paramIf("loadMode", this.getLoadMode(), !isUndefined(this.getLoadMode()))
            .paramIf("is_expand_for_root_async", "false", this.isExpandForRootAsync === false)
            .handle({
                before: () => {                    
                    return true;
                },
                ok: result => {
                    this.handleLoadChildren(node, result);
                    this.onLoadChildren.emit({ node: node, result: result });                    
                },
                complete: () => {
                    node.isLoading = false;
                    this.queryParam.parentId = null;
                    this.cdr.markForCheck();
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
     * 获取所有父节点
     * @param node 树节点
     * @param excludeSelf 是否排除当前节点,默认排除自身
     */
    getParentNodes(node: NzTreeNode, excludeSelf: boolean = true): NzTreeNode[] {
        let result = new Array<NzTreeNode>();
        if (!node)
            return result;
        if (!excludeSelf)
            result.push(node);
        this.addParentNode(result, node.getParentNode());
        return result.reverse();
    }

    /**
     * 添加父节点
     */
    private addParentNode(result: Array<NzTreeNode>, parentNode: NzTreeNode) {
        if (!parentNode)
            return result;
        result.push(parentNode);
        return this.addParentNode(result, parentNode.getParentNode());
    }

    /**
     * 获取根节点
     * @param node 树节点
     */
    getRootNode(node: NzTreeNode): NzTreeNode {
        if (!node)
            return null;
        if (node.level === 0)
            return node;
        return this.getRootNode(node.getParentNode());
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

    /**
     * 获取第一个节点
     */
    getFirstNode() {
        let nodes = this.getNodes();
        if (!nodes || nodes.length === 0)
            return null;
        return nodes[0];
    }

    /**
     * 展开节点
     * @param node 节点
     */
    expandNode(node: NzTreeNode) {
        if (!node)
            return;
        this.loadChildren(node, true);
        node.isExpanded = true;
        this.onExpand.emit(node);
    }

    /**
     * 刷新新增节点
     * @param options 配置
     */
    refreshNew(options: {        
        /**
         * 新增节点,可以传入NzTreeNode,NzTreeNodeOptions,NzTreeNodeOptions[]类型
         */
        node,
        /**
         * 父节点
         */
        parentNode?: NzTreeNode,
        /**
         * 加载子节点地址
         */
        url?,
        /**
         * 加载子节点参数
         */
        param?,
        /**
         * 刷新成功处理函数
         */
        ok?: () => void;
    }) {
        if (!options)
            return;
        if (!options.node)
            return;
        let origin: NzTreeNodeOptions = this.getOrigin(options.node);
        let parentId = this.getParentId(origin);
        let parentNode = options.parentNode || this.tree.getTreeNodeByKey(parentId);
        parentNode.isLeaf = false;
        if (this.hasChildren(parentNode)) {
            parentNode.addChildren([origin]);
            parentNode.isExpanded = true;
            options.ok && options.ok();
            return;
        }
        let url = options.url || this.loadChildrenUrl || this.url;
        let param = options.param || this.queryParam;
        if (parentNode.key)
            param.parentId = parentNode.key;
        this.util.webapi.get<any>(url).param(param)
            .paramIf("loadMode", this.getLoadMode(), !isUndefined(this.getLoadMode()))
            .paramIf("is_expand_for_root_async", "false", this.isExpandForRootAsync === false)
            .handle({
                ok: result => {
                    if (result && result.nodes && result.nodes.length > 0)
                        parentNode.addChildren(result.nodes);
                    parentNode.isExpanded = true;
                    options.ok && options.ok();
                }
            });
    }

    /**
     * 获取树节点数据
     */
    private getOrigin(node): NzTreeNodeOptions{
        let nodes = node.nodes;
        let origin: NzTreeNodeOptions = nodes && nodes.length > 0 && nodes[0];
        return origin || node.origin || node;
    }

    /**
     * 获取父标识
     */
    private getParentId(origin: NzTreeNodeOptions) {
        if (!origin)
            return null;
        let model = origin["originalNode"];
        return model && model.parentId;
    }

    /**
     * 刷新更新节点
     * @param options 配置
     */
    refreshUpdate(options: {
        /**
         * 更新后节点,可以传入NzTreeNode,NzTreeNodeOptions,NzTreeNodeOptions[]类型
         */
        node,        
        /**
         * 加载子节点地址
         */
        url?,
        /**
         * 加载子节点参数
         */
        param?,
        /**
         * 父节点是否变化回调函数
         */
        isParentChange?: (originalParentId, newParentId) => boolean;
        /**
         * 刷新成功处理函数
         */
        ok?: (node: NzTreeNode) => void;
    }) {
        if (!options)
            return;
        if (!options.node)
            return;
        let origin: NzTreeNodeOptions = this.getOrigin(options.node);
        let originalNode = this.tree.getTreeNodeByKey(origin.key);
        let originalParentNode = originalNode.getParentNode();
        let originalParentId = originalParentNode && originalParentNode.key;        
        originalNode.title = origin.title;
        originalNode.origin = origin;
        let newParentId = this.getParentId(origin);
        if (!this.isParentChange(originalParentId, newParentId, options.isParentChange)) {
            options.ok && options.ok(originalNode);
            return;
        }
        this.util.helper.remove(originalParentNode.children, t => t.key === origin.key);
        let newParentNode = this.tree.getTreeNodeByKey(newParentId);
        newParentNode.isLeaf = false;
        originalNode.parentNode = newParentNode;
        if (this.hasChildren(newParentNode)) {
            newParentNode.addChildren([originalNode]);
            newParentNode.isExpanded = true;
            options.ok && options.ok(originalNode);
            return;
        }
        let url = options.url || this.loadChildrenUrl || this.url;
        let param = options.param || this.queryParam;
        if (newParentNode.key)
            param.parentId = newParentNode.key;
        this.util.webapi.get<any>(url).param(param)
            .paramIf("loadMode", this.getLoadMode(), !isUndefined(this.getLoadMode()))
            .paramIf("is_expand_for_root_async", "false", this.isExpandForRootAsync === false)
            .handle({
                ok: result => {
                    if (result && result.nodes && result.nodes.length > 0)
                        newParentNode.addChildren(result.nodes);
                    newParentNode.isExpanded = true;
                    options.ok && options.ok(this.tree.getTreeNodeByKey(origin.key));
                }
            });
    }

    /**
     * 父节点是否变化
     */
    private isParentChange(originalParentId, newParentId, isParentChange?: (originalParentId, newParentId) => boolean) {        
        if (!originalParentId && !newParentId)
            return false;
        if (originalParentId === newParentId)
            return false;
        if (isParentChange)
            return isParentChange(originalParentId, newParentId);
        return true;
    }

    /**
     * 删除节点,发送Http Delete请求
     * @param options 配置
     */
    delete(options: {
        /**
         * 节点
         */
        node: NzTreeNode,
        /**
         * 删除请求地址
         */
        url?: string,
        /**
         * 删除成功处理函数
         */
        ok?: () => void;

    }) {
        if (!options)
            return;
        if (!options.node) {
            this.util.message.warn(I18nKeys.noDeleteItemSelected);
            return;
        }
        let url = options.url || this.url;
        url = this.util.helper.trimEnd(url, "/");
        url = this.util.helper.trimEnd(url, options.node.key);
        url = this.util.helper.trimEnd(url, "/");
        url = `${url}/${options.node.key}`;
        this.util.message.confirm({
            content: I18nKeys.deleteConfirmation,
            onOk: () => {
                this.util.webapi.delete<any>(url)
                    .handle({
                        ok: () => {
                            options.node.remove();
                            options.ok && options.ok();
                        }
                    });
            }
        });
    }
    
}