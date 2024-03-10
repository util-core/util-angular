//============== 弹出层容器组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//======================================================
import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { NzResizeEvent, NzResizeDirection } from 'ng-zorro-antd/resizable';
import { Util } from '../util';
import { AppConfig, initAppConfig } from '../config/app-config';

/**
 * 弹出层容器组件
 */
@Component({
    selector: 'x-dialog-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div nz-resizable class="dialog-body" nzBounds="window" [nzMinWidth]="minWidth" [nzMaxWidth]="maxWidth"
          (nzResize)="handleResize($event)">
            <nz-resize-handles [nzDirections]="directions"></nz-resize-handles>
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
      ::ng-deep .ant-modal-body {
        padding: 0;
      }
      .dialog-body {
        width: 100%;
        height: 100%;
        padding: 24px;
      }
    `]
})
export class DialogContainerComponent {
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 标识
     */
    id = -1;
    /**
     * 手柄方向
     */
    @Input() directions: NzResizeDirection[];
    /**
     * 最小宽度
     */
    @Input() minWidth: number;
    /**
     * 最大宽度
     */
    @Input() maxWidth: number;

    /**
     * 初始化
     */
    constructor(injector: Injector, config: AppConfig) {
        initAppConfig(config);
        this.util = new Util(injector, config);
        this.directions = ['left', 'right'];
        this.minWidth = 600;
    }

    /**
     * 调整尺寸事件处理
     */
    handleResize({ width, height }: NzResizeEvent): void {
        cancelAnimationFrame(this.id);
        this.id = requestAnimationFrame(() => {
            let dialog = this.util.dialog.getDialog();
            if (!dialog)
                return;
            let config = dialog.getConfig();
            config.nzWidth = width;
            dialog.updateConfig(config);
        });
    }
}