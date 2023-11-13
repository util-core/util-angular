//============== 抽屉页脚组件 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, Optional } from '@angular/core';
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzButtonType } from 'ng-zorro-antd/button';
import { Util } from '../util';
import { AppConfig, initAppConfig } from '../config/app-config';

/**
 * 抽屉页脚组件
 */
@Component({
    selector: 'drawer-footer',
    template: `
        <ng-template #footer>
          <div style="float: right">
            <button nz-button style="margin-right: 8px;" (click)="close()" *ngIf="btnCancelText">{{btnCancelText}}</button>
            <button #btnOk nz-button [nzType]="btnOkType" [nzDanger]="btnOkDanger" [nzLoading]="loading" [disabled]="!isValid" (click)="ok(btnOk)" *ngIf="btnOkText">{{btnOkText}}</button>
          </div>
       </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerFooterComponent {
    /**
     * 加载状态
     */
    private loading: boolean;
    /**
     * 是否有效
     */
    private isValid: boolean;
    /**
     * 取消按钮文本
     */
    @Input() btnCancelText: string;
    /**
     * 确定按钮文本
     */
    @Input() btnOkText: string;
    /**
     * 确定按钮类型
     */
    @Input() btnOkType: NzButtonType;
    /**
     * 确定按钮危险状态
     */
    @Input() btnOkDanger: boolean;
    /**
     * 抽屉
     */
    @Input() drawer: NzDrawerRef;
    /**
     * 确定按钮执行完成是否关闭抽屉
     */
    @Input() okAfterClose: boolean;
    /**
     * 确定回调函数
     */
    @Input() onOk?: (instance, btnOk, drawer) => (false | void | {}) | Promise<false | void | {}>;
    /**
     * 页脚
     */
    @ViewChild("footer", { static: true }) footer: TemplateRef<any>;

    /**
     * 初始化抽屉页脚组件
     * @param config 应用配置
     */
    constructor(@Optional() protected config: AppConfig) {
        this.initAppConfig();
        this.isValid = true;
    }

    /**
     * 初始化应用配置
     */
    private initAppConfig() {
        if (!this.config)
            this.config = new AppConfig();
        initAppConfig(this.config);
    }

    /**
     * 关闭抽屉
     */
    close() {
        this.drawer && this.drawer.close();
    }

    /**
     * 组件无效时禁用按钮
     */
    ngDoCheck() {
        if (!this.config.form.isInvalidFormDisableButton)
            return;
        let component = this.drawer.getContentComponent();
        if (!component)
            return;        
        if (component.isValid)
            this.isValid = component.isValid();
    }

    /**
     * 确定
     */
    async ok(btnOk) {
        if (!this.onOk) {
            this.close();
            return;
        }
        let util = new Util();
        let result = this.onOk(this.drawer.getContentComponent(), btnOk, this.drawer);
        if (!util.helper.isPromise(result))
            return;
        this.loading = true;
        result.then(value => {
            result = value;
        }).finally(() => {
            this.loading = false;
            this.cancel(result);
        });
    }

    /**
     * 根据条件关闭抽屉
     */
    private cancel(result) {
        if (result === false)
            return;
        if (this.okAfterClose === false)
            return;
        this.close();
    }
}