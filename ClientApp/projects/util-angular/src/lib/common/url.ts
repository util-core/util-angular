//============== Url操作 =============================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//====================================================
import { Util } from "../util";

/**
 * Url操作
 */
export class Url {
    /**
     * Api端点地址
     */
    private apiEndpoint: string;

    /**
     * 初始化Url操作
     * @param util 公共操作
     */
    constructor(private util: Util) {
        this.apiEndpoint = util.getAppConfig().apiEndpoint;
    }

    /**
     * 获取Url
     * @param url Url地址
     * @param paths 路径
     */
    get(url: string, ...paths: string[]): string {
        let path = this.getPath(paths);
        return this.util.helper.getUrl(url, this.apiEndpoint, path)
    }

    /**
     * 获取路径
     */
    private getPath(paths: string[]) {
        let result = "";
        if (!paths || paths.length === 0)
            return result;        
        paths.forEach(path => {
            if (this.util.helper.isEmpty(path))
                return;
            path = path.replace("\\", "/");
            if (path.endsWith("/"))
                path = this.util.helper.trimEnd(path, "/");
            result += path;
        });
        return result;
    }
}