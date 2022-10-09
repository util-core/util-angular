import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { ShareModule } from "./share.module";
import { WelcomeComponent } from "./welcome/welcome.component"
import { ApplicationListComponent } from "./application/application-list.component"
import { ApplicationEditComponent } from "./application/application-edit.component"
import { ClaimListComponent } from './claim/claim-list.component';
import { Util, AppConfig } from 'util-angular';
import { appConfig } from './app-config';

registerLocaleData(zh);



@NgModule({
    declarations: [
        AppComponent, WelcomeComponent, ApplicationListComponent, ApplicationEditComponent,
        ClaimListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        IconsProviderModule,
        ShareModule
    ],
    providers: [
        { provide: NZ_I18N, useValue: zh_CN },
        { provide: AppConfig, useValue: appConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    /**
     * 初始化应用根模块
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        Util.init(injector);
    }
}