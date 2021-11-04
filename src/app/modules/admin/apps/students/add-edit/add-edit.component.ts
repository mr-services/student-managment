// Angular Core
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// RXJS
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Services
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {

  public isLoading: boolean = false;
  public studentForm!: FormGroup;
  public courseOptions: Observable<string[]>;

  private courseList: string[] = ['SSC', 'Intermediate (Maths, Physics, Chemistry)', 'Intermediate (Maths, Commerce, Economics)'];

  constructor(
    private _formBuilder: FormBuilder,
    private _studentService: StudentsService,
    private _route: Router
  ) {
    this.studentForm = this._formBuilder.group({
      id: [''],
      admissionsId: ['', [Validators.required]],
      fname: ['', [Validators.required, Validators.minLength(3)]],
      lname: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      guardian: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]/)
        ],
      ],
      aadhaar: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      address: ['', [Validators.required, Validators.minLength(4)]],
      course: [''],
      joiningDate: [''],
      relievingDate: [''],
      fees: ['0', [Validators.required, Validators.pattern(/^[0-9]/)]],
      branch: [''],
      createdOn: [''],
      updatedOn: ['']
    });
  }

  ngOnInit(): void {
    this.courseOptions = this.studentForm.get('course').valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  public async submitStudentForm(studentForm: FormGroup): Promise<void> {
    this.isLoading = true;
    studentForm.patchValue({
      createdOn: new Date(),
      updatedOn: new Date()
    });
    this.studentForm.disable();
    await this._studentService.addStudent(studentForm.value)
      .then(() => {
        this._route.navigate(['/apps/students/']);
      })
      .catch(() => {
        this.studentForm.enable();
      })
      .finally(() => this.isLoading = false);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.courseList.filter(option => option.toLowerCase().includes(filterValue));
  }

}
