//============== 全屏内容区页脚组件 ===========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AlainThemeModule } from '@delon/theme';
import { Util } from '../util';

/**
 * 全屏内容区页脚组件
 */
@Component({
    selector: 'x-fullscreen-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzButtonModule, AlainThemeModule],
    template: `
        <div class="ant-modal-footer">
            <button nz-button (click)="exit()">{{'util.cancel'|i18n}}</button>
        </div>
    `
})
export class FullContentFooterComponent {
    /**
     * 操作入口
     */
    util: Util;

    /**
     * 退出全屏
     */
    exit() {
        this.util.fullscreen.exit();
    }
}