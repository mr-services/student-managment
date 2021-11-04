import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
    AngularFirestore, Query
} from '@angular/fire/compat/firestore';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AuthService } from 'app/core/auth/auth.service';
// import { User } from '@firebase/auth-types';

@Injectable({
    providedIn: 'root',
})
export class BranchesService {
    // private branchCollections: AngularFirestoreCollection<any>;
    private branchCollections: Subject<any> = new Subject<any>();
    private instituteId: string;
    private branches$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<any>
    {
        return this._pagination.asObservable();
    }

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _afS: AngularFirestore,
        private userService: UserService,
        private _authService: AuthService
    ) {
        // this.userService.currentUserInfo.subscribe((userInfo) => {
        //     this.instituteId = userInfo.instituteId;
        // });
        this.userService.user$.subscribe((user: User) => {
            if (!user.instituteId) {
                this.instituteId = this._authService.instituteId;
            } else {
                this.instituteId = user.instituteId;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    set branches(value: any) {
        this.branches$.next(value);
    }
    get branches(): Observable<any> {
        return this.branches$.asObservable();
    }

    brancheList(page: number = 0, size: number = 5, sort: string = 'updatedOn', order: 'asc' | 'desc' | '' = 'asc', search: string = '', lastInResponse = ''): Observable<any> {
        if (this.instituteId) {
            return this._afS
                .collection(`institutes/${this.instituteId}/branches`, ref =>
                    ref
                        .limit(size)
                        .orderBy(sort, order || 'asc')
                        // .where('title', '>=', search.toUpperCase())
                        // .where('title', '<=', search.toLowerCase() + '\uf8ff')
                        // .where('title', '>=', search).where('title', '<=', search+ '\uf8ff')
                )
                .snapshotChanges()
                .pipe(
                    map(actions => actions.map((a: any) => ({
                        ...a.payload.doc.data(),
                        ...a.payload.doc.data()?.createdOn?.toDate() || null,
                        ...a.payload.doc.data()?.updatedOn?.toDate() || null,
                        id: a.payload.doc.id
                    }))),
                    tap((response) => {
                        this.branches$.next(response);
                    })
                );
        } else {
            console.log('instituteId not found!!!');
            return of([]);
        }
    }

    nextBranchList(page: number = 0, size: number = 5, sort: string = 'title', order: 'asc' | 'desc' | '', search: string = '', lastInResponse): Observable<any> {
        // this.disable_next = true;
        return this._afS.collection(`institutes/${this.instituteId}/branches`, (ref: Query) =>
            ref.limit(5).startAfter(lastInResponse)
        ).get();
    }

    branchSize(): Observable<any> {
        return this._afS
            .collection(`institutes/${this.instituteId}/branches`)
            .get();
    }

    async addBranch(addBranch: any): Promise<void> {
        addBranch.instituteId = this.instituteId;
        // await this._afS.collection('branches').add(addBranch);
        await this._afS.collection(`institutes/${this.instituteId}/branches`).add(addBranch);
    }

    async updateBranch(branch: any): Promise<void> {
        await this._afS.collection(`institutes/${this.instituteId}/branches`).doc(branch.id).update(branch);
    }

    async deleteBranch(branchID: string): Promise<void> {
        return await this._afS.doc(`institutes/${this.instituteId}/branches/${branchID}`).delete().then(response => response).catch(error => error);
    }
}
