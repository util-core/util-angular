//============== 公共操作测试 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import * as helper from "./helper"
import { QueryParameter } from "../core/query-parameter";

describe('util.helper', () => {
    it("isEmpty", () => {
        expect(helper.isEmpty(undefined)).withContext("undefined").toBeTruthy();
        expect(helper.isEmpty(null)).withContext("null").toBeTruthy();
        expect(helper.isEmpty({})).withContext("{}").toBeTruthy();
        expect(helper.isEmpty("")).withContext("''").toBeTruthy();
        expect(helper.isEmpty("  ")).withContext("'  '").toBeTruthy();
        expect(helper.isEmpty(0)).withContext("0").toBeFalsy();
        expect(helper.isEmpty("0")).withContext("'0'").toBeFalsy();
        expect(helper.isEmpty("00000000-0000-0000-0000-000000000000")).withContext("00000000-0000-0000-0000-000000000000").toBeTruthy();
        expect(helper.isEmpty("4ABCA27E-EAFC-4DEE-B809-8DD2ABDFDA1C")).withContext("4ABCA27E-EAFC-4DEE-B809-8DD2ABDFDA1C").toBeFalsy();
        expect(helper.isEmpty("6")).withContext("'6'").toBeFalsy();
        expect(helper.isEmpty(6)).withContext("6").toBeFalsy();
        expect(helper.isEmpty("a6")).withContext("a6").toBeFalsy();
        expect(helper.isEmpty("false")).withContext("false").toBeFalsy();
        expect(helper.isEmpty(false)).withContext("false").toBeFalsy();
        expect(helper.isEmpty(true)).withContext("true").toBeFalsy();
    });
    it("isNumber", () => {
        expect(helper.isNumber(1)).withContext("1").toBeTruthy();
        expect(helper.isNumber("1")).withContext("'1'").toBeTruthy();
        expect(helper.isNumber("")).withContext("''").toBeFalsy();
        expect(helper.isNumber("a")).withContext("'a'").toBeFalsy();
    });
    it("toNumber", () => {
        expect(helper.toNumber("a")).withContext("a").toEqual(0);
        expect(helper.toNumber("0")).withContext("0").toEqual(0);
        expect(helper.toNumber("1")).withContext("1").toEqual(1);
        expect(helper.toNumber("1.5")).withContext("1.5").toEqual(1.5);
        expect(helper.toNumber("1.5", 0)).withContext("1.5,0").toEqual(2);
        expect(helper.toNumber("1.5", 0, true)).withContext("1.5,0,true").toEqual(1);
        expect(helper.toNumber("8.99999999999999999", 0)).toEqual(9);
        expect(helper.isNumber(helper.toNumber("8.99999999999999999", 0))).toBeTruthy();
        expect(helper.toNumber("8.99999999999999999", 2, true)).toEqual(8.99);
        expect(helper.toNumber(1.567, 1, true)).toEqual(1.5);
        expect(helper.isNumber(helper.toNumber("8.99999999999999999", 2, true))).toBeTruthy();
    });
    it("toArray", () => {
        expect(helper.toArray("a")).toEqual(['a']);
        expect(helper.toArray("a,b")).toEqual(['a','b']);
    });
    it("toQueryString", () => {
        expect(helper.toQueryString({a:1})).toEqual("a=1");
        expect(helper.toQueryString({ a: 1,b:"c" })).toEqual("a=1&b=c");
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
        expect(helper.formatDate(new Date("2022-9-2 13:58:36"), "YYYY-MM-DD HH:mm:ss")).toEqual("2022-09-02 13:58:36");
        expect(helper.formatDate(new Date("2022-9-2 13:58:36"), "YY-MM-DD HH:mm:ss")).toEqual("22-09-02 13:58:36");
    });
    it("toList", () => {
        expect(helper.toList<number>("")).toEqual([]);
        expect(helper.toList<number>("1")[0]==1).toBeTrue();
        expect(helper.toList<number>("1,2")[1] == 2).toBeTrue();
        expect(helper.toList<string>("1")[0] == "1").toBeTrue();
    });
    it("to", () => {
        expect(helper.to<number>(undefined)).toEqual(undefined);
        expect(helper.to<number>("1") == 1).toBeTrue();
    });
    it("blobToStringAsync", async () => {
        let json = '{"test":"a","order":"b"}';
        let blobParts = [json];
        let blob = new Blob(blobParts, { type: "application/json" })
        let jsonResult = await helper.blobToStringAsync(blob);
        expect(jsonResult).toEqual(json);
        let query = helper.toObjectFromJson<TestQuery>(jsonResult);
        expect(query.test).toEqual("a");
        expect(query.order).toEqual("b");
    });
});

/**
 * 测试参数
 */
class TestQuery extends QueryParameter {
    test:string;
}