import { Component, Injector } from '@angular/core';
import { environment } from "environment";
import { DialogEditComponentBase } from "util-angular";
import { ApplicationViewModel } from './model/application-view-model';
import { ApplicationType } from "./model/application-type";

/**
 * 应用程序编辑页
 */
@Component( {
    selector: 'application-edit',
    templateUrl: environment.production ? './html/edit.component.html' : '/view/application/edit'
} )
export class ApplicationEditComponent extends DialogEditComponentBase<ApplicationViewModel> {
    /**
     * 是否客户端
     */
    isClient: boolean;

    /**
     * 初始化应用程序编辑页
     * @param injector 注入器
     */
    constructor( injector: Injector ) {
        super( injector );
    }

    /**
     * 创建模型
     */
    protected createModel() {
        let result = new ApplicationViewModel();
        result.enabled = true;
        result.type = ApplicationType.General;
        return result;
    }

    /**
     * 获取基地址
     */
    protected getBaseUrl() {
        return "application";
    }

    /**
     * 应用类型更改事件处理
     * @param type 应用类型
     */
    changeType( type ) {
        if ( type === ApplicationType.Client ) {
            this.isClient = true;
            return;
        }
        this.isClient = false;
    }

    /**
     * 加载后操作
     */
    loadAfter( result: ApplicationViewModel ) {
        if ( !result )
            return;
        this.changeType(result.type);
    }
}