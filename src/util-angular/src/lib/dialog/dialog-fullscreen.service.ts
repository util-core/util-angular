//============== 弹出层全屏服务 =============================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===========================================================
import { Injectable, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { NzModalRef } from "ng-zorro-antd/modal";
import { Util } from "../util";

/**
 * 弹出层全屏服务
 */
@Injectable({ providedIn: 'root' })
export class DialogFullscreenService {
    /**
     * 清理对象
     */
    private readonly destroy$ = inject(DestroyRef);
    /**
     * 操作入口
     */
    util: Util;
    /**
     * 是否全屏
     */
    private _isFullscreen = false;
    /**
     * 全屏变更对象
     */
    private fullscreenChange$: Subject<boolean>;

    /**
     * 初始化全屏内容区服务
     */
    constructor() {
        this.fullscreenChange$ = new Subject<boolean>();
        this.util = Util.create();
    }

    /**
     * 注册全屏变更事件
     * @param handler 事件处理器
     */
    onChange(handler: (isFullscreen: boolean) => void) {
        return this.fullscreenChange$
            .pipe(
                takeUntilDestroyed(this.destroy$)
            )
            .subscribe({
                next: handler
            });
    }

    /**
     * 是否全屏
     */
    isFullscreen() {
        return this._isFullscreen;
    }

    /**
     * 全屏
     */
    fullScreen(dialog: NzModalRef) {
        if (!dialog)
            return;
        let modalContainer = this.getModalContainer(dialog);
        this.util.dom.addClass(modalContainer, "x-dialog-fullscreen");
        this.emitChange(true);
    }

    /**
     * 获取弹出层容器
     */
    private getModalContainer(dialog: NzModalRef) {
        return this.util.dom.getParent(dialog.containerInstance, "nz-modal-container");
    }

    /**
     * 退出全屏
     */
    exit(dialog: NzModalRef) {
        if (!dialog)
            return;
        let modalContainer = this.getModalContainer(dialog);
        this.util.dom.removeClass(modalContainer, "x-dialog-fullscreen");
        this.emitChange(false);
    }

    /**
     * 发出全屏变更事件
     * @param isFullscreen 是否全屏
     */
    private emitChange(isFullscreen: boolean) {
        this._isFullscreen = isFullscreen;
        this.fullscreenChange$.next(isFullscreen);
    }
}