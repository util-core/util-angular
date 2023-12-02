//============== 树形操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { Util } from "../util";
import { LoadMode } from "../core/load-mode";
import { I18nKeys } from '../config/i18n-keys';

/**
 * 树形操作
 */
export class TreeHelper {
    /**
     * 初始化树形操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
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
     * 刷新新增节点
     * @param options 配置
     */
    refreshNew(options: {
        /**
         * 父节点
         */
        parentNode: NzTreeNode,
        /**
         * 新增节点
         */
        newNodes,
        /**
         * 加载子节点请求地址
         */
        loadChildrenUrl: string,
        /**
         * 加载子节点请求参数
         */
        param?,
        /**
         * 加载模式
         */
        loadMode?: LoadMode,
        /**
         * 根节点异步加载模式是否展开子节点
         */
        isExpandForRootAsync?: boolean

    }) {
        if (!options)
            return;
        if (!options.parentNode)
            return;
        if (!options.newNodes)
            return;
        let nodes = options.newNodes.nodes || options.newNodes;
        let parentNode = options.parentNode;
        parentNode.isLeaf = false;
        if (this.hasChildren(parentNode)) {
            parentNode.addChildren(nodes);
            parentNode.isExpanded = true;
            return;
        }
        this.util.webapi.get<any>(options.loadChildrenUrl).param(options.param)
            .paramIf("loadMode", options.loadMode, !this.util.helper.isUndefined(options.loadMode))
            .paramIf("is_expand_for_root_async", "false", options.isExpandForRootAsync === false)
            .handle({
                ok: result => {
                    if (result && result.nodes && result.nodes.length > 0)
                        parentNode.addChildren(result.nodes);
                    parentNode.isExpanded = true;
                }
            });
    }

    /**
     * 是否包含子节点
     */
    hasChildren(node: NzTreeNode): boolean{
        let children = node.getChildren();
        if (children && children.length > 0)
            return true;
        return false;
    }

    /**
     * 删除节点,发送Http Delete请求
     * @param options 配置
     */
    deleteNode(options: {
        /**
         * 节点
         */
        node: NzTreeNode,
        /**
         * 删除请求地址
         */
        url: string

    }) {
        if (!options)
            return;
        if (!options.node) {
            this.util.message.warn(I18nKeys.noDeleteItemSelected);
            return;
        }
        if (!options.url)
            return;
        let url = this.util.helper.trimEnd(options.url, "/");
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
                    }
                });
            }
        });
    }
}