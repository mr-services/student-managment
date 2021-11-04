import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private instituteId!: string;
  private _students: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(
    private _afS: AngularFirestore,
    private _authService: AuthService,
    private userService: UserService
  ) {
    this.userService.user$.subscribe((user: User) => {
      if (!user.instituteId) {
        this.instituteId = this._authService.instituteId;
      } else {
        this.instituteId = user.instituteId;
      }
    });
  }

  /**
   * Set value for students
   */
  set students$(value: any) {
    this._students.next(value);
  }

  /**
   * Getter for students
   */
  get students$(): Observable<any[]> {
    return this._students.asObservable();
  }

  /**
   * Get Students List
   */
  public getStudents(page: number = 0, size: number = 5, sort: string = 'updatedOn', order: 'asc' | 'desc' | '' = 'asc', search: string = ''): Observable<any[]> {
    return this._afS.collection(`institutes/${this.instituteId}/students`, ref =>
        ref.limit(size).orderBy(sort, order || 'asc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => actions.map((a: any) => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data(),
          ...a.payload.doc.data()?.createdOn?.toDate() || null,
          ...a.payload.doc.data()?.updatedOn?.toDate() || null
        }))),
        tap((response) => {
          this.students$ = response;
        })
      );
  }

  public async addStudent(student): Promise<void> {
    delete student.id;
    await this._afS.collection(`institutes/${this.instituteId}/students`).add(student);
  }

}
