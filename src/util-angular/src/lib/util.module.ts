//================ util模块 ======================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//================================================
import { NgModule } from '@angular/core';
import { DrawerFooterDirective } from "./drawer/drawer-footer.directive";
import { TableSettingsComponent } from "./zorro/table-settings.component";
import { ButtonExtendDirective } from "./zorro/button-extend.directive";
import { SegmentedExtendDirective } from "./zorro/segmented-extend.directive";
import { EditTableDirective } from "./zorro/edit-table.directive";
import { EditRowDirective } from "./zorro/edit-row.directive";
import { EditControlDirective } from "./zorro/edit-control.directive";
import { InputExtendDirective } from "./zorro/input-extend.directive";
import { TableExtendDirective } from "./zorro/table-extend.directive";
import { TreeTableExtendDirective } from "./zorro/tree-table-extend.directive";
import { ValidationExtendDirective } from "./zorro/validation-extend.directive";
import { SelectExtendDirective } from "./zorro/select-extend.directive";
import { TreeExtendDirective } from "./zorro/tree-extend.directive";
import { TinymceExtendDirective } from "./zorro/tinymce.extend.directive";
import { RequiredExtendDirective } from "./zorro/required-extend.directive";
import { UploadExtendDirective } from "./zorro/upload-extend.directive";
import { RangePickerExtendDirective } from "./zorro/range-picker-extend.directive";
import { TagExtendDirective } from "./zorro/tag-extend.directive";
import { TableHeadAlignDirective } from "./zorro/table-head-align.directive";
import { provideUtil } from "./provider";

/**
 * util模块
 */
@NgModule({
    imports: [
        DrawerFooterDirective, TableSettingsComponent,
        ButtonExtendDirective, SegmentedExtendDirective,        
        EditTableDirective, EditRowDirective, EditControlDirective,
        InputExtendDirective, RequiredExtendDirective,
        TableExtendDirective, TableHeadAlignDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective, UploadExtendDirective,
        RangePickerExtendDirective,TagExtendDirective
    ],
    exports: [
        DrawerFooterDirective, TableSettingsComponent,
        ButtonExtendDirective, SegmentedExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        InputExtendDirective, RequiredExtendDirective,
        TableExtendDirective, TableHeadAlignDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective, UploadExtendDirective,
        RangePickerExtendDirective,TagExtendDirective
    ],
    providers: [provideUtil()]
})
export class UtilModule {
}