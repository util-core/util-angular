//============== Crud编辑组件基类=================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Component, ViewChild, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Util } from "../util";
import { AppConfig } from '../config/app-config';
import { ViewModel } from "../core/view-model";

/**
 * Crud编辑组件基类
 */
@Component({
    template: ''
})
export abstract class EditComponentBase<TViewModel extends ViewModel> implements OnInit {
    /**
     * 公共操作
     */
    protected util: Util;
    /**
     * 应用配置
     */
    protected appConfig: AppConfig;
    /**
     * 表单
     */
    @ViewChild(NgForm) protected form: NgForm;
    /**
     * 模型
     */
    model: TViewModel;
    /**
     * 是否创建
     */
    isNew: boolean;
    /**
     * 标识
     */
    @Input() id;
    /**
     * 数据
     */
    @Input() data;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        this.util = new Util(injector);
        this.appConfig = this.util.ioc.get(AppConfig);
        this.isNew = true;
        this.model = this.createModel();
    }

    /**
     * 创建模型
     */
    protected createModel(): TViewModel {
        return <TViewModel>{};
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.loadById();
    }

    /**
     * 通过标识加载
     * @param id 标识
     */
    protected loadById(id = null) {
        if (this.loadBefore() === false)
            return;
        if (this.isRequestLoad() === false && this.data) {
            let model = this.toModel(this.data);
            this.loadModel(model);
            return;
        }
        id = id || this.id || this.util.router.getParam("id");
        if (!id)
            return;
        this.util.webapi.get<TViewModel>(this.getLoadUrl(id)).handle({
            ok: result => {
                let model = this.toModel(result);
                this.loadModel(model);
                this.loadAfter(model);
            }
        });
    }

    /**
     * 加载前操作,返回false阻止加载
     * @param id 标识
     */
    protected loadBefore(id = null) {
        return true;
    }

    /**
     * 是否远程加载
     */
    protected isRequestLoad() {
        return true;
    }

    /**
     * 转换为模型
     * @param data 数据
     */
    protected toModel(data) {
        return data;
    }

    /**
     * 加载模型
     */
    private loadModel(model) {
        this.isNew = false;
        this.model = model;
    }

    /**
     * 加载后操作
     */
    protected loadAfter(result) {
    }

    /**
     * 获取加载地址
     * @param id 标识
     */
    protected getLoadUrl(id?) {
        return this.getUrl(this.getBaseUrl(), id);
    }

    /**
     * 获取基础地址
     */
    protected getBaseUrl(): string {
        throw new Error("未实现getBaseUrl方法");
    }

    /**
     * 获取完整地址
     * @param url Api地址
     * @param path 路径
     */
    protected getUrl(url: string, path?: string) {
        return this.util.helper.getUrl(url, this.appConfig.apiEndpoint, path);
    }

    /**
     * 提交表单
     * @param form 表单
     * @param button 按钮
     */
    submit(form?: NgForm, button?) {
        this.util.form.submit({
            url: this.getSubmitUrl(),
            data: this.model,
            form: form,
            button: button,
            back: true
        });
    }

    /**
     * 获取提交地址
     */
    protected getSubmitUrl() {
        if (this.isNew)
            return this.getCreateUrl();
        return this.getEditUrl();
    }


    /**
     * 获取创建地址
     */
    protected getCreateUrl() {
        return this.getUrl(this.getBaseUrl());
    }

    /**
     * 获取更新地址
     */
    protected getEditUrl() {
        let id = this.id || this.util.router.getParam("id");
        return this.getUrl(this.getBaseUrl(), id);
    }

    /**
     * 返回
     */
    back() {
        this.util.router.back();
    }

    /**
     * 关闭弹出框
     */
    close() {
        this.util.dialog.close();
    }
}