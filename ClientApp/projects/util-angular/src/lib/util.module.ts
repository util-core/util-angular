//================ util模块 ======================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================
import { NgModule } from '@angular/core';
import { TableExtendDirective } from "./zorro/table.extend.directive";
import { ButtonExtendDirective } from "./zorro/button.extend.directive";
import { ValidationExtendDirective } from "./zorro/validation.extend.directive";
import { InputExtendDirective } from "./zorro/input.extend.directive";
import { SelectExtendDirective } from "./zorro/select.extend.directive";

/**
 * util模块
 */
@NgModule({
    declarations: [
        TableExtendDirective,
        ButtonExtendDirective,
        ValidationExtendDirective,InputExtendDirective, SelectExtendDirective
    ],
    imports: [
    ],
    exports: [
        TableExtendDirective,
        ButtonExtendDirective,
        ValidationExtendDirective,InputExtendDirective, SelectExtendDirective
    ]
})
export class UtilModule {
}
