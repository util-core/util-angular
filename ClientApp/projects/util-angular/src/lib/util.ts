//============== util操作入口 ====================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, InjectFlags } from '@angular/core';
import * as Helper from './common/helper';
import { Ioc } from './common/ioc';
import { Message } from './message/message';
import { Router } from "./common/router";
import { Dialog } from "./dialog/dialog";
import { Http } from "./http/http";
import { WebApi } from "./webapi/web-api";
import { Form } from "./form/form";
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
     * 初始化操作入口
     * @param componentInjector 组件注入器
     */
    constructor(private componentInjector: Injector = null) {
    }

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
            this._dialog = new Dialog(this.ioc);
        return this._dialog;
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
        let config = this.injector.get<AppConfig>(AppConfig, <AppConfig>null, InjectFlags.Optional);
        if (!config)
            return;
        if (config.pageSize > 0)
            DefaultConfig.pageSize = config.pageSize;
    }
}
