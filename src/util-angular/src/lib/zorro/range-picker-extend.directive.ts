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
    exportAs: 'xRangePickerExtend',
    standalone: true
})
export class RangePickerExtendDirective implements OnInit, OnChanges {
    private _rangeDates: Date[];
    /**
     * 范围日期
     */
    get rangeDates(): Date[] {
        return this._rangeDates;
    }
    set rangeDates(value: Date[]) {
        this._rangeDates = value;
        this.restore();
    }
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
     * 变更检测
     */
    ngOnChanges(changes: SimpleChanges) {
        const { beginDate, endDate } = changes;
        if (beginDate && beginDate.currentValue !== beginDate.previousValue ||
            endDate && endDate.currentValue !== endDate.previousValue) {
            this.setRangeDates();
            return;
        }
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
     * 还原范围日期
     */
    restore() {
        if (!this.rangeDates || this.rangeDates.length < 2)
            return;
        if (this.beginDate != this.rangeDates[0]) {
            this.beginDate = this.rangeDates[0];
            this.beginDateChange.emit(this.beginDate);
        }
        if (this.endDate != this.rangeDates[1]) {
            this.endDate = this.rangeDates[1];
            this.endDateChange.emit(this.endDate);
        }
    }
}