//================== 授权服务 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//======================================================
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * 授权服务
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    /**
     * 是否已认证
     */
    private _isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    /**
     * 是否已认证
     */
    isAuthenticated$ = this._isAuthenticatedSubject$.asObservable();
    /**
     * 发现文档是否加载完成
     */
    private _isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
    /**
     * 发现文档是否加载完成
     */
    isDoneLoading$ = this._isDoneLoadingSubject$.asObservable();

    /**
     * 初始化授权服务
     * @param oauthService OAuth服务
     * @param router 路由
     */
    constructor(private oauthService: OAuthService, private router: Router) {
        this.subscribeEvents();
    }

    /**
     * 订阅事件
     */
    private subscribeEvents() {
        this.oauthService.events.subscribe(_ => {
            this._isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
        });
        this.oauthService.events
            .pipe(filter(e => ['token_received'].includes(e.type)))
            .subscribe(e => this.oauthService.loadUserProfile());
        this.oauthService.events
            .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
            .subscribe(e => this.login());
        this.oauthService.events
            .pipe(filter(e => ['token_expires'].includes(e.type)))
            .subscribe(e => this.refreshToken() );
    }

    /**
     * 触发发现文档加载完成
     */
    nextIsDoneLoading() {
        this._isDoneLoadingSubject$.next(true);
    }

    /**
     * 登录
     * @param url 目标地址
     */
    login(url?: string) {
        this.oauthService.initLoginFlow(url || this.router.url);
    }

    /**
     * 注销
     */
    logout() {
        this.oauthService.logOut();
    }

    /**
     * 刷新令牌
     */
    refreshToken() {
        try {
            return this.oauthService.refreshToken();
        }
        catch (error) {
            console.error(error);
            return this.logout();
        }
    }

    /**
     * 是否拥有有效访问令牌
     */
    hasToken() {
        return this.oauthService.hasValidAccessToken();
    }

    /**
     * 加载发现文档并登录
     */
    loadDiscoveryDocumentAndTryLogin() {
        return this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

    /**
     * 获取声明集合
     */
    getIdentityClaims() {
        return this.oauthService.getIdentityClaims();
    }

    /**
     * 获取状态
     */
    get state() {
        return this.oauthService.state;
    }
}
