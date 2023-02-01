//============== 公共操作测试 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import * as helper from "./helper"
import { QueryParameter } from "../core/query-parameter";

describe('util.helper', () => {
    it("isEmpty", () => {
        expect(helper.isEmpty(undefined)).toBeTruthy("undefined");
        expect(helper.isEmpty(null)).toBeTruthy("null");
        expect(helper.isEmpty({})).toBeTruthy("{}");
        expect(helper.isEmpty("")).toBeTruthy("''");
        expect(helper.isEmpty("  ")).toBeTruthy("'  '");
        expect(helper.isEmpty(0)).toBeFalsy("0");
        expect(helper.isEmpty("0")).toBeFalsy("'0'");
        expect(helper.isEmpty("00000000-0000-0000-0000-000000000000")).toBeTruthy("00000000-0000-0000-0000-000000000000");
        expect(helper.isEmpty("4ABCA27E-EAFC-4DEE-B809-8DD2ABDFDA1C")).toBeFalsy("4ABCA27E-EAFC-4DEE-B809-8DD2ABDFDA1C");
        expect(helper.isEmpty("6")).toBeFalsy("'6'");
        expect(helper.isEmpty(6)).toBeFalsy("6");
        expect(helper.isEmpty("a6")).toBeFalsy("a6");
        expect(helper.isEmpty("false")).toBeFalsy("false");
        expect(helper.isEmpty(false)).toBeFalsy("false");
        expect(helper.isEmpty(true)).toBeFalsy("true");
    });
    it("isNumber", () => {
        expect(helper.isNumber(1)).toBeTruthy("1");
        expect(helper.isNumber("1")).toBeTruthy("'1'");
        expect(helper.isNumber("")).toBeFalsy("''");
        expect(helper.isNumber("a")).toBeFalsy("'a'");
    });
    it("toNumber", () => {
        expect(helper.toNumber("a")).toEqual(0, "a");
        expect(helper.toNumber("0")).toEqual(0, "0");
        expect(helper.toNumber("1")).toEqual(1, "1");
        expect(helper.toNumber("1.5")).toEqual(1.5, "1.5");
        expect(helper.toNumber("1.5", 0)).toEqual(2, "1.5,0");
        expect(helper.toNumber("1.5", 0, true)).toEqual(1, "1.5,0,true");
        expect(helper.toNumber("8.99999999999999999", 0)).toEqual(9);
        expect(helper.isNumber(helper.toNumber("8.99999999999999999", 0))).toBeTruthy();
        expect(helper.toNumber("8.99999999999999999", 2, true)).toEqual(8.99);
        expect(helper.toNumber(1.567, 1, true)).toEqual(1.5);
        expect(helper.isNumber(helper.toNumber("8.99999999999999999", 2, true))).toBeTruthy();
    });
    it("getUrl", () => {
        expect(helper.getUrl(null)).toBeNull();
        expect(helper.getUrl(undefined)).toBeNull();
        expect(helper.getUrl("")).toBeNull();
        expect(helper.getUrl("a")).toEqual("/api/a");
        expect(helper.getUrl("/a")).toEqual("/a");
        expect(helper.getUrl("http://a.com/test")).toEqual("http://a.com/test");
        expect(helper.getUrl("test","http://a.com")).toEqual("http://a.com/api/test");
        expect(helper.getUrl("test", "http://a.com/")).toEqual("http://a.com/api/test");
        expect(helper.getUrl("test","https://a.com")).toEqual("https://a.com/api/test");
        expect(helper.getUrl("/test", "http://a.com/")).toEqual("http://a.com/test");
        expect(helper.getUrl("http://a.com/test", "http://b.com/")).toEqual("http://a.com/test");
        expect(helper.getUrl("test/b", "http://a.com")).toEqual("http://a.com/api/test/b");
        expect(helper.getUrl("test/b", "http://a.com/")).toEqual("http://a.com/api/test/b");
        expect(helper.getUrl("/test/b", "http://a.com/")).toEqual("http://a.com/test/b");
        expect(helper.getUrl("", "http://a.com")).toBeNull();
        expect(helper.getUrl("a", null, "b")).toEqual("/api/a/b");
        expect(helper.getUrl("/test", "http://a.com/", "b")).toEqual("http://a.com/test/b");
        expect(helper.getUrl("/test/", "http://a.com/", "b")).toEqual("http://a.com/test/b");
        expect(helper.getUrl("/test/b/", "http://a.com/", "/c")).toEqual("http://a.com/test/b/c");
    });
    it("hasProperty", () => {
        let query = new TestQuery();
        expect(helper.hasProperty(query, "pageSize")).toBeTrue();
        expect(helper.hasProperty(query, "test")).toBeTrue();
    });
    it("formatDate", () => {
        expect(helper.formatDate(new Date(2022, 8, 2, 13, 58, 36))).toEqual("2022-09-02 13:58:36");
        expect(helper.formatDate(new Date("2022-9-2 13:58:36"))).toEqual("2022-09-02 13:58:36");
    });
});

/**
 * 测试参数
 */
class TestQuery extends QueryParameter {
    test:string;
}