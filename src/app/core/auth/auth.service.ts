import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User as FireUser } from '@firebase/auth-types';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn:  'root'
})
export class AuthService
{
    private _authenticated: boolean = false;
    private _signedIn: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _firebaseAuth: AngularFireAuth,
        private _afs: AngularFirestore,
    )
    {
        this._firebaseAuth.authState.subscribe((user: FireUser) => {
            this._signedIn = user.uid ? true : false;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for institute id
     */
    set instituteId(id: string)
    {
        localStorage.setItem('instituteId', id);
    }

    get instituteId(): string
    {
        return localStorage.getItem('instituteId') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                // this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    async signInUsingFirebase(credentials: { email: string; password: string; instituteId: string }): Promise<void> {
        return this._firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password).then((response) => {

            // Store the instituteId token in the local storage
            this.instituteId = credentials.instituteId;

            response.user.getIdToken().then((token) => {
                // Store the access token in the local storage
                this.accessToken = token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // this._userService.update({
                //     id: response.user.uid,
                //     name: response.user.displayName,
                //     email: response.user.email,
                //     avatar: response.user.photoURL,
                //     status: 'online'
                // });
            });

            this._userService.user = {
                ...this._userService.user,
                instituteId: credentials.instituteId
            };
            // this._userService.update({
            //     ...this._userService.user,
            //     instituteId: credentials.instituteId
            // }).subscribe();

            // this._firebaseAuth.user.subscribe((user: FireUser) => {
            //     // Store the user on the user service
            //     this._userService.user = {
            //         id: user.uid,
            //         name: user.displayName,
            //         email: user.email,
            //         avatar: user.photoURL || 'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png',
            //         status: 'online',
            //         instituteId: credentials.instituteId
            //     };
            // });
        });
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Firebase SignOut
        this._firebaseAuth.signOut();

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        if (this._signedIn) {
            return of(true);
        } else {
            // this._router.navigate(['sign-in'], {queryParams: {redirectURL}});
            return of(false);
        }

        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        // return this.signInUsingToken();
        return of(true);
    }
}
