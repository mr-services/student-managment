import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BranchesService } from './branches.service';

@Injectable({
    providedIn: 'root'
})
export class BranchesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _branchesService: BranchesService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        // return this._branchesService.brancheList().pipe(res => res);
        return of([]);
    }
}
