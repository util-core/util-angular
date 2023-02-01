//================ util模块 ======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import { NgModule } from '@angular/core';
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

/**
 * util模块
 */
@NgModule({
    declarations: [
        TableExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        ButtonExtendDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective
    ],
    imports: [
    ],
    exports: [
        TableExtendDirective,
        EditTableDirective, EditRowDirective, EditControlDirective,
        ButtonExtendDirective,
        ValidationExtendDirective, SelectExtendDirective,
        TreeTableExtendDirective, TreeExtendDirective,
        TinymceExtendDirective
    ]
})
export class UtilModule {
}
