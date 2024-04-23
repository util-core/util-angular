//============== 表头标题对齐扩展指令 =========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//=============================================================
import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

/**
 * 表头标题对齐扩展指令
 */
@Directive({
    selector: '[titleAlign]',
    standalone: true
})
export class TableHeadAlignDirective implements OnInit, OnChanges {       
    /**
     * 标题对齐方式
     */
    @Input() titleAlign;

    /**
     * 初始化
     * @param element 表头th元素
     */
    constructor(private element: ElementRef) {
    }

    /**
     * 初始化
     */
    ngOnInit() {
        this.initTextAlign();
    }

    /**
     * 初始化对齐方式
     */
    private initTextAlign() {
        if (!this.element)
            return;
        if (!this.element.nativeElement)
            return;
        this.element.nativeElement.style.textAlign = this.titleAlign;
    }

    /**
     * 变更检测
     */
    ngOnChanges(changes: SimpleChanges) {
        const { titleAlign } = changes;
        if (titleAlign && titleAlign.currentValue !== titleAlign.previousValue) {
            this.initTextAlign();
        }
    }
}