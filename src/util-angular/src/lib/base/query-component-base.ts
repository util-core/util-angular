//================ 查询组件基类 ==================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { Input, Component } from '@angular/core';
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
     * 复选框或单选框选中的标识列表
     */
    @Input() checkedIds: [];
    /**
     * 传入数据
     */
    @Input() data;

    /**
     * 初始化组件
     */
    constructor() {
        super();
        this.queryParam = <TQuery>new QueryParameter();
        this.initDataByDialog();
    }

    /**
     * 通过弹出窗口初始化数据
     */
    private initDataByDialog() {
        if (this.data)
            return;
        let param = this.util.dialog.getData<any>();
        if (!param)
            param = this.util.drawer.getData<any>();
        if (param) {
            this.checkedIds = param.checkedIds;
            this.data = param.data;
        }
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
     * 重置
     */
    reset() {
        let order = this.queryParam.order;
        let pageSize = this.queryParam.pageSize;
        this.queryParam = this.createQuery();
        this.queryParam.order = order;
        this.queryParam.pageSize = pageSize;
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
     * 获取弹出框宽度
     * @param isDialog true表示Dialog,false表示Drawer
     */
    protected getWidth(isDialog?: boolean): string {
        return null;
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
            title: this.getDetailTitle(),
            data: this.getDetailData(data),
            width: this.getDetailWidth(true),
            showOk: false,
            wrapClassName: "detail-dialog"
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
            onOpenBefore: () => {
                return this.onCreateOpenBefore();
            },
            onCloseBefore: () => {
                return this.onCreateCloseBefore();
            },
            onClose: result => {
                this.onCreateClose(result);
            }
        });
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
            onOpenBefore: () => {
                return this.onEditOpenBefore();
            },
            onCloseBefore: () => {
                return this.onEditCloseBefore();
            },
            onClose: result => {
                this.onEditClose(result);
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
            width: this.getDetailWidth(false)
        });
    }

    /**
     * 关闭
     */
    close() {
        this.util.dialog.close();
        this.util.drawer.close();
    }
}
