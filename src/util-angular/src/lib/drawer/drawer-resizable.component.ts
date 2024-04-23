//============== 抽屉调整尺寸组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//========================================================
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzResizeEvent, NzResizeDirection, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Util } from '../util';

/**
 * 抽屉调整尺寸组件
 */
@Component({
    selector: 'x-drawer-resizable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzResizableModule],
    template: `
        <div nz-resizable nzBounds="window" class="drawer-body"
          [nzMinWidth]="minWidth" [nzMaxWidth]="maxWidth"
          (nzResize)="handleResize($event)">
            <nz-resize-handles [nzDirections]="[direction]"></nz-resize-handles>
            <div class="x-drawer-container" [style.height]="getHeight()"></div>
        </div>
    `,
    styles: [`
      .drawer-body {
        width: 100%;
        height: 100%;
        padding: 24px;
      }
    `],
    host: {
        '[style.height]': `getHeight()`
    }
})
export class DrawerResizableComponent {
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
    direction: NzResizeDirection;
    /**
     * 抽屉实例
     */
    drawer: NzDrawerRef
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
    constructor() {
        this.util = Util.create();
        this.direction = "left";
    }

    /**
     * 获取高度
     */
    getHeight() {
        return "100%";
    }

    /**
     * 设置抽屉Padding为 0
     */
    setPadding() {
        this.drawer.nzBodyStyle = { "padding": "0" };
    }

    /**
     * 设置手柄方向
     */
    setDirection() {
        if (!this.drawer)
            return;
        switch (this.drawer.nzPlacement) {
            case "left":
                this.direction = "right";
                break;
            case "right":
                this.direction = "left";
                break;
        }
    }

    /**
     * 调整尺寸事件处理
     */
    handleResize({ width }: NzResizeEvent): void {
        cancelAnimationFrame(this.id);
        this.id = requestAnimationFrame(() => {
            if (!this.drawer)
                return;
            this.drawer.nzWidth = width;
        });
    }
}