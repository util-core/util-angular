//============== Url操作测试 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=====================================================
import { Util } from "../util";
import { AppConfig } from "../config/app-config";
import { ModuleConfig } from "../config/module-config";
import { Url } from "./url"

describe('Url', () => {
    let url: Url;
    let appConfig:AppConfig;

    /**
     * 测试初始化
     */
    beforeEach(() => {
        appConfig = new AppConfig();
        appConfig.apiEndpoint = "http://a.com";
        url = new Url(new Util(null, appConfig));
    });
    it("get", () => {
        expect(url.get(null)).toBeNull();
        expect(url.get(undefined)).toBeNull();
        expect(url.get("")).toBeNull();
        expect(url.get("http://a.com/test")).toEqual("http://a.com/test");
        expect(url.get("test")).toEqual("http://a.com/api/test");
        expect(url.get("/test")).toEqual("http://a.com/test");
        expect(url.get("test/b")).toEqual("http://a.com/api/test/b");
        expect(url.get("/test", "b")).toEqual("http://a.com/test/b");
        expect(url.get("/test/","b")).toEqual("http://a.com/test/b");
        expect(url.get("/test/b/", "/c")).toEqual("http://a.com/test/b/c");
        expect(url.get("test", "b/", "/c")).toEqual("http://a.com/api/test/b/c");
        expect(url.get("/test/", "/b/", "/c/", "/d/")).toEqual("http://a.com/test/b/c/d");
    });
    it("get_apiPrefix_1", () => {
        let moduleConfig = new ModuleConfig();
        moduleConfig.apiPrefix = "order/v1";
        url = new Url(new Util(null, appConfig), moduleConfig );
        expect(url.get("getOrder")).toEqual("http://a.com/order/v1/api/getOrder");
    });
    it("get_apiPrefix_2", () => {
        let moduleConfig = new ModuleConfig();
        moduleConfig.apiPrefix = "/order/v1/";
        url = new Url(new Util(null, appConfig), moduleConfig);
        expect(url.get("getOrder")).toEqual("http://a.com/order/v1/api/getOrder");
    });
    it("get_apiPrefix_3", () => {
        let moduleConfig = new ModuleConfig();
        moduleConfig.apiPrefix = "/order/v1/";
        url = new Url(new Util(null, appConfig), moduleConfig);
        expect(url.get("/getOrder")).toEqual("http://a.com/getOrder");
    });
    it("query", () => {
        url.query({ a: 1, b: 2 });
        expect(url.get("http://a.com/test")).toEqual("http://a.com/test?a=1&b=2");
        expect(url.get("test")).toEqual("http://a.com/api/test?a=1&b=2");
    });
});