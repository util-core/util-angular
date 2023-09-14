//================== 租户服务 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//======================================================
import { Util } from "../util";
import { TenantInfo } from "./tenant-info";

/**
 * 租户服务
 */
export class TenantService {
    /**
     * 租户键名,默认值: x-tenant-id
     */
    static TenantKey: string = "x-tenant-id";

    /**
     * 初始化租户服务
     * @param util 公共操作
     */
    constructor(private util: Util) {
    }

    /**
     * 设置租户标识
     * @param tenantId 租户标识
     * @param expires 过期时间,单位:秒,默认值: 360000
     */
    setTenant(tenantId: string, expires: number = 360000) {
        let data = new TenantInfo(tenantId);
        this.util.storage.setLocalItem(TenantService.TenantKey, data, expires);
    }

    /**
     * 获取租户信息
     */
    getTenant() {
        return this.util.storage.getLocalItem<TenantInfo>(TenantService.TenantKey);
    }

    /**
     * 获取租户标识
     */
    getTenantId() {
        let tenant = this.getTenant();
        return tenant && tenant.tenantId;
    }

    /**
     * 移除租户标识
     */
    removeTenant() {
        return this.util.storage.removeLocalItem(TenantService.TenantKey);
    }
}