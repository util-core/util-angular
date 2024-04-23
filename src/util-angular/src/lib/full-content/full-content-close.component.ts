//============== 全屏内容区关闭组件 ===========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Util } from '../util';

/**
 * 全屏内容区关闭组件
 */
@Component({
    selector: 'x-fullscreen-close',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzIconModule],
    template: `
        <button class="ant-modal-close">
            <span class="ant-modal-close-x">
                <i (click)="exit()" nz-icon="" nzType="close" class="ant-modal-close-icon"></i>
            </span>
        </button>
    `,
    styles: [`
        .ant-modal-close-x {
            line-height:0;
            width:56px;
            .ant-modal-close-icon {
                line-height:56px;
                width:56px;
                height:56px;              
                &:hover {
                    background-color: #e81123;
                    color:#fff;
                }
            }
            .anticon {
                justify-content:center;
            }
        }
    `]
})
export class FullContentCloseComponent {
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