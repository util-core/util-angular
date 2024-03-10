//============== 抽屉容器组件 ========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//====================================================
import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { Util } from '../util';
import { AppConfig, initAppConfig } from '../config/app-config';

/**
 * 抽屉容器组件
 */
@Component({
    selector: 'x-drawer-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div nz-resizable class="drawer-body" nzBounds="window" [nzMinWidth]="minWidth" [nzMaxWidth]="maxWidth"
          (nzResize)="handleResize($event)">
            <nz-resize-handles [nzDirections]="[direction]"></nz-resize-handles>
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
      ::ng-deep .ant-drawer-body {
        padding: 0;
      }
      .drawer-body {
        width: 100%;
        height: 100%;
        padding: 24px;
      }
    `]
})
export class DrawerContainerComponent implements OnInit {
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
    direction;
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
        this.minWidth = 380;
        this.direction = "right";
    }

    /**
     * 初始化
     */
    ngOnInit() {
        let drawer = this.util.drawer.getDrawer();
        if (!drawer)
            return;
        if (drawer.nzPlacement == "left") {
            this.direction = "right";
            return;
        }
        if (drawer.nzPlacement == "right") {
            this.direction = "left";
            return;
        }
    }

    /**
     * 调整尺寸事件处理
     */
    handleResize({ width }: NzResizeEvent): void {
        cancelAnimationFrame(this.id);
        this.id = requestAnimationFrame(() => {
            let drawer = this.util.drawer.getDrawer();
            if (!drawer)
                return;
            drawer.nzWidth = width;
        });
    }
}