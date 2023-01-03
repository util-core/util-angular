//============== NgZorro表格编辑行扩展指令=======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===============================================================
import { Directive, Input, Output, EventEmitter, OnInit, HostListener, OnDestroy } from '@angular/core';
import { EditTableDirective } from "./edit-table.directive";
import { remove } from "../common/helper";

/**
 * NgZorro表格编辑行扩展指令
 */
@Directive({
    selector: '[x-edit-row]',
    exportAs: 'xEditRow'
})
export class EditRowDirective implements OnInit, OnDestroy {
    /**
     * 编辑控件列表
     */
    controls: any[];
    /**
     * 是否新行
     */
    isNew: boolean;
    /**
     * 行数据
     */
    @Input('x-edit-row') data;
    /**
     * 变更事件
     */
    @Output() onChange = new EventEmitter<any>();

    /**
     * 初始化表格编辑行扩展指令
     * @param table 编辑表格扩展指令
     */
    constructor(private table: EditTableDirective) {
        this.controls = [];
    }

    /**
     * 初始化
     */
    ngOnInit() {
        if (!this.table || !this.data)
            return;
        this.table.register(this.data.id, this);
    }

    /**
     * 组件销毁
     */
    ngOnDestroy() {
        if (this.data)
            this.table && this.table.unRegister(this.data.id);
    }

    /**
     * 注册控件
     * @param control 控件
     */
    register(control) {
        if (!control)
            return;
        this.controls.push(control);
        if (control.onChange && control.onChange.subscribe)
            control.onChange.subscribe(() => {
                if (this.isNew)
                    return;
                this.onChange.emit(this.data.id);
            });
    }

    /**
     * 注销控件
     * @param control 控件
     */
    unRegister(control) {
        if (!control)
            return;
        remove(this.controls, t => t === control);
        if (control.onChange && control.onChange.unsubscribe)
            control.onChange.unsubscribe();
    }

    /**
     * 处理行双击事件
     */
    @HostListener('dblclick', ['$event.target'])
    handleDblClick(element) {
        this.handleClick(element);
    }

    /**
     * 处理行点击事件
     */
    @HostListener('mousedown', ['$event.target'])
    handleClick(element) {
        setTimeout(() => {
            if (this.controls.length === 0)
                return;
            let control = this.controls.find(t => element.contains(t.getNativeElement()));
            control && control.focus();
        }, 100);
    }

    /**
     * 是否有效
     */
    isValid() {
        return !this.controls.some(control => !control.isValid());
    }

    /**
     * 设置焦点到验证失败的组件
     */
    focusToInvalid() {
        if (this.controls.length === 0)
            return;
        let control = this.controls.find(control => !control.isValid());
        control && control.focus();
    }

    /**
     * 设置焦点到第一个组件
     */
    focusToFirst() {
        if (this.controls.length === 0)
            return;
        let control = this.controls[0];
        control.focus();
    }
}