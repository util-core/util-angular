//============== 抽屉页脚指令 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { Directive, Optional, TemplateRef } from '@angular/core';
import { NzDrawerComponent } from "ng-zorro-antd/drawer";

/**
 * 抽屉页脚指令
 */
@Directive({
    selector: '[xDrawerFooter]',
    exportAs: 'xDrawerFooter',
    standalone: true
})
export class DrawerFooterDirective {
    /**
     * 初始化抽屉页脚指令
     */
    constructor(@Optional() private drawer: NzDrawerComponent, public templateRef: TemplateRef<{}>) {
        if (!this.drawer)
            return;
        this.drawer.nzFooter = templateRef;
    }
}