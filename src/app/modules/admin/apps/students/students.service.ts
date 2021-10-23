import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private _students: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor() { }

  /**
     * Getter for students
     */
  get students$(): Observable<any[]> {
    return this._students.asObservable();
  }

  /**
    * Get Students List
    */
  getStudents(): Observable<any[]> {
    return this.students$;
  }

}
