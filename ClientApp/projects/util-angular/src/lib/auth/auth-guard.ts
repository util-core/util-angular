//============== 授权路由守卫 ==========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//======================================================
import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, CanMatchFn, Router } from '@angular/router';
import { filter,switchMap,tap } from 'rxjs/operators';
import { AuthService } from "./auth.service";

/**
* 授权路由守卫
*/
export const AuthGuard: CanMatchFn | CanActivateFn | CanActivateChildFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.isDoneLoading$.pipe(
        filter(isDone => isDone),
        switchMap(_ => authService.isAuthenticated$),
        tap(isAuthenticated => isAuthenticated || authService.login(router.url))
    );
};