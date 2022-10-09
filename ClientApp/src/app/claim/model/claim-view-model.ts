import { ViewModel } from 'util-angular';

/**
 * 声明参数
 */
export class ClaimViewModel extends ViewModel {
    /**
     * 声明名称
     */
    name;
    /**
     * 启用
     */
    enabled;
    /**
     * 排序号
     */
    sortId;
    /**
     * 备注
     */
    remark;
    /**
     * 创建时间
     */
    creationTime;
    /**
     * 创建人标识
     */
    creatorId;
    /**
     * 最后修改时间
     */
    lastModificationTime;
    /**
     * 最后修改人标识
     */
    lastModifierId;
    /**
     * 版本号
     */
    version;
}