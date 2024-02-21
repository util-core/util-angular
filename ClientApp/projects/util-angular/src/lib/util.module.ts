//================ util模块 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { TableExtendDirective } from "./zorro/table.extend.directive";
import { EditTableDirective } from "./zorro/edit-table.directive";
import { EditRowDirective } from "./zorro/edit-row.directive";
import { EditControlDirective } from "./zorro/edit-control.directive";
import { ButtonExtendDirective } from "./zorro/button.extend.directive";
import { ValidationExtendDirective } from "./zorro/validation.extend.directive";
import { SelectExtendDirective } from "./zorro/select.extend.directive";
import { TreeTableExtendDirective } from "./zorro/tree.table.extend.directive";
import { TreeExtendDirective } from "./zorro/tree.extend.directive";
import { TinymceExtendDirective } from "./tinymce/tinymce.extend.directive";
import { DrawerFooterComponent } from "./drawer/drawer-footer.component";
import { DrawerContainerComponent } from './drawer/drawer-container.component';
import { RequiredExtendDirective } from "./zorro/required.extend.directive";
import { UploadExtendDirective } from "./zorro/upload.extend.directive";
import { InputExtendDirective } from "./zorro/input.extend.directive";
import { TagExtendDirective } from "./zorro/tag.extend.directive";
import { TableSettingsComponent } from "./zorro/table-settings.component";
import { TenantInterceptor } from "./tenant/tenant.interceptor";
import { LanguageInterceptor } from "./language/language.interceptor";
import { UploadServiceBase, UploadService } from "./upload/upload.service";

/**
 * util模块
 */
@NgModule({
    declarations: [
        TableExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        RequiredExtendDirective,ButtonExtendDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective, DrawerFooterComponent, DrawerContainerComponent,
        UploadExtendDirective, InputExtendDirective,        
        TagExtendDirective, TableSettingsComponent
    ],
    imports: [
        CommonModule, FormsModule, DragDropModule, 
        NzButtonModule, NzModalModule, NzListModule,
        NzCheckboxModule, NzGridModule, NzFlexModule,
        NzIconModule, NzResizableModule,
        AlainThemeModule,DelonACLModule
    ],
    exports: [
        TableExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        RequiredExtendDirective,ButtonExtendDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective, UploadExtendDirective,
        InputExtendDirective, TagExtendDirective,
        TableSettingsComponent, DrawerContainerComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
        { provide: UploadServiceBase, useClass: UploadService }
    ]
})
export class UtilModule {
}
