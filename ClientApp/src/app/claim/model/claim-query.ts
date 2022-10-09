import { QueryParameter } from 'util-angular';

/**
 * 声明查询参数
 */
export class ClaimQuery extends QueryParameter {
    /**
     * 声明标识
     */
    claimId;
    /**
     * 声明名称
     */
    name;
    /**
     * 启用
     */
    enabled;
    /**
     * 备注
     */
    remark;
}