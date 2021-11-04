import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styles         : [
    `
        .student-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 20px auto auto auto auto auto;
            }

            @screen md {
                grid-template-columns: 48px 112px 150px 112px 112px 112px 112px 112px 112px 96px;
            }

            @screen lg {
                grid-template-columns: 48px 112px 150px 112px 112px 112px 112px 112px 112px 96px;
            }
        }
    `
  ],
})
export class StudentListComponent implements OnInit {

  public studentsList!: any[];
  public isLoading: boolean = true;
  public searchInputControl: FormControl = new FormControl();

  constructor(
    private _studentsService: StudentsService
  ) {
    this._studentsService.getStudents().subscribe();
  }

  ngOnInit(): void {
    this._studentsService.students$.subscribe((students: any) => {
      if (!!students) {
        this.studentsList = students;
        this.isLoading = false;
      }
    });
  }

}
