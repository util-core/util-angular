//============== NgZorro表格编辑控件扩展指令=================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===========================================================
import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, Self, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { EditRowDirective } from "./edit-row.directive";

/**
 * NgZorro表格编辑控件扩展指令
 */
@Directive( {
    selector: '[x-edit-control]',
    exportAs: 'xEditControl'
} )
export class EditControlDirective implements OnInit, OnDestroy {
    /**
     * 控件实例
     */
    @Input('x-edit-control') instance;
    /**
     * 编辑行
     */
    @Input() editRow: EditRowDirective;
    /**
     * 变更事件
     */
    @Output() onChange = new EventEmitter<any>();

    /**
     * 初始化表格编辑控件扩展指令
     * @param element 元素
     * @param control 组件
     */
    constructor(@Self() private element: ElementRef, @Optional() @Self() private control: NgControl ) {
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.registerToRow();
        this.registerChange();
    }

    /**
     * 注册到编辑行指令
     */
    registerToRow() {
        if (this.editRow )
            this.editRow.register( this );
    }

    /**
     * 注册变更事件
     */
    registerChange() {
        if ( !this.control )
            return;
        setTimeout( () => {
            this.control.valueChanges.subscribe( value => {
                this.onChange.emit( value );
            } );
        },100 );
    }

    /**
     * 组件销毁
     */
    ngOnDestroy() {
        if (this.editRow )
            this.editRow.unRegister( this );
    }

    /**
     * 是否有效
     */
    isValid() {
        if ( !this.control )
            return false;
        return !this.control.invalid;
    }

    /**
     * 设置焦点
     */
    focus() {
        setTimeout(() => {
            if (this.instance && this.instance.focus) {
                this.instance.focus();
                return;
            }
            if ( this.element && this.element.nativeElement )
                this.element.nativeElement.focus();
        }, 0 );
    }

    /**
     * 获取元素
     */
    getNativeElement() {
        if ( this.element )
            return this.element.nativeElement;
        return null;
    }
}