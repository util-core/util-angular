//============== NgZorro树形表格扩展指令 ====================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//===========================================================
import { Directive, Input, Output, EventEmitter, Optional } from '@angular/core';
import { IKey } from "../core/key";
import { TreeNode } from "../core/tree-node";
import { PageList } from "../core/page-list";
import { AppConfig } from '../config/app-config';
import { FailResult } from "../core/fail-result";
import { LoadMode } from "../core/load-mode";
import { TableExtendDirective } from "./table.extend.directive";

/**
 * NgZorro树形表格扩展指令
 */
@Directive({
    selector: '[x-tree-table-extend]',
    exportAs: 'xTreeTableExtend'
})
export class TreeTableExtendDirective<TModel extends IKey> extends TableExtendDirective<TModel> {
    /**
     * 加载模式
     */
    @Input() loadMode: LoadMode;
    /**
     * 根节点异步加载模式是否展开子节点
     */
    @Input() isExpandForRootAsync: boolean;
    /**
     * 是否展开所有节点
     */
    @Input() isExpandAll: boolean;
    /**
     * 是否只能勾选叶节点
     */
    @Input() isCheckLeafOnly: boolean;
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
     * 初始化树形表格扩展指令
     * @param appConfig 应用配置
     */
    constructor(@Optional() public config: AppConfig) {
        super(config);
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
         * 页数
         */
        page?,
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
        if (options.page)
            param.page = options.page;
        if (!param.page)
            param.page = 1;
        this.util.webapi.get<any>(url)
            .paramIf("is_search", "false", options.isSearch === false)
            .paramIf("is_expand_all", "true", this.isExpandAll)
            .paramIf("loadMode", this.loadMode, !this.util.helper.isUndefined(this.loadMode))
            .param(param).button(options.button).handle({
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
     * 获取直接下级节点列表
     * @param node 节点
     */
    getChildren(node) {
        if (!node)
            return [];
        return this.dataSource.filter(t => t.parentId === node.id);
    }

    /**
     * 获取所有下级节点列表
     * @param node 节点
     */
    getAllChildren(node) {
        if (!node)
            return [];
        let result = [];
        this.addAllChildren(result, node);
        this.util.helper.remove(result, item => item === node);
        return result;
    }

    /**
     * 添加所有下级节点
     */
    private addAllChildren(list, node) {
        if (!node)
            return;
        list.push(node);
        let children = this.getChildren(node);
        if (!children || children.length === 0)
            return;
        children.forEach(item => this.addAllChildren(list, item));
    }

    /**
     * 获取上级节点
     * @param node 节点
     */
    getParent(node) {
        if (!node)
            return null;
        return this.dataSource.find(t => t.id === node.parentId);
    }

    /**
     * 获取所有上级节点列表
     * @param node 节点
     */
    getParents(node) {
        let result = [];
        this.addParents(result, node);
        return result;
    }

    /**
     * 添加所有上级节点
     */
    private addParents(list, node) {
        if (!node)
            return;
        let parent = this.getParent(node);
        if (!parent)
            return;
        list.push(parent);
        this.addParents(list, parent);
    }

    /**
     * 折叠展开操作
     * @param node 节点
     * @param expand 是否展开
     */
    collapse(node: TreeNode, expand) {
        if (!node)
            return;
        this.loadChildren(node, expand);
        node.expanded = !!expand;
        if (expand) {
            this.onExpand.emit(node);
            return;
        }
        this.onCollapse.emit(node);
    }

    /**
     * 加载下级节点
     */
    private loadChildren(node: TreeNode, expand) {
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
    private hasChildren(node: TreeNode) {
        return this.dataSource.some(t => t.parentId === node.id);
    }

    /**
     * 请求加载下级节点
     */
    private requestLoadChildren(node: TreeNode) {
        this.queryParam.parentId = node.id;
        let url = this.loadChildrenUrl || this.url;
        this.util.webapi.get<any>(url).param(this.queryParam)
            .paramIf("loadMode", this.loadMode, !this.util.helper.isUndefined(this.loadMode))
            .paramIf("is_expand_for_root_async", "false", this.isExpandForRootAsync === false)
            .handle({
                before: () => {
                    this.loading = true;
                    if (this.onLoadChildrenBefore)
                        return this.onLoadChildrenBefore(node);
                    return true;
                },
                ok: result => {
                    this.handleLoadChildren(node, result);
                    this.onLoadChildren.emit({ node: node, result: result });
                },
                complete: () => {
                    this.loading = false;
                    this.queryParam.parentId = null;
                }
        });
    }

    /**
     * 请求加载下级节点成功回调处理
     */
    private handleLoadChildren(node: TreeNode, result: PageList<any>) {
        if (result.data.length <= 0) {
            node.leaf = true;
            return;
        }
        let index = this.dataSource.indexOf(node);
        this.dataSource.splice(index + 1, 0, ...result.data);
        this.dataSource = this.dataSource;
    }

    /**
     * 是否叶节点
     * @param node 节点
     */
    isLeaf(node: TreeNode) {
        if (!node)
            return false;
        return node.leaf;
    }

    /**
     * 是否已展开
     * @param node 节点
     */
    isExpand(node: TreeNode) {
        if (!node)
            return false;
        return node.expanded;
    }

    /**
     * 是否显示行
     * @param node 节点
     */
    isShow(node) {
        if (!node)
            return false;
        if (node.level === 1)
            return true;
        let parent = this.getParent(node);
        if (!parent)
            return false;
        if (!parent.expanded)
            return false;
        return this.isShow(parent);
    }

    /**
     * 是否显示单选框
     * @param node 节点
     */
    isShowRadio(node) {
        if (!this.isCheckLeafOnly)
            return true;
        if (this.isLeaf(node))
            return true;
        return false;
    }

    /**
     * 节点复选框切换选中状态
     * @param node 节点
     */
    toggle(node) {
        this.checkedSelection.toggle(node);
        this.toggleAllChildren(node);
        this.toggleParents(node);
    }

    /**
     * 切换所有下级节点的选中状态
     */
    private toggleAllChildren(node) {
        let isChecked = this.isChecked(node);
        let nodes = this.getAllChildren(node);
        if (isChecked) {
            nodes.forEach(item => this.checkedSelection.select(item));
            return;
        }
        nodes.forEach(item => this.checkedSelection.deselect(item));
    }

    /**
     * 切换所有父节点选中状态
     */
    private toggleParents(node) {
        let parent = this.getParent(node);
        if (!parent)
            return;
        let isAllChecked = this.isChildrenAllChecked(parent);
        if (isAllChecked)
            this.checkedSelection.select(parent);
        else
            this.checkedSelection.deselect(parent);
        this.toggleParents(parent);
    }

    /**
     * 是否直接下级所有节点被选中
     */
    private isChildrenAllChecked(node) {
        let children = this.getChildren(node);
        if (!children || children.length === 0)
            return false;
        return children.every(item => this.checkedSelection.isSelected(item));
    }

    /**
     * 节点复选框的确定状态
     * @param node 节点
     */
    isIndeterminate(node) {
        let children = this.getAllChildren(node);
        if (!children || children.length === 0)
            return false;
        let isChecked = children.some(item => this.checkedSelection.isSelected(item));
        let isAllChecked = children.every(item => this.checkedSelection.isSelected(item));
        return isChecked && !isAllChecked;
    }
}

