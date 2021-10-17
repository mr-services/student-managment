// Angular Core
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';

// RXJS
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';

// Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@firebase/auth-types';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    /**
     * User is authentication status
     */
    private _signedIn: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _fireAuth: AngularFireAuth
    )
    {
        this._fireAuth.authState.subscribe((user: User) => {
            this._signedIn = !!user;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean>
    {
        if (this._signedIn) {
            return of(true);
        } else {
            this._router.navigate(['sign-in'], {queryParams: {redirectURL}});
            return of(false);
        }
        // Check the authentication status
        // return this._authService.check()
        //            .pipe(
        //                switchMap((authenticated) => {

        //                    // If the user is not authenticated...
        //                    if ( !authenticated )
        //                    {
        //                        // Redirect to the sign-in page
        //                        this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

        //                        // Prevent the access
        //                        return of(false);
        //                    }

        //                    // Allow the access
        //                    return of(true);
        //                })
        //            );
    }
}
