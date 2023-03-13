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
        /**
         * 添加所有上级节点
         */
        let addParents = (list, node) => {
            if (!node)
                return;
            let parent = this.getParent(node);
            if (!parent)
                return;
            list.push(parent);
            addParents(list, parent);
        };

        let result = [];
        addParents(result, node);
        return result;
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
     * @param isContainsNode 是否包含父节点
     */
    getAllChildren(node, isContainsNode: boolean = false) {
        /**
         * 添加所有下级节点
         */
        let addChildren = (list, node) => {
            if (!node)
                return;
            list.push(node);
            let children = this.getChildren(node);
            if (!children || children.length === 0)
                return;
            children.forEach(item => addChildren(list, item));
        };

        if (!node)
            return [];
        let result = [];
        addChildren(result, node);
        if (!isContainsNode)
            this.util.helper.remove(result, item => item === node);
        return result;
    }

    /**
     * 获取下级最后一个节点
     * @param node 节点
     * @param excludeNode 需要排除的节点
     */
    getLastChild(node, excludeNode = null) {
        if (!node)
            return null;
        let children = this.getAllChildren(node);
        if (excludeNode) {
            if (!excludeNode.id)
                excludeNode = this.getById(excludeNode);
            let excludeNodes = this.getAllChildren(excludeNode, true);
            children = children.filter(value => !excludeNodes.some(t => t.id === value.id));
        }
        if (children && children.length > 0)
            return children[children.length - 1];
        return null;
    }

    /**
     * 是否存在子节点
     * @param node 节点
     * @param excludeNode 需要排除的节点
     */
    hasChildren(node, excludeNode = null) {
        let excludeId = excludeNode && excludeNode.id;
        if (excludeId)
            return this.dataSource.some(t => t.parentId === node.id && t.id != excludeId);
        return this.dataSource.some(t => t.parentId === node.id);
    }

    /**
    * 移除节点
    */
    removeNode(node) {
        let index = this.dataSource.indexOf(node);
        if (index < 0)
            return;
        this.dataSource.splice(index, 1);
    }

    /**
    * 移除直接下级节点
    * @param node 节点
    * @param isRemoveSelf 是否移除节点自身
    */
    removeChildren(node, isRemoveSelf?: boolean) {
        if (!node)
            return;
        if (isRemoveSelf)
            this.removeNode(node);
        let nodes = this.getChildren(node);
        nodes.forEach(item => {
            this.removeNode(item);
        });
    }

    /**
    * 移除所有下级节点
    * @param node 节点
    * @param isRemoveSelf 是否移除节点自身
    */
    removeAllChildren(node, isRemoveSelf?: boolean) {
        if (!node)
            return;
        if (isRemoveSelf)
            this.removeNode(node);
        let nodes = this.getAllChildren(node);
        nodes.forEach(item => {
            this.removeNode(item);
        });
    }

    /**
     * 移动节点,将节点及节点下所有子节点移动到目标父节点下
     * @param node 节点
     * @param parent 移动到目标父节点下方,为空则设置为根节点
     */
    moveNode(node, parent = null) {
        let getLastIndex = (lastNode) => {
            if (!lastNode)
                return this.dataSource.length -1;
            return this.dataSource.findIndex(value => value.id === lastNode.id);
        };

        let lastNode = this.getLastChild(parent, node);
        if (!lastNode)
            lastNode = parent;
        let nodes = this.getAllChildren(node, true);
        nodes.forEach(node => {
            let nodeParent = this.getParent(node);
            let parentLevel = this.util.helper.toNumber( nodeParent && nodeParent.level ) || 0;            
            node.level = parentLevel + 1;
            this.removeNode(node);
            let lastIndex = getLastIndex(lastNode);
            this.dataSource.splice(lastIndex + 1, 0, node);
            lastNode = node;
        });
    }

    /**
     * 是否叶节点
     * @param node 节点
     */
    isLeaf(node) {
        if (!node)
            return false;
        return node.leaf;
    }

    /**
     * 是否根节点
     * @param node 节点
     */
    isRoot(node) {
        if (!node)
            return false;
        let parent = this.getParent(node);
        return !parent;
    }

    /**
     * 是否已展开
     * @param node 节点
     */
    isExpand(node) {
        if (!node)
            return false;
        return node.expanded;
    }

    /**
     * 是否显示
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
            .paramIf("is_search", "false", this.isSearch === false)
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
     * @param hasChildren 是否存在子节点
     */
    loadChildren(node: TreeNode, handler?: (node: TreeNode, result) => void, hasChildren: boolean | null = null) {
        if (!node)
            return;
        if (this.isLeaf(node))
            return;
        if (hasChildren === true)
            return;
        if (hasChildren === null && this.hasChildren(node))
            return;
        this.requestLoadChildren(node, handler);
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
                    handler && handler(node, result);
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
        this.dataSource = [...this.dataSource];
    }

    /**
     * 节点复选框切换选中状态
     * @param node 节点
     */
    toggle(node) {
        /**
         * 切换所有下级节点的选中状态
         */
        let toggleAllChildren = (node) => {
            let isChecked = this.isChecked(node);
            let nodes = this.getAllChildren(node);
            if (isChecked) {
                nodes.forEach(item => this.checkedSelection.select(item));
                return;
            }
            nodes.forEach(item => this.checkedSelection.deselect(item));
        };

        /**
         * 是否直接下级所有节点被选中
         */
        let isChildrenAllChecked = (node) => {
            let children = this.getChildren(node);
            if (!children || children.length === 0)
                return false;
            return children.every(item => this.checkedSelection.isSelected(item));
        };

        /**
         * 切换所有父节点选中状态
         */
        let toggleParents = (node) => {
            let parent = this.getParent(node);
            if (!parent)
                return;
            let isAllChecked = isChildrenAllChecked(parent);
            if (isAllChecked)
                this.checkedSelection.select(parent);
            else
                this.checkedSelection.deselect(parent);
            toggleParents(parent);
        };

        this.checkedSelection.toggle(node);
        toggleAllChildren(node);
        toggleParents(node);
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
     * 刷新单个实体
     * @param model 实体对象
     */
    refreshByModel(model) {
        this.refreshNode(model);
    }

    /**
     * 刷新单个节点
     * @param data 实体对象
     */
    protected refreshNode(data) {
        /**
         * 是否新增
         */
        let isNew = (node) => {
            return !this.dataSource.some(t => t.id === node.id);
        }

        /**
         * 刷新父节点
         */
        let refreshParent = (node, handler?: () => void, loadChildrenBefore?: () => void) => {
            let parent = this.getParent(node);
            this.expand(parent);
            if (this.hasChildren(parent, node) || this.isLeaf(parent)) {
                parent.leaf = false;
                this.moveNode(node, parent);
                return;
            }
            loadChildrenBefore && loadChildrenBefore();
            this.loadChildren(parent, () => {
                handler && handler();
            },false);
        };

        /**
        * 刷新新增节点
        */
        let refreshNewNode = (data) => {
            /**
             * 初始化新增节点
             */
            let initNewNode = (node) => {
                this.expand(node);
                node.leaf = true;
            }

            if (this.isRoot(data)) {
                this.load();
                return;
            }
            initNewNode(data);
            refreshParent(data, () => {
                let item = this.getById(data.id);
                initNewNode(item);
            });
        }

        /**
         * 刷新更新节点
         */
        let refreshUpdateNode = (data) => {
            /**
             * 初始化更新节点
             */
            let initUpdateNode = (newNode, originalNode) => {
                newNode.leaf = originalNode.leaf;
                newNode.expanded = originalNode.expanded;
                let index = this.dataSource.indexOf(originalNode);
                this.dataSource[index] = newNode;
            }

            /**
             * 将节点及所有子节点移动到目标父节点下
             */
            let moveToParent = (node) => {                
                refreshParent(node, null, () => {
                    this.removeAllChildren(node, true);
                });
            }

            for (var i = 0; i < this.dataSource.length; i++) {
                let item = this.dataSource[i];
                if (item.id === data.id) {
                    initUpdateNode(data, item);
                    if (item.parentId !== data.parentId)
                        moveToParent(data);
                    return;
                }
            }
        }

        if (!data)
            return;
        if (!data.id)
            return;
        if (isNew(data))
            refreshNewNode(data);        
        else
            refreshUpdateNode(data);
        this.dataSource = [...this.dataSource];
    }
}

