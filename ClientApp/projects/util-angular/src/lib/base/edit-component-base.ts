//============== 编辑组件基类=====================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Injector, Component, ViewChild, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewModel } from "../core/view-model";
import { ComponentBase } from './component-base';

/**
 * 编辑组件基类
 */
@Component({
    template: ''
})
export abstract class EditComponentBase<TViewModel extends ViewModel> extends ComponentBase implements OnInit {
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
        super(injector);
        this.isNew = true;
        this.model = <TViewModel>{};
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.model = this.createModel();
        this.loadById();
    }

    /**
     * 创建模型
     */
    protected createModel(): TViewModel {
        return <TViewModel>{};
    }

    /**
     * 通过标识加载
     * @param id 标识
     */
    protected loadById(id?) {
        id = id || this.id || this.util.router.getParam("id");
        if (!id)
            return;
        if (this.onLoadBefore(id) === false)
            return;        
        this.util.webapi.get<TViewModel>(this.getLoadUrl(id)).handle({
            ok: result => {
                let model = this.toModel(result);
                this.loadModel(model);
                this.onLoad(model);
            }
        });
    }

    /**
     * 加载前操作,返回false阻止加载
     * @param id 标识
     */
    protected onLoadBefore(id) {
        return true;
    }

    /**
     * 将结果转换为模型
     * @param result 结果
     */
    protected toModel(result) {
        return result;
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
    protected onLoad(result) {
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
    protected getUrl(url: string, path: string) {
        if (!url)
            return null;
        return this.util.helper.joinUrl(url, path);
    }

    /**
     * 提交表单
     * @param button 按钮
     */
    submit(button?) {
        this.util.form.submit({
            url: this.getSubmitUrl(),
            data: this.model,
            form: this.form,
            button: button,
            back: this.isBack(),
            closeDialog: this.isCloseDialog(),
            closeDrawer: this.isCloseDrawer(),            
            before: data => this.onSubmitBefore(data),
            ok: result => this.onSubmit(result)
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
        return this.getBaseUrl();
    }

    /**
     * 获取更新地址
     */
    protected getEditUrl() {
        let id = this.id || this.util.router.getParam("id");
        return this.getUrl(this.getBaseUrl(), id);
    }

    /**
     * 提交完成是否返回路由,默认值: false,注意,不使用弹出框编辑时设置为true
     */
    protected isBack() {
        return false;
    }

    /**
     * 提交完成是否关闭弹出层,默认值: true
     * @returns
     */
    protected isCloseDialog() {
        return true;
    }    

    /**
     * 提交完成是否关闭抽屉,默认值: true
     * @returns
     */
    protected isCloseDrawer() {
        return true;
    }

    /**
     * 提交前操作
     * @param data 参数
     */
    protected onSubmitBefore(data) {
        return true;
    }

    /**
     * 提交后操作
     * @param result 结果
     */
    protected onSubmit(result) {
    }

    /**
     * 是否有效
     */
    isValid(): boolean {
        return this.form && this.form.valid;
    }

    /**
     * 返回
     */
    back() {
        this.util.router.back();
    }

    /**
     * 关闭
     */
    close() {
        this.util.dialog.close();
        this.util.drawer.close();
    }
}