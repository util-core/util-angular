//============== 树形弹出层编辑组件基类===============
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { Injector, Input, OnInit, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TreeViewModel } from "../core/tree-view-model";
import { EditComponentBase } from "./edit-component-base";

/**
 * 树形弹出层编辑组件基类
 */
@Component({
    template: ''
})
export abstract class TreeDialogEditComponentBase<TViewModel extends TreeViewModel> extends EditComponentBase<TViewModel> implements OnInit {
    /**
     * 父节点
     */
    @Input() parent;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
    }

    /**
     * 初始化
     */
    ngOnInit() {
        super.ngOnInit();
        this.initParent();
    }

    /**
     * 初始化父节点
     */
    protected initParent() {
        this.setParent(this.getParent());
    }

    /**
     * 设置父节点
     * @param parent 父节点
     */
    protected setParent(parent?) {
        if (!parent) {
            this.parent = null;
            this.model.parentId = null;
            this.model.parentName = null;
            return;
        }
        this.parent = parent;
        this.model.parentId = parent.id;
        this.model.parentName = this.getParentName(parent);
    }

    /**
     * 获取父节点
     */
    protected getParent() {
        if (this.parent)
            return this.parent;
        if (this.data && this.data.parentId)
            return { id: this.data.parentId, name: this.data.parentName };
        return null;
    }

    /**
     * 获取父节点名称
     */
    protected getParentName(parent) {
        return parent && parent.name;
    }

    /**
     * 加载完成操作
     */
    protected onLoad(result) {
        this.setParent(this.getParent());
    }

    /**
     * 提交表单
     * @param button 按钮
     * @param form 表单
     */
    submit(button?, form?: NgForm) {
        this.util.form.submit({
            url: this.getSubmitUrl(),
            data: this.model,
            form: form || this.form,
            button: button,
            closeDialog: true
        });
    }
}