import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserService } from 'app/core/user/user.service';
import { User } from '@firebase/auth-types';

@Injectable({
    providedIn: 'root',
})
export class BranchesService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    // private branchCollections: AngularFirestoreCollection<any>;
    private branchCollections: Subject<any> = new Subject<any>();
    private instituteId: string;
    private branches$: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _afS: AngularFirestore,
        private userService: UserService
    ) {
        this.userService.currentUserInfo.subscribe((userInfo) => {
            this.instituteId = userInfo.instituteId;

            this._afS
                .collection('branches', ref =>
                    ref.where('instituteId', '==', this.instituteId)
                )
                .valueChanges()
                .subscribe((response: any) => {
                    this.branches = response;
                });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        // this.userService
        //     .getUser()
        //     .subscribe((userData: User) => {
        //         this._userInfo = userData;
        //     })
        //     .add(() => {
        //         this._afS
        //             .collection('users')
        //             .doc(this._userInfo.uid)
        //             .valueChanges()
        //             .subscribe((users) => {
        //                 console.log('users--- ', users);
        //             });
        //     });
        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    set branches(value) {
        this.branches$.next(value);
    }
    get branches(): Observable<any> {
        return this.branches$.asObservable();
    }

    addBranch(addBranch: any): void {
        addBranch.instituteId = this.instituteId;
        this._afS.collection('branches').add(addBranch);
    }
}
