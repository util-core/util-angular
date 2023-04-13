//============== 数据容器测试 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//==================================================
import { DataContainer } from "./data-container";
import { ViewModel } from "../core/view-model";
import { Util } from "../util";

describe('DataContainerTest', () => {
    /**
     * 数据容器
     */
    let dataContainer: DataContainer<ViewModel>;

    /**
     * 测试初始化
     */
    beforeEach(async () => {
        dataContainer = new DataContainer<ViewModel>(new Util());
        dataContainer.setData(getData(), 3);
    });

    /**
     * 获取数据
     */
    let getData = ():ViewModel[] =>  {
        return [{ id: "1" }, { id: "2" }, { id: "3" }];
    }

    /**
     * 测试勾选标识列表 - 标识集合
     */
    it('checkIds_1', () => {
        dataContainer.checkIds(["1", "2"])
        expect(dataContainer.getCheckedIds()).toEqual("1,2");
    });
    /**
     * 测试勾选标识列表 - 标识集合 - 有重复
     */
    it('checkIds_2', () => {
        dataContainer.checkIds(["1", "2", "2"])
        expect(dataContainer.getCheckedIds()).toEqual("1,2");
    });
    /**
     * 测试勾选标识列表 - 单个标识
     */
    it('checkIds_3', () => {
        dataContainer.checkIds("2")
        expect(dataContainer.getCheckedIds()).toEqual("2");
    });
    /**
     * 测试勾选标识列表 - 逗号分隔的标识列表
     */
    it('checkIds_4', () => {
        dataContainer.checkIds("2,3")
        expect(dataContainer.getCheckedIds()).toEqual("2,3");
    });
});