//============== 日期范围输入框扩展指令 =========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//===============================================================
import { Directive, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

/**
 * 日期范围输入框扩展指令
 */
@Directive({
    selector: '[x-range-picker-extend]',
    exportAs: 'xRangePickerExtend'
})
export class RangePickerExtendDirective implements OnInit, OnChanges {
    /**
     * 范围日期
     */
    rangeDates: Date[];
    /**
     * 起始日期
     */
    @Input() beginDate: Date;
    /**
     * 结束日期
     */
    @Input() endDate: Date;
    /**
     * 起始日期变更事件
     */
    @Output() beginDateChange = new EventEmitter<Date>();
    /**
     * 结束日期变更事件
     */
    @Output() endDateChange = new EventEmitter<Date>();

    /**
     * 初始化
     */
    ngOnInit() {
        this.setRangeDates();
    }

    /**
     * 设置范围日期
     */
    setRangeDates() {
        if (!this.beginDate && !this.endDate) {
            this.rangeDates = [];
            return;
        }
        if (this.beginDate && !this.endDate) {
            this.rangeDates = [this.beginDate, new Date()];
            return;
        }
        if (!this.beginDate && this.endDate) {
            this.rangeDates = [new Date(this.endDate.getFullYear(),0), this.endDate];
            return;
        }
        this.rangeDates = [this.beginDate, this.endDate];
    }

    /**
     * 变更检测
     */
    ngOnChanges(changes: SimpleChanges) {
        const { beginDate, endDate } = changes;
        if (beginDate && beginDate.currentValue !== beginDate.previousValue ||
            endDate && endDate.currentValue !== endDate.previousValue) {
            this.setRangeDates();
        }
    }

    /**
     * 范围日期变更事件处理
     */
    handleRangeDateChange(dates: Date[]) {
        if (!dates || dates.length < 2)
            return;
        if (this.beginDate != dates[0]) {
            this.beginDate = dates[0];
            this.beginDateChange.emit(this.beginDate);
        }
        if (this.endDate != dates[1]) {
            this.endDate = dates[1];
            this.endDateChange.emit(this.endDate);
        }
    }
}