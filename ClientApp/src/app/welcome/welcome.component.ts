import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { environment } from "environment";
import { NzModalService } from 'ng-zorro-antd/modal';
import { Util, TableQueryComponentBase } from 'util-angular';
import { IConfirmOptions } from '../../../projects/util-angular/src/lib/message/confirm-options';
import { ApplicationQuery } from './application-query';
import { ApplicationViewModel } from './application-view-model';

@Component({
    selector: 'app-welcome',
    templateUrl: environment.production ? './html/welcome.component.html' : 'view/Welcome/Welcome',
    styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent extends TableQueryComponentBase<ApplicationViewModel, ApplicationQuery> {

    
    constructor(injector: Injector) {
        super(injector);
        this.model = {};
    }

    model;

    
    getCreateDialogComponent() {
        return null;
    }

    
    getDetailDialogComponent() {
        return null;
    }

    click() {
    }
}
