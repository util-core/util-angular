//============== 弹出层调整尺寸组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=========================================================
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzResizeEvent, NzResizeDirection, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Util } from '../util';

/**
 * 弹出层调整尺寸组件
 */
@Component({
    selector: 'x-dialog-resizable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, NzResizableModule],
    template: `
        <div nz-resizable nzBounds="window"
          [nzMinWidth]="minWidth" [nzMaxWidth]="maxWidth"
          [nzMinHeight]="minHeight" [nzMaxHeight]="maxHeight"
          (nzResize)="handleResize($event)">
            <nz-resize-handles [nzDirections]="directions"></nz-resize-handles>
            <div class="x-dialog-container" [ngStyle]="getDivStyle()"></div>
        </div>
    `
})
export class DialogResizableComponent {
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 高度
     */
    height?: number;
    /**
     * 弹出层实例
     */
    dialog: NzModalRef;
    /**
     * 手柄方向
     */
    directions: NzResizeDirection[];
    /**
     * 最小宽度
     */
    @Input() minWidth: number;
    /**
     * 最大宽度
     */
    @Input() maxWidth: number;
    /**
     * 最小高度
     */
    @Input() minHeight: number;
    /**
     * 最大高度
     */
    @Input() maxHeight: number;

    /**
     * 初始化
     */
    constructor() {
        this.util = Util.create();
        this.directions = ['left', 'right', 'bottom', 'bottomRight', 'bottomLeft'];
    }

    /**
     * 获取div样式
     */
    getDivStyle() {
        return {
            "overflow": "auto",            
            "height.px": this.height,
            "max-height.px": this.maxHeight
        }
    }

    /**
     * 调整尺寸事件处理
     */
    handleResize({ width, height }: NzResizeEvent): void {
        this.util.animation.request(() => {
            this.height = this.util.helper.toNumber(height) - 108;
            if (!this.dialog)
                return;
            let config = this.dialog.getConfig();
            config.nzWidth = width;
            this.dialog.updateConfig(config);
        });
    }
}