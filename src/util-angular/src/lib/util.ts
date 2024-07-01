//============== util操作入口 ====================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { inject, Injector } from '@angular/core';
import * as Helper from './common/helper';
import { Ioc } from './common/ioc';
import { Message } from './message/message';
import { Notification } from './message/notification';
import { Router } from "./common/router";
import { Dialog } from "./dialog/dialog";
import { Drawer } from "./drawer/drawer";
import { Http } from "./http/http";
import { WebApi } from "./webapi/web-api";
import { Form } from "./form/form";
import { Cookie } from './common/cookie';
import { Storage } from './common/storage';
import { I18n } from "./common/i18n";
import { Sanitizer } from "./common/sanitizer";
import { Loading } from "./common/loading";
import { Url } from "./common/url";
import { Component } from "./common/component";
import { ChangeDetector } from "./common/change-detector";
import { Event } from "./common/event";
import { EventBus } from "./common/eventbus";
import { SessionService } from "./common/session.service";
import { ContextMenu } from "./common/context-menu";
import { ClipboardService } from "./common/clipboard.service";
import { Dom } from "./common/dom";
import { TenantService } from "./tenant/tenant.service";
import { Acl } from "./common/acl";
import { Responsive } from "./common/responsive";
import { Animation } from "./common/animation";
import { Fullscreen as FullscreenHelper } from "./common/fullscreen";
import { Fullscreen } from "./full-content/fullscreen";
import { AppConfig, initAppConfig } from './config/app-config';
import { DefaultConfig } from "./config/default-config";
import { ModuleConfig } from './config/module-config';

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
     * 通知操作
     */
    private _notification: Notification;
    /**
     * 路由操作
     */
    private _router: Router;
    /**
     * 对话框操作
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
     * 浏览器本地存储操作
     */
    private _storage: Storage;
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
     * 事件总线操作
     */
    private _eventbus: EventBus;
    /**
     * 上下文菜单操作
     */
    private _contextMenu: ContextMenu;
    /**
     * 用户会话操作
     */
    private _session: SessionService;
    /**
     * 租户操作
     */
    private _tenant: TenantService;
    /**
     * 剪贴板操作
     */
    private _clipboard: ClipboardService;
    /**
     * Dom操作
     */
    private _dom: Dom;
    /**
     * 访问控制操作
     */
    private _acl: Acl;
    /**
     * 响应式操作
     */
    private _responsive: Responsive;
    /**
     * 动画操作
     */
    private _animation: Animation;
    /**
     * 全屏操作
     */
    private _fullscreenHelper: FullscreenHelper;
    /**
     * 全屏服务
     */
    private _fullscreen: Fullscreen;

    /**
     * 初始化操作入口
     * @param injector 注入器
     * @param appConfig 应用配置
     * @param moduleConfig 模块配置
     */
    constructor(private injector: Injector = null, private appConfig: AppConfig = null, private moduleConfig: ModuleConfig = null) {
    }

    /**
     * 跟踪号
     */
    static traceId: string = Helper.uuid();

    /**
     * 公共操作
     */
    helper = Helper;

    /**
     * 创建Util实例
     */
    static create() {
        let config = inject(AppConfig, { optional: true });
        initAppConfig(config);
        let moduleConfig = inject(ModuleConfig, { optional: true });
        return new Util(inject(Injector), config, moduleConfig);
    }

    /**
     * Ioc操作
     */
    get ioc() {
        if (!this._ioc)
            this._ioc = new Ioc(this.injector);
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
     * 通知操作
     */
    get notification() {
        if (!this._notification)
            this._notification = new Notification(this);
        return this._notification;
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
     * 对话框操作
     */
    get dialog() {
        if (!this._dialog)
            this._dialog = new Dialog(this);
        return this._dialog;
    };

    /**
     * 对话框操作
     */
    get modal() {
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
     * 浏览器本地存储操作
     */
    get storage() {
        if (!this._storage)
            this._storage = new Storage(this);
        return this._storage;
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
            this._url = new Url(this, this.moduleConfig);
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
     * 事件总线操作
     */
    get eventbus() {
        if (!this._eventbus)
            this._eventbus = new EventBus(this);
        return this._eventbus;
    };

    /**
     * 上下文菜单操作
     */
    get contextMenu() {
        if (!this._contextMenu)
            this._contextMenu = new ContextMenu(this);
        return this._contextMenu;
    };

    /**
     * 用户会话操作
     */
    get session() {
        if (!this._session)
            this._session = new SessionService(this);
        return this._session;
    };

    /**
     * 租户操作
     */
    get tenant() {
        if (!this._tenant)
            this._tenant = new TenantService(this);
        return this._tenant;
    };

    /**
     * 剪贴板操作
     */
    get clipboard() {
        if (!this._clipboard)
            this._clipboard = new ClipboardService(this);
        return this._clipboard;
    };

    /**
     * Dom操作
     */
    get dom() {
        if (!this._dom)
            this._dom = new Dom(this);
        return this._dom;
    };

    /**
     * 访问控制操作
     */
    get acl() {
        if (!this._acl)
            this._acl = new Acl(this);
        return this._acl;
    };

    /**
     * 响应式操作
     */
    get responsive() {
        if (!this._responsive)
            this._responsive = new Responsive(this);
        return this._responsive;
    };

    /**
     * 动画操作
     */
    get animation() {
        if (!this._animation)
            this._animation = new Animation(this);
        return this._animation;
    };

    /**
     * 全屏操作
     */
    get fullscreenHelper() {
        if (!this._fullscreenHelper)
            this._fullscreenHelper = new FullscreenHelper(this);
        return this._fullscreenHelper;
    };

    /**
     * 全屏服务
     */
    get fullscreen() {
        if (!this._fullscreen)
            this._fullscreen = new Fullscreen(this);
        return this._fullscreen;
    };

    /**
     * 应用配置
     */
    get config() {
        if (!this.appConfig) {
            this.appConfig = inject(AppConfig, { optional: true });
            initAppConfig(this.appConfig);
        }
        return this.appConfig;
    };

    /**
     * 初始化
     */
    static init() {
        let util = Util.create();
        this.initPageSize(util.config);
    }

    /**
     * 初始化分页大小
     */
    private static initPageSize(config) {
        if (config.pageSize > 0)
            DefaultConfig.pageSize = config.pageSize;
    }
}
