//============== util操作入口 ====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector } from '@angular/core';
import * as Helper from './common/helper';
import { Ioc } from './common/ioc';
import { Message } from './message/message';
import { Router } from "./common/router";
import { Dialog } from "./dialog/dialog";
import { Drawer } from "./drawer/drawer";
import { Http } from "./http/http";
import { WebApi } from "./webapi/web-api";
import { Form } from "./form/form";
import { Cookie } from './common/cookie';
import { I18n } from "./common/i18n";
import { Sanitizer } from "./common/sanitizer";
import { Loading } from "./common/loading";
import { Url } from "./common/url";
import { Component } from "./common/component";
import { ChangeDetector } from "./common/change-detector";
import { Event } from "./common/event";
import { AppConfig } from './config/app-config';
import { DefaultConfig } from "./config/default-config";

/**
 * 操作入口
 */
export class Util {
    /**
     * Ioc操作
     */
    private _ioc: Ioc;
    /**
     * 消息操作
     */
    private _message: Message;
    /**
     * 路由操作
     */
    private _router: Router;
    /**
     * 弹出层操作
     */
    private _dialog: Dialog;
    /**
     * 抽屉操作
     */
    private _drawer: Drawer;
    /**
     * Http操作
     */
    private _http: Http;
    /**
     * WebApi操作
     */
    private _webapi: WebApi;
    /**
     * Form操作
     */
    private _form: Form;
    /**
     * Cookie操作
     */
    private _cookie: Cookie;
    /**
     * 国际化操作
     */
    private _i18n: I18n;
    /**
     * 清理操作
     */
    private _sanitizer: Sanitizer;
    /**
     * 加载操作
     */
    private _loading: Loading;
    /**
     * Url操作
     */
    private _url: Url;
    /**
     * 组件操作
     */
    private _component: Component;
    /**
     * 变更检测操作
     */
    private _changeDetector: ChangeDetector;
    /**
     * 事件操作
     */
    private _event: Event;

    /**
     * 初始化操作入口
     * @param componentInjector 组件注入器
     * @param appConfig 应用配置
     */
    constructor(private componentInjector: Injector = null, private appConfig: AppConfig = null) {
    }

    /**
     * 跟踪号
     */
    static traceId: string = Helper.uuid();

    /**
     * 全局注入器
     */
    static injector: Injector;

    /**
     * 公共操作
     */
    helper = Helper;

    /**
     * Ioc操作
     */
    get ioc() {
        if (!this._ioc)
            this._ioc = new Ioc(Util.injector, this.componentInjector);
        return this._ioc;
    };

    /**
     * 消息操作
     */
    get message() {
        if (!this._message)
            this._message = new Message(this);
        return this._message;
    };

    /**
     * 路由操作
     */
    get router() {
        if (!this._router)
            this._router = new Router(this.ioc);
        return this._router;
    };

    /**
     * 弹出层操作
     */
    get dialog() {
        if (!this._dialog)
            this._dialog = new Dialog(this);
        return this._dialog;
    };

    /**
     * 抽屉操作
     */
    get drawer() {
        if (!this._drawer)
            this._drawer = new Drawer(this);
        return this._drawer;
    };

    /**
     * Http操作
     */
    get http() {
        if (!this._http)
            this._http = new Http(this.ioc);
        return this._http;
    };

    /**
     * WebApi操作
     */
    get webapi() {
        if (!this._webapi)
            this._webapi = new WebApi(this);
        return this._webapi;
    };

    /**
     * Form操作
     */
    get form() {
        if (!this._form)
            this._form = new Form(this);
        return this._form;
    };

    /**
     * Cookie操作
     */
    get cookie() {
        if (!this._cookie)
            this._cookie = new Cookie(this);
        return this._cookie;
    };

    /**
     * 清理操作
     */
    get sanitizer() {
        if (!this._sanitizer)
            this._sanitizer = new Sanitizer(this);
        return this._sanitizer;
    };

    /**
     * 国际化操作
     */
    get i18n() {
        if (!this._i18n)
            this._i18n = new I18n(this);
        return this._i18n;
    };

    /**
     * 加载操作
     */
    get loading() {
        if (!this._loading)
            this._loading = new Loading(this);
        return this._loading;
    };

    /**
     * Url操作
     */
    get url() {
        if (!this._url)
            this._url = new Url(this);
        return this._url;
    };

    /**
     * 组件操作
     */
    get component() {
        if (!this._component)
            this._component = new Component(this);
        return this._component;
    };

    /**
     * 变更检测操作
     */
    get changeDetector() {
        if (!this._changeDetector)
            this._changeDetector = new ChangeDetector(this);
        return this._changeDetector;
    };

    /**
     * 事件操作
     */
    get event() {
        if (!this._event)
            this._event = new Event(this);
        return this._event;
    };

    /**
     * 初始化
     * @param injector 全局注入器
     */
    static init(injector: Injector) {
        this.injector = injector;
        this.initPageSize();
    }

    /**
     * 初始化分页大小
     */
    private static initPageSize() {
        let config = this.injector.get<AppConfig>(AppConfig, null, { optional: true });
        if (!config)
            return;
        if (config.pageSize > 0)
            DefaultConfig.pageSize = config.pageSize;
    }

    /**
     * 获取应用配置
     */
    getAppConfig() {
        if (this.appConfig)
            return this.appConfig;
        return this.ioc.get(AppConfig);
    }
}
