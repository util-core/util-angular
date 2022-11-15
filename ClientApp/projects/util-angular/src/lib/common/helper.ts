//============== 公共操作=========================
//Copyright 2022 何镇汐
//Licensed under the MIT license
//================================================
import {
    trimEnd as trimEnd2, trimStart as trimStart2, remove as remove2, isEmpty as isEmpty2, groupBy as groupBy2,
    hasIn, cloneDeep, assign as assign2
} from "lodash";
import * as moment from 'moment';
import { UUID } from './internal/uuid';

/**
 * 是否未定义
 * @param value 值
 */
export let isUndefined = (value): boolean => {
    return typeof value === 'undefined';
}

/**
 * 是否空值，当值为undefined、null、空对象,空字符串、空Guid时返回true，其余返回false
 * @param value 值
 */
export let isEmpty = (value): boolean => {
    if (typeof value === "number")
        return false;
    if (typeof value == "boolean")
        return false;
    if (value && value.trim)
        value = value.trim();
    if (!value)
        return true;
    if (value === "00000000-0000-0000-0000-000000000000")
        return true;
    return isEmpty2(value);
}

/**
 * 是否数字，字符串"1"返回true
 * @param value 值
 */
export let isNumber = (value): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * 转换为数值
 * @param value 输入值
 * @param precision 数值精度，即小数位数，可选值为0-20
 * @param isTruncate 是否截断，传入true，则按精度截断，否则四舍五入
 */
export let toNumber = (value, precision?, isTruncate?: boolean) => {
    if (!isNumber(value))
        return 0;
    value = value.toString();
    if (isEmpty(precision))
        return parseFloat(value);
    if (isTruncate)
        return parseFloat(value.substring(0, value.indexOf(".") + parseInt(precision) + 1));
    return parseFloat(parseFloat(value).toFixed(precision));
}

/**
 * 创建唯一标识
 */
export let uuid = (): string => {
    return UUID.UUID();
}

/**
 * 从数组中移除子集
 * @param source 源数组
 * @param predicate 条件
 */
export let remove = <T>(source: Array<T>, predicate: (value: T) => boolean): Array<T> => {
    return remove2(source, t => predicate(t));
}

/**
 * 移除起始字符串
 * @param source 值
 * @param start 要移除的值
 */
export let trimStart = (value: string, start: string) => {
    return trimStart2(value, start);
}

/**
 * 移除末尾字符串
 * @param source 值
 * @param end 要移除的值
 */
export let trimEnd = (value: string, end: string) => {
    return trimEnd2(value, end);
}

/**
 * 获取地址
 * @param url 请求地址
 * @param host 主机
 * @param path 路径
 */
export function getUrl(url: string, host: string = null, path: string = null) {
    url = getHostUrl(url, host);
    if (!url)
        return null;
    if (path) {
        url = trimEnd(url, "/");
        path = trimStart(path, "/");
        return `${url}/${path}`;
    }
    return url;
}

/**
 * 获取地址
 */
function getHostUrl(url: string, host: string) {
    if (!url)
        return null;
    if (url.startsWith("http"))
        return url;
    host = trimEnd(host, "/");
    if (url.startsWith("/")) {
        if (host)
            return `${host}${url}`;
        return url;
    }
    if (host)
        return `${host}/api/${url}`;
    return `/api/${url}`;
}

/**
 * 分组
 * @param source 集合
 * @param property 分组属性
 */
export let groupBy = <T>(source: T[], property?: (t: T) => any): Map<string, T[]> => {
    let groups = groupBy2(source, property);
    let result = new Map<string, T[]>();
    for (var key in groups) {
        if (!key)
            continue;
        result.set(key, groups[key].map(t => <T>t));
    }
    return result;
}

/**
 * 判断对象上是否存在指定属性,当属性值不为undefined有效,直接属性和继承属性均可
 * @param obj 对象
 * @param propertyName 属性名称
 */
export function hasProperty(obj, propertyName: string): boolean {
    return hasIn(obj, propertyName);
}

/**
 * 复制对象
 * @param obj 对象
 */
export let clone = <T>(obj: T): T => {
    return cloneDeep(obj);
}

/**
 * 将源对象赋值给目标对象
 * @param destination 目标对象
 * @param source 源对象
 */
export let assign = (destination,source) => {
    return assign2(destination, source );
}

/**
 *  格式化日期
 * @param datetime 日期
 * @param format 格式化字符串，范例：YYYY-MM-DD,可选值：(注意：区分大小写)
 * (1) 年: YYYY
 * (2) 月: MM
 * (3) 日: DD
 * (4) 时: HH
 * (5) 分: mm
 * (6) 秒: ss
 * (7) 毫秒: SSS
 */
export let formatDate = (datetime, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    let date = moment(datetime);
    if (!date.isValid())
        return "";
    return date.format(format);
}

/**
 * 转换为json字符串
 * @param value 值
 */
export let toJson = (value): string => {
    return JSON.stringify(value);
}

/**
 * json字符串转换为对象
 * @param json json字符串
 */
export let toObjectFromJson = <T>(json: string): T => {
    return JSON.parse(json);
}

/**
 * 获取标识列表
 * @param data 数据
 */
export function getIds(data) {
    if (!data)
        return null;
    if (!data.map)
        return data.id;
    return data.map(t => t.id);
}