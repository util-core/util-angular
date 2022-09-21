import { Component, Injector, ViewChild, forwardRef } from '@angular/core';
import { environment } from "environment";
import { TableQueryComponentBase, TableExtendDirective } from "util-angular";
import { ApplicationQuery } from './model/application-query';
import { ApplicationViewModel } from './model/application-view-model';
import { ApplicationEditComponent } from './application-edit.component';

/**
 * 应用程序列表页
 */
@Component( {
    selector: 'application-list',
    templateUrl: environment.production ? './html/index.component.html' : '/view/application',
} )
export class ApplicationListComponent extends TableQueryComponentBase<ApplicationViewModel, ApplicationQuery>  {
    /**
     * 初始化应用程序列表页
     * @param injector 注入器
     */
    constructor( injector: Injector ) {
        super( injector );
    }

    /**
     * 获取创建弹出框组件
     */
    getCreateDialogComponent() {
        return ApplicationEditComponent;
    }

    /**
     * 获取详情弹出框组件
     */
    getDetailDialogComponent() {
        return null;
    }
}
