//============== NgZorro树形表格扩展指令测试=======================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================================
import { TreeTableExtendDirective } from './tree.table.extend.directive';
import { TreeViewModel } from "../core/tree-view-model";

describe('TreeExtendDirective', () => {
    /**
     * 树形表格扩展指令
     */
    let directive: TreeTableExtendDirective<TreeModel>;

    /**
     * 测试初始化
     */
    beforeEach(async () => {
        directive = new TreeTableExtendDirective(null);
        directive.dataSource = [
            getNodeA(), getNodeA1(), getNodeA11(), getNodeA12(), getNodeA2(), getNodeA21(), getNodeA22(),
            getNodeB(), getNodeB1(), getNodeB11(), getNodeB12(), getNodeB2(), getNodeB21(), getNodeB22(),
            getNodeC(), getNodeC1(), getNodeC11(), getNodeC12(), getNodeC2(), getNodeC21(), getNodeC22()
        ];
    });

    /**
     * 测试获取父节点
     */
    it('getParent', () => {
        let node = getNodeA12();
        let parent = directive.getParent(node)
        expect(parent.id).toEqual(getNodeA1().id);
    });

    /**
     * 测试获取所有上级节点列表
     */
    it('getParents', () => {
        let node = getNodeA12();
        let parents = directive.getParents(node)
        expect(parents.length).toEqual(2);
        expect(parents[0].id).toEqual(getNodeA1().id);
        expect(parents[1].id).toEqual(getNodeA().id);
    });

    /**
     * 测试获取直接下级节点列表
     */
    it('getChildren', () => {
        let node = getNodeA();
        let children = directive.getChildren(node)
        expect(children.length).toEqual(2);
        expect(children[0].id).toEqual(getNodeA1().id);
        expect(children[1].id).toEqual(getNodeA2().id);
    });

    /**
     * 测试获取所有下级节点列表
     */
    it('getAllChildren', () => {
        let node = getNodeA();
        let children = directive.getAllChildren(node)
        expect(children.length).toEqual(6);
        expect(children[0].id).toEqual(getNodeA1().id);
        expect(children[1].id).toEqual(getNodeA11().id);
        expect(children[2].id).toEqual(getNodeA12().id);
        expect(children[3].id).toEqual(getNodeA2().id);
        expect(children[4].id).toEqual(getNodeA21().id);
        expect(children[5].id).toEqual(getNodeA22().id);
    });

    /**
     * 测试获取所有下级节点列表 - 包含父节点
     */
    it('getAllChildren_ContainsParentNode', () => {
        let node = getNodeA();
        let children = directive.getAllChildren(node,true)
        expect(children.length).toEqual(7);
        expect(children[0].id).toEqual(getNodeA().id);
        expect(children[1].id).toEqual(getNodeA1().id);
        expect(children[2].id).toEqual(getNodeA11().id);
        expect(children[3].id).toEqual(getNodeA12().id);
        expect(children[4].id).toEqual(getNodeA2().id);
        expect(children[5].id).toEqual(getNodeA21().id);
        expect(children[6].id).toEqual(getNodeA22().id);
    });

    /**
     * 测试获取下级最后一个节点
     */
    it('getLastChild', () => {
        let node = getNodeB();
        let child = directive.getLastChild(node)
        expect(child.id).toEqual(getNodeB22().id);
    });

    /**
     * 测试获取下级最后一个节点 - 排除指定节点
     */
    it('getLastChild_exclude', () => {
        let node = getNodeB();
        let child = directive.getLastChild(node, getNodeB22().id)
        expect(child.id).toEqual(getNodeB21().id);

        child = directive.getLastChild(node, getNodeB22())
        expect(child.id).toEqual(getNodeB21().id);
    });

    /**
     * 测试获取下级最后一个节点 - 排除指定节点下方的子节点
     */
    it('getLastChild_exclude_children', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeA1 = getNodeA1();
        let nodeB = getNodeB();
        let nodeC = getNodeC();
        let nodeC1 = getNodeC1();
        let nodeC11 = getNodeC11();
        let nodeC2 = getNodeC2();
        let nodeC21 = getNodeC21();
        let nodeC22 = getNodeC22();
        directive.dataSource = [nodeA, nodeA1, nodeB, nodeC, nodeC1, nodeC11, nodeC2, nodeC21, nodeC22];


        nodeC.parentId = nodeA.id;
        let child = directive.getLastChild(nodeA, nodeC)
        expect(child.id).toEqual(nodeA1.id);
    });

    /**
     * 测试是否存在子节点
     */
    it('hasChildren_1', () => {
        let result = directive.hasChildren(getNodeA())
        expect(result).toBeTrue();

        result = directive.hasChildren(getNodeA22())
        expect(result).toBeFalse();
    });

    /**
     * 测试是否存在子节点 - 排除节点
     */
    it('hasChildren_2', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeA1 = getNodeA1();
        let nodeB = getNodeB();
        let nodeB1 = getNodeB1();
        let nodeB2 = getNodeB2();
        let nodeC = getNodeC();
        let nodeC1 = getNodeC1();
        let nodeC12 = getNodeC12();
        directive.dataSource = [nodeA, nodeA1, nodeB, nodeB1, nodeB2, nodeC, nodeC1, nodeC12];

        let result = directive.hasChildren(nodeA, nodeA1)
        expect(result).toBeFalse();

        result = directive.hasChildren(nodeB, nodeB1)
        expect(result).toBeTrue();

        result = directive.hasChildren(nodeC, nodeC1)
        expect(result).toBeFalse();
    });

    /**
     * 测试移动节点 - 源节点和目标节点都没有下级节点
     */
    it('moveNode_1', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeB = getNodeB();
        let nodeC = getNodeC();        
        directive.dataSource = [nodeA, nodeB, nodeC];

        //移动C到A下面
        nodeC.parentId = nodeA.id;
        directive.moveNode(nodeC, nodeA);

        //验证索引
        expect(directive.dataSource[0].id).toEqual(nodeA.id);
        expect(directive.dataSource[1].id).toEqual(nodeC.id);
        expect(directive.dataSource[2].id).toEqual(nodeB.id);

        //验证层级
        expect(nodeA.level).toEqual(1);
        expect(nodeB.level).toEqual(1);
        expect(nodeC.level).toEqual(2);
    });

    /**
     * 测试移动节点 - 目标节点有2个直接下级节点
     */
    it('moveNode_2', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeA1 = getNodeA1();
        let nodeA2 = getNodeA2();
        let nodeB = getNodeB();
        let nodeC = getNodeC();
        directive.dataSource = [nodeA, nodeA1, nodeA2, nodeB, nodeC];

        //移动C到A下面
        nodeC.parentId = nodeA.id;
        directive.moveNode(nodeC, nodeA);

        //验证
        expect(directive.dataSource[0].id).toEqual(nodeA.id);
        expect(directive.dataSource[1].id).toEqual(nodeA1.id);
        expect(directive.dataSource[2].id).toEqual(nodeA2.id);
        expect(directive.dataSource[3].id).toEqual(nodeC.id);
        expect(directive.dataSource[4].id).toEqual(nodeB.id);
    });

    /**
     * 测试移动节点 - 目标节点有多个下级节点
     */
    it('moveNode_3', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeA1 = getNodeA1();
        let nodeA11 = getNodeA11();
        let nodeA2 = getNodeA2();
        let nodeA21 = getNodeA21();
        let nodeA22 = getNodeA22();
        let nodeB = getNodeB();
        let nodeC = getNodeC();
        directive.dataSource = [nodeA, nodeA1, nodeA11, nodeA2, nodeA21, nodeA22, nodeB, nodeC];

        //移动C到A下面
        nodeC.parentId = nodeA.id;
        directive.moveNode(nodeC, nodeA);

        //验证
        expect(directive.dataSource[0].id).toEqual(nodeA.id);
        expect(directive.dataSource[1].id).toEqual(nodeA1.id);
        expect(directive.dataSource[2].id).toEqual(nodeA11.id);
        expect(directive.dataSource[3].id).toEqual(nodeA2.id);
        expect(directive.dataSource[4].id).toEqual(nodeA21.id);
        expect(directive.dataSource[5].id).toEqual(nodeA22.id);
        expect(directive.dataSource[6].id).toEqual(nodeC.id);        
        expect(directive.dataSource[7].id).toEqual(nodeB.id);
    });

    /**
     * 测试移动节点 - 源节点有多个下级节点
     */
    it('moveNode_4', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeB = getNodeB();
        let nodeC = getNodeC();
        let nodeC1 = getNodeC1();
        let nodeC11 = getNodeC11();
        let nodeC2 = getNodeC2();
        let nodeC21 = getNodeC21();
        let nodeC22 = getNodeC22();
        directive.dataSource = [nodeA, nodeB, nodeC, nodeC1, nodeC11, nodeC2, nodeC21, nodeC22];

        //移动C到A下面
        nodeC.parentId = nodeA.id;
        directive.moveNode(nodeC, nodeA);

        //验证索引
        expect(directive.dataSource[0].id).toEqual(nodeA.id);
        expect(directive.dataSource[1].id).toEqual(nodeC.id);
        expect(directive.dataSource[2].id).toEqual(nodeC1.id);
        expect(directive.dataSource[3].id).toEqual(nodeC11.id);
        expect(directive.dataSource[4].id).toEqual(nodeC2.id);
        expect(directive.dataSource[5].id).toEqual(nodeC21.id);
        expect(directive.dataSource[6].id).toEqual(nodeC22.id);
        expect(directive.dataSource[7].id).toEqual(nodeB.id);

        //验证层级
        expect(nodeA.level).toEqual(1);
        expect(nodeB.level).toEqual(1);
        expect(nodeC.level).toEqual(2);
        expect(nodeC1.level).toEqual(3);
        expect(nodeC11.level).toEqual(4);
        expect(nodeC2.level).toEqual(3);
        expect(nodeC21.level).toEqual(4);
        expect(nodeC22.level).toEqual(4);
    });

    /**
     * 测试移动节点 - 源节点和目标节点都有多个下级节点
     */
    it('moveNode_5', () => {
        //移动C到A下面
        getNodeC().parentId = getNodeA().id;
        directive.moveNode(getNodeC(), getNodeA());

        //验证索引
        expect(directive.dataSource[0].id).toEqual(getNodeA().id);
        expect(directive.dataSource[1].id).toEqual(getNodeA1().id);
        expect(directive.dataSource[2].id).toEqual(getNodeA11().id);
        expect(directive.dataSource[3].id).toEqual(getNodeA12().id);
        expect(directive.dataSource[4].id).toEqual(getNodeA2().id);
        expect(directive.dataSource[5].id).toEqual(getNodeA21().id);
        expect(directive.dataSource[6].id).toEqual(getNodeA22().id);
        expect(directive.dataSource[7].id).toEqual(getNodeC().id);
        expect(directive.dataSource[8].id).toEqual(getNodeC1().id);
    });

    /**
     * 测试移动节点 - 父节点为空,移动到根
     */
    it('moveNode_6', () => {
        //初始化数据源
        let nodeA = getNodeA();
        let nodeB = getNodeB();
        let nodeC = getNodeC();
        let nodeC1 = getNodeC1();
        let nodeC11 = getNodeC11();
        let nodeC2 = getNodeC2();
        let nodeC21 = getNodeC21();
        let nodeC22 = getNodeC22();
        directive.dataSource = [nodeA, nodeB, nodeC, nodeC1, nodeC11, nodeC2, nodeC21, nodeC22];

        //将C1移动到根
        nodeC1.parentId = null;
        directive.moveNode(nodeC1);

        //验证索引
        expect(directive.dataSource[0].id).toEqual(nodeA.id);
        expect(directive.dataSource[1].id).toEqual(nodeB.id);
        expect(directive.dataSource[2].id).toEqual(nodeC.id);        
        expect(directive.dataSource[3].id).toEqual(nodeC2.id);
        expect(directive.dataSource[4].id).toEqual(nodeC21.id);
        expect(directive.dataSource[5].id).toEqual(nodeC22.id);
        expect(directive.dataSource[6].id).toEqual(nodeC1.id);
        expect(directive.dataSource[7].id).toEqual(nodeC11.id);

        //验证层级
        expect(nodeA.level).toEqual(1);
        expect(nodeB.level).toEqual(1);
        expect(nodeC.level).toEqual(1);
        expect(nodeC1.level).toEqual(1);
        expect(nodeC11.level).toEqual(2);
        expect(nodeC2.level).toEqual(2);
        expect(nodeC21.level).toEqual(3);
        expect(nodeC22.level).toEqual(3);
    });
});

/**
 * 树形测试模型
 */
class TreeModel extends TreeViewModel {
    constructor(id: string, public name: string, parentId: string=null,level:number=1) {
        super();
        this.id = id;
        this.parentId = parentId;
        this.level = level;
    }
}

function getNodeA() {
    return new TreeModel("1", "a");
}
function getNodeA1() {
    return new TreeModel("11", "a1", "1",2);
}
function getNodeA11() {
    return new TreeModel("111", "a11", "11",3);
}
function getNodeA12() {
    return new TreeModel("112", "a12", "11",3);
}
function getNodeA2() {
    return new TreeModel("12", "a2", "1",2);
}
function getNodeA21() {
    return new TreeModel("121", "a21", "12",3);
}
function getNodeA22() {
    return new TreeModel("122", "a22", "12",3);
}
function getNodeB() {
    return new TreeModel("2", "b");
}
function getNodeB1() {
    return new TreeModel("21", "b1", "2",2);
}
function getNodeB11() {
    return new TreeModel("211", "b11", "21",3);
}
function getNodeB12() {
    return new TreeModel("212", "b12", "21",3);
}
function getNodeB2() {
    return new TreeModel("22", "b2", "2",2);
}
function getNodeB21() {
    return new TreeModel("221", "b21", "22",3);
}
function getNodeB22() {
    return new TreeModel("222", "b22", "22",3);
}
function getNodeC() {
    return new TreeModel("3", "c");
}
function getNodeC1() {
    return new TreeModel("31", "c1", "3",2);
}
function getNodeC11() {
    return new TreeModel("311", "c11", "31",3);
}
function getNodeC12() {
    return new TreeModel("312", "c12", "31",3);
}
function getNodeC2() {
    return new TreeModel("32", "c2", "3",2);
}
function getNodeC21() {
    return new TreeModel("321", "c21", "32",3);
}
function getNodeC22() {
    return new TreeModel("322", "c22", "32",3);
}
