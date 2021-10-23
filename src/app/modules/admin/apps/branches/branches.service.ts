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
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    set branches(value) {
        this.branches$.next(value);
    }
    get branches(): Observable<any> {
        return this.branches$.asObservable();
    }

    brancheList(): Observable<any> {
        return this._afS
        .collection('branches', ref =>
            ref.where('instituteId', '==', this.instituteId)
        )
        .snapshotChanges()
        .pipe(
            map(actions => actions.map((a: any) => ({
                 ...a.payload.doc.data(),
                 ...a.payload.doc.data()?.createdOn?.toDate() || null, ...a.payload.doc.data()?.updatedOn?.toDate() || null,
                 id: a.payload.doc.id
                })))
        );
    }

    async addBranch(addBranch: any): Promise<void> {
        addBranch.instituteId = this.instituteId;
        await this._afS.collection('branches').add(addBranch);
    }

    async updateBranch(branch: any): Promise<void> {
        await this._afS.collection('branches').doc(branch.id).update(branch);
    }

    async deleteBranch(branchID: string): Promise<void> {
        return await this._afS.doc(`branches/${branchID}`).delete().then(response => response).catch(error => error);
    }
}
