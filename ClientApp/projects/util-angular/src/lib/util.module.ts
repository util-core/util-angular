//================ util模块 ======================
//Copyright 2024 何镇汐
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { TableExtendDirective } from "./zorro/table-extend.directive";
import { EditTableDirective } from "./zorro/edit-table.directive";
import { EditRowDirective } from "./zorro/edit-row.directive";
import { EditControlDirective } from "./zorro/edit-control.directive";
import { ButtonExtendDirective } from "./zorro/button-extend.directive";
import { ValidationExtendDirective } from "./zorro/validation-extend.directive";
import { SelectExtendDirective } from "./zorro/select-extend.directive";
import { TreeTableExtendDirective } from "./zorro/tree-table-extend.directive";
import { TreeExtendDirective } from "./zorro/tree-extend.directive";
import { TinymceExtendDirective } from "./tinymce/tinymce.extend.directive";
import { DrawerFooterComponent } from "./drawer/drawer-footer.component";
import { DrawerContainerComponent } from './drawer/drawer-container.component';
import { DialogContainerComponent } from './dialog/dialog-container.component';
import { RequiredExtendDirective } from "./zorro/required-extend.directive";
import { UploadExtendDirective } from "./zorro/upload-extend.directive";
import { InputExtendDirective } from "./zorro/input-extend.directive";
import { RangePickerExtendDirective } from "./zorro/range-picker-extend.directive";
import { TagExtendDirective } from "./zorro/tag-extend.directive";
import { TableSettingsComponent } from "./zorro/table-settings.component";
import { SegmentedExtendDirective } from "./zorro/segmented-extend.directive";
import { TableHeadAlignDirective } from "./zorro/table-head-align.directive";
import { TenantInterceptor } from "./tenant/tenant.interceptor";
import { LanguageInterceptor } from "./language/language.interceptor";
import { UploadServiceBase, UploadService } from "./zorro/upload.service";
import { TableSettingsServiceBase, TableSettingsService } from "./zorro/table-settings.service";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';

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
        TinymceExtendDirective, DrawerFooterComponent,
        DrawerContainerComponent, DialogContainerComponent,
        UploadExtendDirective, InputExtendDirective, RangePickerExtendDirective,
        TagExtendDirective, TableSettingsComponent, SegmentedExtendDirective,
        TableHeadAlignDirective
    ],
    imports: [
        CommonModule, FormsModule, DragDropModule, 
        NzButtonModule, NzModalModule, NzCardModule, NzInputModule, NzTreeModule,
        NzCheckboxModule, NzGridModule, NzDividerModule, NzTableModule,
        NzFormModule, NzIconModule, NzResizableModule, NzSegmentedModule,
        NzSwitchModule, NzDropDownModule,
        AlainThemeModule,DelonACLModule
    ],
    exports: [
        TableExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        RequiredExtendDirective,ButtonExtendDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective, UploadExtendDirective,
        InputExtendDirective, RangePickerExtendDirective,        
        TableSettingsComponent, DrawerContainerComponent,
        DialogContainerComponent, TagExtendDirective,
        SegmentedExtendDirective, TableHeadAlignDirective
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
        { provide: UploadServiceBase, useClass: UploadService },
        { provide: TableSettingsServiceBase, useClass: TableSettingsService }
    ]
})
export class UtilModule {
}
