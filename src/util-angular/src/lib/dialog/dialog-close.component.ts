//============== 弹出层关闭组件 ===========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Component, ChangeDetectionStrategy, Input, ViewChild, TemplateRef, ViewEncapsulation, OnInit } from '@angular/core';
import { silentEvent } from 'ng-zorro-antd/core/util';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from "ng-zorro-antd/modal";
import { Util } from '../util';
import { DialogFullscreenService } from './dialog-fullscreen.service';

/**
 * 弹出层关闭组件
 */
@Component({
    selector: 'x-dialog-close',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzIconModule],
    encapsulation: ViewEncapsulation.None,
    template: `
        <ng-template #tpl>
            <span nz-icon class="btn-full-screen" nzTheme="outline" [nzType]="isFullscreen ? 'switcher': 'border'" (click)="fullScreen($event)"></span>
            <span nz-icon nzType="close" class="ant-modal-close-icon"></span>
        </ng-template>
    `,
    styles: [`
        .ant-modal-close-x {
            line-height:0;
            width:96px;
            .btn-full-screen {
                line-height:56px;
                width:48px;
                height:56px;
                font-size:14px;
                &:hover {
                    background-color: #e5e5e5;
                }
            }
            .ant-modal-close-icon {
                line-height:56px;
                width:48px;
                height:56px;
                font-size:14px;                
                &:hover {
                    background-color: #e81123;
                    color:#fff;
                }
            }
            .anticon {
                justify-content:center;
            }
        }
        .x-dialog-fullscreen {
            [nz-resizable] {
                height: 100%;
                nz-resize-handles {
                    display: none;
                }
                .x-dialog-container {
                    height: calc(100% - 108px) !important;
                    max-height: none !important;
                }
            }
            .ant-modal {
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100% !important;
                max-width: initial;
                height: 100% !important;
                padding: 0;
                .ant-modal-content {
                    height: 100% !important;
                }
            }
        }
    `]
})
export class DialogCloseComponent implements OnInit {
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 弹出层全屏服务
     */
    service: DialogFullscreenService;
    /**
     * 是否全屏
     */
    isFullscreen = false;
    /**
     * 弹出层实例
     */
    @Input() dialog: NzModalRef<any>;
    /**
     * 组件模板
     */
    @ViewChild('tpl', { static: true }) templateRef: TemplateRef<any>;

    /**
     * 初始化
     */
    constructor() {
        this.util = Util.create();
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.service = this.util.ioc.get(DialogFullscreenService);
        this.service.util = this.util;
    }

    /**
     * 全屏
     */
    fullScreen(event?: MouseEvent) {
        silentEvent(event);
        if (this.isFullscreen) {
            this.service.exit(this.dialog);
            this.isFullscreen = !this.isFullscreen;
            return;
        }
        this.service.fullScreen(this.dialog);
        this.isFullscreen = !this.isFullscreen;
    }
}