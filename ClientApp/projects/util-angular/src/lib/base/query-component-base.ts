//================ 查询组件基类 ==================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { Input,Injector, Component } from '@angular/core';
import { ComponentBase } from './component-base';
import { QueryParameter } from "../core/query-parameter";

/**
 * 查询组件基类
 */
@Component({
    template: ''
})
export abstract class QueryComponentBase<TQuery extends QueryParameter> extends ComponentBase {
    /**
     * 查询参数
     */
    queryParam: TQuery;
    /**
     * 是否展开
     */
    expand;
    /**
     * 复选框或单选框选中的标识列表
     */
    checkedIds;
    /**
     * 传入数据
     */
    @Input() data;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
        this.queryParam = <TQuery>new QueryParameter();
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.queryParam = this.createQuery();
    }

    /**
     * 创建查询参数
     */
    protected createQuery(): TQuery {
        return <TQuery>new QueryParameter();
    }

    /**
     * 查询
     * @param button 按钮
     */
    abstract query(button?);

    /**
     * 刷新
     * @param button 按钮
     * @param handler 刷新后回调函数
     */
    abstract refresh(button?, handler?: (data) => void);

    /**
     * 刷新单个实体
     * @param model 实体对象
     */
    abstract refreshByModel(model);

    /**
     * 路由复用标签刷新
     */
    _onReuseInit(type?) {
        if (type === "refresh")
            this.refresh();
    }

    /**
     * 打开创建弹出框
     */
    openCreateDialog(data?) {
        this.util.dialog.open({
            component: this.getCreateComponent(),
            centered: true,
            title: this.getCreateTitle(),
            data: this.getCreateData(data),
            width: this.getCreateWidth(true),
            disableClose: true,
            showFooter: false,
            onOpenBefore: () => {
                return this.onCreateOpenBefore();
            },
            onCloseBefore: result => {
                return this.onCreateCloseBefore(result);
            },
            onClose: result => {
                this.onCreateClose(result);
            }
        });
    }

    /**
     * 获取创建组件
     */
    protected getCreateComponent() {
        return {};
    }

    /**
     * 获取创建标题
     */
    protected getCreateTitle() {
        return null;
    }

    /**
     * 获取创建数据
     */
    protected getCreateData(data?) {
        return {};
    }

    /**
     * 获取创建框宽度
     * @param isDialog true表示Dialog,false表示Drawer
     */
    protected getCreateWidth(isDialog?: boolean) {
        return this.getWidth(isDialog);
    }

    /**
     * 获取弹出框宽度，默认值：Dialog为 60% , Drawer为 38%
     * @param isDialog true表示Dialog,false表示Drawer
     */
    protected getWidth(isDialog?: boolean): string {
        if (isDialog )
            return "60%";
        return "38%";
    }

    /**
     * 创建框打开前回调函数，返回 false 阻止打开
     */
    protected onCreateOpenBefore() {
        return true;
    }

    /**
     * 创建框关闭前回调函数，返回 false 阻止关闭
     * @param result 返回结果
     */
    protected onCreateCloseBefore(result?) {
        return true;
    }

    /**
     * 创建框关闭回调函数
     * @param result 返回结果
     */
    protected onCreateClose(result) {
        if (result)
            this.refreshByModel(result);
    }

    /**
     * 打开修改弹出框
     */
    openEditDialog(data) {
        this.util.dialog.open({
            component: this.getEditComponent(),
            centered: true,
            title: this.getEditTitle(),
            data: this.getEditData(data),
            width: this.getEditWidth(true),
            disableClose: true,
            showFooter: false,
            onOpenBefore: () => {
                return this.onEditOpenBefore();
            },
            onCloseBefore: result => {
                return this.onEditCloseBefore(result);
            },
            onClose: result => {
                this.onEditClose(result);
            }
        });
    }

    /**
     * 获取更新组件
     */
    protected getEditComponent() {
        return this.getCreateComponent();
    }

    /**
     * 获取更新标题
     */
    protected getEditTitle() {
        return null;
    }

    /**
     * 获取更新数据
     */
    protected getEditData(data) {
        if (!data)
            return null;
        return { id: data.id, data: data };
    }

    /**
     * 获取编辑框宽度
     */
    protected getEditWidth(isDialog?: boolean) {
        return this.getWidth(isDialog);
    }

    /**
     * 更新框打开前回调函数，返回 false 阻止打开
     */
    protected onEditOpenBefore() {
        return true;
    }

    /**
     * 更新框关闭前回调函数，返回 false 阻止关闭
     * @param result 返回结果
     */
    protected onEditCloseBefore(result?) {
        return true;
    }

    /**
     * 更新框关闭回调函数
     * @param result 返回结果
     */
    protected onEditClose(result) {
        if (result)
            this.refreshByModel(result);
    }

    /**
     * 打开详情弹出框
     */
    openDetailDialog(data) {
        this.util.dialog.open({
            component: this.getDetailComponent(),
            centered: true,
            title: this.getDetailTitle(),
            data: this.getDetailData(data),
            width: this.getDetailWidth(true),
            showOk: false
        });
    }

    /**
     * 获取详情组件
     */
    protected getDetailComponent() {
        return {};
    }

    /**
     * 获取详情标题
     */
    protected getDetailTitle() {
        return null;
    }

    /**
     * 获取详情数据
     */
    protected getDetailData(data) {
        return this.getEditData(data);
    }

    /**
     * 获取详情宽度
     */
    protected getDetailWidth(isDialog?: boolean) {
        return this.getWidth(isDialog);
    }

    /**
     * 打开创建抽屉
     */
    openCreateDrawer(data?) {
        this.util.drawer.open({
            component: this.getCreateComponent(),
            title: this.getCreateTitle(),
            data: this.getCreateData(data),
            width: this.getCreateWidth(false),
            disableClose: true,
            showFooter: this.isShowDrawerFooter(),
            onOpenBefore: () => {
                return this.onCreateOpenBefore();
            },
            onCloseBefore: () => {
                return this.onCreateCloseBefore();
            },
            onClose: result => {
                this.onCreateClose(result);
            },
            onOk: (instance,btn) => {
                instance.submit(btn);
            }
        });
    }

    /**
     * 是否显示抽屉页脚,默认值: true
     */
    protected isShowDrawerFooter() {
        return true;
    }

    /**
     * 打开修改抽屉
     */
    openEditDrawer(data) {
        this.util.drawer.open({
            component: this.getEditComponent(),
            title: this.getEditTitle(),
            data: this.getEditData(data),
            width: this.getEditWidth(false),
            disableClose: true,
            showFooter: this.isShowDrawerFooter(),
            onOpenBefore: () => {
                return this.onEditOpenBefore();
            },
            onCloseBefore: () => {
                return this.onEditCloseBefore();
            },
            onClose: result => {
                this.onEditClose(result);
            },
            onOk: (instance, btn) => {
                instance.submit(btn);
            }
        });
    }

    /**
     * 打开详情抽屉
     */
    openDetailDrawer(data) {
        this.util.drawer.open({
            component: this.getDetailComponent(),
            title: this.getDetailTitle(),
            data: this.getDetailData(data),
            width: this.getDetailWidth(false),
            showFooter: this.isShowDrawerFooter(),
            showOk: false
        });
    }
}
