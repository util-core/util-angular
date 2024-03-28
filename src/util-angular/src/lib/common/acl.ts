//============== 访问控制操作 ==========================
//Copyright 2024 何镇汐
//Licensed under the MIT license
//======================================================
import { ACLService } from '@delon/acl';
import { Util } from "../util";

/**
 * 访问控制操作
 */
export class Acl {
    /**
     * 访问控制服务
     */
    private aclService: ACLService;

    /**
     * 初始化访问控制操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.aclService = this.util.ioc.get(ACLService);
    }

    /**
     * 是否有权访问
     * @param key 资源标识
     */
    can(key: string) {
        return this.aclService.can(key);
    }
}