//============== Url²Ù×÷²âÊÔ =========================
//Copyright 2023 ºÎÕòÏ«
//Licensed under the MIT license
//=====================================================
import { Util } from "../util";
import { AppConfig } from "../config/app-config";
import { Url } from "./url"

describe('Url', () => {
    it("get", () => {
        let appConfig = new AppConfig();
        appConfig.apiEndpoint = "http://a.com";
        let url = new Url(new Util(null, appConfig));
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
});