//============== 数据加载器 ===========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import { Subscription } from "rxjs";
import { Util } from '../util';
import { IKey } from '../core/key';
import { FailResult } from '../core/fail-result';
import { DataContainer } from './data-container';
import { I18nKeys } from '../config/i18n-keys';

/**
 * 数据加载器
 */
export class DataLoader<T extends IKey> {
    /**
     * 数据容器
     */
    container: DataContainer<T>;
    /**
     * 是否显示进度条
     */
    loading: boolean = false;
    /**
     * Api地址
     */
    private _url: string;
    /**
     * 查询参数
     */
    private _queryParam;
    /**
     * 是否滚动加载
     */
    private _isScrollLoad: boolean;
    /**
     * 滚动事件
     */
    private _scrollEvent: Subscription;

    /**
     * 初始化数据加载器
     * @param util 操作入口
     */
    constructor(private util: Util) {
        this.container = new DataContainer<T>(util);
    }

    /**
     * 设置url
     * @param value url
     */
    url(value): DataLoader<T> {
        this._url = value;
        return this;
    }

    /**
     * 设置查询参数
     * @param param 查询参数
     */
    param(param): DataLoader<T> {
        this._queryParam = param;
        return this;
    }

    /**
     * 初始化滚动到底部加载事件
     */
    initOnScrollToBottomLoad() {
        this._scrollEvent && this._scrollEvent.unsubscribe();
        this._scrollEvent = this.util.event.onScrollToBottom({
            handler: () => {
                this.scrollToBottomLoad();
            }
        });
    }

    /**
     * 查询
     */
    query(options?: {
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
        page?:number,
        /**
         * 是否显示进度条
         */
        loading?: boolean,
        /**
         * 按钮
         */
        button?,
        /**
         * 是否将查询结果附加到当前数据集合,默认直接替换
         */
        isAppend?: boolean,
        /**
         * 请求前处理函数，返回false取消提交
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
        if (options.url)
            this._url = options.url;
        let url = this._url;
        if (!url)
            return;
        if (options.param)
            this._queryParam = options.param;
        let param = this._queryParam;
        if (!param)
            return;
        if (options.page)
            param.page = options.page;
        if (!param.page)
            param.page = 1;
        this.util.webapi.get<any>(url)
            .param(param)
            .loading(options.loading)
            .button(options.button)
            .handle({
                before: () => {
                    this.loading = true;
                    if (options.before)
                        return options.before();
                    return true;
                },
                ok: result => {
                    let data = !result.data ? result : result.data;
                    if (options.isAppend) {
                        this.container.addData(data);
                    }
                    else {
                        this.container.setData(data, result.total);
                    }
                    options.ok && options.ok(result);
                },
                fail: options.fail,
                complete: () => {
                    this.loading = false;
                    options.complete && options.complete();
                }
            });
    }

    /**
     * 删除
     * @param options 参数
     */
    delete(options?: {
        /**
         * 待删除的Id列表，多个Id用逗号分隔，范例：1,2,3
         */
        ids?: string,
        /**
         * 服务端删除Api地址
         */
        url?: string,
        /**
         * 请求前处理函数，返回false取消提交
         */
        before?: () => boolean;
        /**
         * 请求成功处理函数
         */
        ok?: (result?) => void;
    }) {
        options = options || {};
        let ids = options.ids || this.container.getCheckedIds();
        if (!ids) {
            this.util.message.warn(I18nKeys.noDeleteItemSelected);
            return;
        }
        this.util.message.confirm({
            content: I18nKeys.deleteConfirmation,
            onOk: () => this.deleteRequest(ids, options.before, options.ok, options.url)
        });
    }

    /**
     * 发送删除请求
     */
    private async deleteRequest(ids?: string, before?: () => boolean, ok?: (result?) => void, url?: string) {
        url = this.getDeleteUrl(url);
        if (!url)
            return;
        await this.util.webapi.post(url, ids).handleAsync({
            ok: () => {
                this.util.message.success(I18nKeys.deleteSuccessed);
                if (this._isScrollLoad) {
                    this.container.removeData(ids);                    
                    ok && ok();
                    return;
                }
                this.query({
                    before: before,
                    ok: result => {
                        ok && ok(result);
                    }
                });
            }
        });
    }

    /**
     * 获取删除地址
     */
    private getDeleteUrl(url) {
        return url || this.getUrl(this._url, "delete");
    }

    /**
     * 获取地址
     */
    private getUrl(url: string, path: string) {
        if (!url)
            return null;
        return this.util.helper.getUrl(url, null, path);
    }

    /**
     * 滚动到底部加载数据
     */
    scrollToBottomLoad(options?: {
        /**
         * 请求前处理函数，返回false取消提交
         */
        before?: () => boolean,
        /**
         * 请求成功处理函数
         */
        ok?: (result) => void
    }) {
        this._isScrollLoad = true;
        if (this.container.data.length >= this.container.total)
            return;
        if (this.container.isLoadCompleted)
            return;
        if (!this._queryParam)
            return;
        options = options || {};
        this._queryParam.page = this.util.helper.toNumber(this._queryParam.page) + 1;
        this.query({
            isAppend: true,
            before: options.before,
            ok: options.ok
        });
    }

    /**
     * 清理
     */
    clear() {
        this._scrollEvent && this._scrollEvent.unsubscribe();
        this._isScrollLoad = false;
        this.container.clear();
    }
}