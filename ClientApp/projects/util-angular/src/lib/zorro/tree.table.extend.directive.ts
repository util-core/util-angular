//============== NgZorro树形表格扩展指令 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===========================================================
import { Directive, Input, Output, EventEmitter, Optional } from '@angular/core';
import { IKey } from "../core/key";
import { TreeNode } from "../core/tree-node";
import { PageList } from "../core/page-list";
import { FailResult } from "../core/fail-result";
import { LoadMode } from "../core/load-mode";
import { TableExtendDirective } from "./table.extend.directive";
import { AppConfig } from '../config/app-config';
import { I18nKeys } from '../config/i18n-keys';

/**
 * NgZorro树形表格扩展指令
 */
@Directive({
    selector: '[x-tree-table-extend]',
    exportAs: 'xTreeTableExtend'
})
export class TreeTableExtendDirective<TModel extends IKey> extends TableExtendDirective<TModel> {
    /**
     * 是否搜索 
     */
    private isSearch: boolean;
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
     * @param config 应用配置
     */
    constructor(@Optional() config: AppConfig) {
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
     * 搜索
     */
    search(options?: {
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
        this.query({
            isSearch: true,
            page: 1,
            button: options.button,
            url: options.url,
            param: options.param,
            before: options.before,
            ok: options.ok,
            fail: options.fail,
            complete: options.complete            
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
        this.initIsSearch(options.isSearch);
        let param = options.param || this.queryParam;
        if (options.page)
            param.page = options.page;
        if (!param.page)
            param.page = 1;
        this.util.webapi.get<any>(url)
            .paramIf("is_search", "false", this.isSearch ===false)
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
     * 初始化是否查询
     */
    private initIsSearch(isSearch) {
        if (this.util.helper.isUndefined(isSearch))
            return;
        this.isSearch = isSearch;
    }

    /**
     * 加载数据
     */
    loadData(result) {
        result = new PageList<TModel>(result);
        this.dataSource = result.data || [];
        this.total = result.total;
        if (this.queryParam.pageSize != result.pageSize)
            this.queryParam.pageSize = result.pageSize;        
        this.checkedSelection.clear();
        this.checkIds(this.checkedKeys);
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
        node.expanded = !!expand;
        if (expand) {
            this.loadChildren(node);
            this.onExpand.emit(node);
            return;
        }
        this.onCollapse.emit(node);
    }

    /**
     * 加载下级节点
     * @param node 节点
     * @param handler 成功加载回调函数
     */
    loadChildren(node: TreeNode, handler?: (node: TreeNode, result) => void) {
        if (!node)
            return;
        if (this.isLeaf(node))
            return;
        if (this.hasChildren(node))
            return;
        this.requestLoadChildren(node, handler);
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
    private requestLoadChildren(node: TreeNode, handler?: (node: TreeNode, result) => void) {
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
                    handler && handler(node,result);
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
     * 是否根节点
     * @param node 节点
     */
    isRoot(node: TreeNode) {
        if (!node)
            return false;
        let parent = this.getParent(node);
        return !parent;
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
     * 展开节点
     * @param node 节点
     */
    expand(node) {
        if (!node)
            return;
        node.expanded = true;
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

    /**
     * 启用
     * @param options 参数
     */
    enable(options?: {
        /**
         * 待启用的Id列表，多个Id用逗号分隔，范例：1,2,3
         */
        ids?: string,
        /**
         * 服务端Api地址
         */
        url?: string,
        /**
         * 请求前处理函数，返回false则取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         */
        ok?: () => void;
    }) {
        options = options || {};
        let ids = options.ids || this.getCheckedIds();
        if (!ids) {
            this.util.message.warn(I18nKeys.notSelected);
            return;
        }
        let url = options.url || this.getUrl(this.url, "enable");
        this.util.message.confirm({
            content: I18nKeys.enableConfirmation,
            onOk: () => this.enableRequest(ids, options.before, options.ok, url)
        });
    }

    /**
     * 发送启用请求
     */
    private async enableRequest(ids?: string, before?: () => boolean, ok?: () => void, url?: string) {
        if (!url)
            return;
        await this.util.webapi.post(url, ids).handleAsync({
            ok: () => {
                this.util.message.success(I18nKeys.succeeded);
                this.query({
                    before: before,
                    ok: result => {
                        this.loadData(result);
                        ok && ok();
                    }
                });
            }
        });
    }

    /**
     * 禁用
     * @param options 参数
     */
    disable(options?: {
        /**
         * 待禁用的Id列表，多个Id用逗号分隔，范例：1,2,3
         */
        ids?: string,
        /**
         * 服务端Api地址
         */
        url?: string,
        /**
         * 请求前处理函数，返回false则取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         */
        ok?: () => void;
    }) {
        options = options || {};
        let ids = options.ids || this.getCheckedIds();
        if (!ids) {
            this.util.message.warn(I18nKeys.notSelected);
            return;
        }
        let url = options.url || this.getUrl(this.url, "disable");
        this.util.message.confirm({
            content: I18nKeys.disableConfirmation,
            onOk: () => this.enableRequest(ids, options.before, options.ok, url)
        });
    }

    /**
     * 刷新
     * @param queryParam 查询参数
     * @param button 按钮
     * @param handler 刷新成功回调函数
     */
    refresh(queryParam?, button?, handler?: (result) => void) {
        this.isSearch = false;
        super.refresh(queryParam, button, handler);
    }

    /**
     * 刷新单个节点
     * @param data 单个对象数据
     */
    protected refreshNode(data) {
        if (!data)
            return;
        if (!data.id)
            return;
        if (this.isNew(data)) {
            this.refreshNewNode(data);
            return;
        }
        this.refreshUpdateNode(data);
    }

    /**
     * 是否新增
     */
    private isNew(data) {
        return !this.dataSource.some(t => t.id === data.id);
    }

    /**
     * 刷新新增节点
     */
    private refreshNewNode(data) {
        if (this.isRoot(data)) {
            this.load();
            return;
        }
        let lastIndex = 0;
        for (var i = 0; i < this.dataSource.length; i++) {
            let item = this.dataSource[i];
            if (item.parentId === data.parentId || item.id === data.parentId) {
                lastIndex = i;
            }
        }
        let parent = this.getParent(data);
        this.expand(parent);
        this.initNewNode(data);
        if (this.hasChildren(parent) || this.isLeaf(parent)) {
            this.dataSource.splice(lastIndex + 1, 0, data);
            this.dataSource = this.dataSource;
            return;
        }
        this.loadChildren(parent, (node, result) => {
            let item = this.dataSource.find(t => t.id === data.id);
            this.initNewNode(item);
        });        
    }

    /**
     * 初始化新增节点
     */
    private initNewNode(data) {
        this.expand(data);
        data.leaf = true;
    }

    /**
     * 刷新更新节点
     */
    private refreshUpdateNode(data) {
        for (var i = 0; i < this.dataSource.length; i++) {
            let item = this.dataSource[i];
            if (item.id === data.id) {
                let index = this.dataSource.indexOf(item);
                data.leaf = item.leaf;
                data.expanded = item.expanded;
                this.dataSource[index] = data;
                return;
            }
        }
    }
}

