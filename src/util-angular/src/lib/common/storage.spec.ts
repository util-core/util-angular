//============== 浏览器本地存储操作测试 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===============================================================
import { Util } from "../util";
import { QueryParameter } from "../core/query-parameter";

describe('util.storage', () => {
    let util: Util;
    let time;
    
    /**
     * 测试初始化
     */
    beforeEach(() => {
        util = new Util();
        time = Date.now();
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(time));
    });
    /**
     * 测试清理
     */
    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it("setLocalItem_1", () => {
        let key = "setLocalItem_1";
        util.storage.setLocalItem(key, "a");
        expect(util.storage.getLocalItem(key)).toEqual("a");
    });

    it("setLocalItem_2", () => {
        let key = "setLocalItem_2";
        util.storage.setLocalItem(key, "a", 10);
        jasmine.clock().mockDate(new Date(time + 9000));
        expect(util.storage.getLocalItem(key)).toEqual("a");
    });

    it("setLocalItem_3", () => {
        let key = "setLocalItem_3";
        util.storage.setLocalItem(key, "a", 10);
        jasmine.clock().mockDate(new Date(time + 11000));
        expect(util.storage.getLocalItem(key)).toBeNull();
    });

    it("setLocalItem_4", () => {
        let key = "setLocalItem_4";
        let data = new QueryParameter();
        data.keyword = "a";
        util.storage.setLocalItem(key, data);
        expect(util.storage.getLocalItem<QueryParameter>(key).keyword).toEqual("a");
    });

    it("setSessionItem_1", () => {
        let key = "setSessionItem_1";
        util.storage.setSessionItem(key, "a");
        expect(util.storage.getSessionItem(key)).toEqual("a");
    });

    it("setSessionItem_2", () => {
        let key = "setSessionItem_2";
        util.storage.setSessionItem(key, "a", 10);
        jasmine.clock().mockDate(new Date(time + 9000));
        expect(util.storage.getSessionItem(key)).toEqual("a");
    });

    it("setSessionItem_3", () => {
        let key = "setSessionItem_3";
        util.storage.setSessionItem(key, "a", 10);
        jasmine.clock().mockDate(new Date(time + 11000));
        expect(util.storage.getSessionItem(key)).toBeNull();
    });

    it("setSessionItem_4", () => {
        let key = "setSessionItem_4";
        let data = new QueryParameter();
        data.keyword = "a";
        util.storage.setSessionItem(key, data);
        expect(util.storage.getSessionItem<QueryParameter>(key).keyword).toEqual("a");
    });

    it("getLocalItems", () => {
        util.storage.clearLocalItems();

        let key = "getLocalItems_1";
        util.storage.setLocalItem(key, "a");

        let key2 = "getLocalItems_2";
        let data = new QueryParameter();
        data.keyword = "b";
        util.storage.setLocalItem(key2, data);

        let result = util.storage.getLocalItems();
        expect(result.size).toEqual(2);
        expect(result.get(key)).toEqual("a");
        expect(util.helper.toJson(result.get(key2))).toEqual(util.helper.toJson(data));
    });

    it("getSessionItems", () => {
        util.storage.clearSessionItems();

        let key = "getSessionItems_1";
        util.storage.setSessionItem(key, "a");

        let key2 = "getSessionItems_2";
        let data = new QueryParameter();
        data.keyword = "b";
        util.storage.setSessionItem(key2, data);

        let result = util.storage.getSessionItems();
        expect(result.size).toEqual(2);
        expect(result.get(key)).toEqual("a");
        expect(util.helper.toJson(result.get(key2))).toEqual(util.helper.toJson(data));
    });
});