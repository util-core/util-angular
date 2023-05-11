//============== 公共操作=========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//================================================
import {
    trimEnd as trimEnd2, trimStart as trimStart2, remove as remove2, isEmpty as isEmpty2, groupBy as groupBy2,
    hasIn, cloneDeep, assign as assign2, toString as toString2, split as split2, toPairs, uniqBy
} from "lodash-es";
import { format as format2 } from 'date-fns'
import { UUID } from './internal/uuid';

/**
 * 是否未定义
 * @param value 值
 */
export let isUndefined = (value): boolean => {
    return typeof value === 'undefined';
}

/**
 * 是否字符串
 * @param value 值
 */
export let isString = (value): boolean => {
    return typeof value === 'string';
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
 * 是否数组
 * @param value 值
 */
export let isArray = (value): boolean => {
    return Array.isArray(value);
}

/**
 * 是否空数组,undefined和null返回false,[]返回true
 * @param value 值
 */
export let isEmptyArray = (value): boolean => {
    return isArray(value) && value.length === 0;
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
 * 插入到数组
 * @param source 数组
 * @param item 项
 * @param index 索引
 */
export let insert = (source: any[], item, index?: number) => {
    if (isUndefined(source) || source == null)
        return [];
    if (isUndefined(index)) {
        source.push(item);
        return source;
    }
    source.splice(index, 0, item);
    return source;
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
 * 是否Promise类型
 * @param obj 对象
 */
export function isPromise<T>(obj): obj is Promise<T> {
    return !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
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
 * 去重复
 * @param source 源集合
 * @param property 属性
 */
export let distinct = <T>(source: T[], property?: (t: T) => any): T[] => {
    return uniqBy(source, property);
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
export let assign = (destination, source) => {
    return assign2(destination, source);
}

/**
 *  格式化日期
 * @param datetime 日期
 * @param format 格式化字符串，范例：yyyy-MM-dd,可选值：(注意：区分大小写)
 * (1) 年: yyyy
 * (2) 月: MM
 * (3) 日: dd
 * (4) 时: HH
 * (5) 分: mm
 * (6) 秒: ss
 * (7) 毫秒: SSS
 */
export let formatDate = (datetime, format: string = 'yyyy-MM-dd HH:mm:ss'): string => {
    if (!format)
        format = 'yyyy-MM-dd HH:mm:ss';
    format = format.replace(/Y/g, "y").replace(/D/g, "d");
    return format2(datetime, format);
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
 * 将逗号分隔的字符串转换为数组
 * @param value 输入值,范例: "a,b,c"
 */
export let toArray = <T>(value: string): T[] => {
    return split2(value,',');
}

/**
 * 转换为字符串
 * @param value 输入值
 */
export let toString = (value): string => {
    return toString2(value).trim();
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
 * Blob转换为字符串
 * @param value 二进制大对象值
 */
export let blobToStringAsync = async (value: Blob): Promise<string> => {
    var decoder = new TextDecoder('utf-8');
    let buffer = await value.arrayBuffer();
    return decoder.decode(new Uint8Array(buffer));
}

/**
 * 将对象转换为url查询字符串,即?后面的参数
 * @param obj 对象
 */
export let toQueryString = (obj): string => {
    if (!obj)
        return null;
    return toPairs(obj)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
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

/**
 * 泛型集合转换
 * @param input 以逗号分隔的元素集合字符串，范例: 1,2
 */
export let toList = <T>(input: string): T[] => {
    var result = new Array<T>();
    if (isEmpty(input))
        return result;
    var array = input.split(',');
    array.forEach(value => {
        if (!value)
            return;
        result.push(to(value));
    });
    return result;
}

/**
 * 通用泛型转换
 * @param value 值
 */
export let to = <T>(value): T => {
    return <T>value;
}

/**
 * 连接url
 * @param url 地址
 * @param path 路径
 */
export let joinUrl = (url: string, path: string) => {
    if (!url || !path)
        return url;
    url = trimEnd(url, "/");
    path = trimStart(path, "/");
    return `${url}/${path}`;
}

/**
 * 获取地址
 * @param url 请求地址
 * @param host 主机
 * @param path 路径
 */
export function getUrl(url: string, host: string = null, path: string = null) {
    url = getHostUrl(url, host);
    return joinUrl(url, path);
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