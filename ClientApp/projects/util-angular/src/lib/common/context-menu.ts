//============== 上下文菜单操作 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//========================================================
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Util } from "../util";

/**
 * 上下文菜单操作
 */
export class ContextMenu {
    /**
     * 上下文菜单服务
     */
    private _service: NzContextMenuService;

    /**
     * 初始化上下文菜单操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this._service = this.util.ioc.get(NzContextMenuService);
    }

    /**
     * 创建上下文菜单
     * @param $event 鼠标事件
     * @param menu 下拉菜单组件
     */
    create($event: MouseEvent, menu: NzDropdownMenuComponent) {
        if (!this._service)
            return;
        this._service.create($event, menu);
    }

    /**
     * 关闭上下文菜单
     */
    close() {
        if (!this._service)
            return;
        this._service.close();
    }
}