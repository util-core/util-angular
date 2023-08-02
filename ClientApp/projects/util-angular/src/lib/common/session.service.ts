//============== 用户会话服务 ========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//===================================================
import { Util } from "../util";
import { Session } from "./session";

/**
 * 用户会话服务
 */
export class SessionService {
    /**
     * 用户会话
     */
    private _session: Session;

    /**
     * 初始化用户会话服务
     */
    constructor(util: Util) {
        this._session = util.ioc.get(Session);
    }

    /**
     * 设置用户会话
     * @param session 用户会话
     */
    setSession(session: Session) {
        if (!this._session)
            return;
        this._session.userId = session.userId;
        this._session.isAuthenticated = session.isAuthenticated;
    }

    /**
     * 是否认证
     */
    get isAuthenticated() {
        if (!this._session)
            return false;
        return this._session.isAuthenticated;
    }

    /**
     * 用户标识
     */
    get userId() {
        if (!this._session)
            return null;
        return this._session.userId;
    }
}