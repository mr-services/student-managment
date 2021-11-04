import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User as FireUser } from '@firebase/auth-types';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _currentUser: ReplaySubject<FireUser> = new ReplaySubject<FireUser>(
        1
    );
    private _collection: AngularFirestoreCollection;
    private _currentUserInfo: ReplaySubject<any> = new ReplaySubject();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _afA: AngularFireAuth,
        private readonly _afs: AngularFirestore
    ) {
        // this._currentUser.subscribe((user: FireUser) => {
        //     console.log('fireUser, ', user);
        //     this._afs.collection('users').doc(user.uid).valueChanges().subscribe((userInfo) => {
        //         console.log('userInfo, ', userInfo);
        //     });
        // });
        this._afA.currentUser.then((user: FireUser) => {
            this.currentUser = user;
        });

        // this.currentUser$.subscribe((userInfo) => {
        //     this._afs
        //         .collection('users')
        //         .doc(userInfo.uid)
        //         .valueChanges()
        //         .subscribe((userInf) => {
        //             this.currentUserInfo = userInf;
        //         });
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Setter & getter for currentUser
     *
     * @param value
     */
    set currentUser(value: FireUser) {
        // Store the value
        this._currentUser.next(value);
    }

    get currentUser$(): Observable<FireUser> {
        return this._currentUser.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    /**
     * Get the current logged in user data
     */
    getUser(): Observable<FireUser> {
        // this._afs
        //         .collection('users')
        //         .doc(user.uid)
        //         .get()
        //         .subscribe((userInfo) => {
        //             console.log('userInfo!@#', userInfo.data());
        //             debugger
        //         });
        return this._currentUser;
    }

    set currentUserInfo(value: any) {
        this._currentUserInfo.next(value);
    }
    get currentUserInfo(): Observable<any> {
        return this._currentUserInfo.asObservable();
    }
}
