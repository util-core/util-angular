import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { environment } from "environment";
import { Util, TableQueryComponentBase, AppConfig } from 'util-angular';
import { ApplicationQuery } from './application-query';
import { ApplicationViewModel } from './application-view-model';
import { LoadingService, LoadingType, LoadingIcon } from '@delon/abc/loading';

@Component({
    selector: 'app-welcome',
    templateUrl: environment.production ? './html/welcome.component.html' : 'view/Welcome/Welcome',
    styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent extends TableQueryComponentBase<ApplicationViewModel, ApplicationQuery> {


    constructor(injector: Injector, private loading: LoadingService) {
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

    click(btn) {
        //this.util.loading.open();
        this.show('text');
        //setTimeout(() => {
        //    this.util.loading.close();
        //}, 5000);
    }

    show(type: LoadingType): void {
        this.loading.open({ type });

        setTimeout(() => this.loading.close(), 1000 * 3);
    }
}


