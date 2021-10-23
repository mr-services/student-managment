// Angular Core
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

// RXJS
import { Observable } from 'rxjs';

// Services
import { StudentsService } from './students.service';

@Injectable({
    providedIn: 'root'
})
export class StudentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _studentService: StudentsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._studentService.getStudents();
    }
}
