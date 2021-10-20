import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BranchesService } from './branches.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styles         : [
    /* language=SCSS */
    `
        .branch-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 20px auto auto auto auto auto;
            }

            @screen md {
                grid-template-columns: 48px 112px 112px 112px auto 96px;
            }

            @screen lg {
                grid-template-columns: 48px 112px 112px 112px auto 96px;
            }
        }
    `
  ],
})
export class BranchesComponent implements OnInit {

  public data: any;
  public isLoading: boolean = true;
  public searchInputControl: FormControl = new FormControl();
  public branches$: Observable<any[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _branchesService: BranchesService,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    // Get the data
    this._branchesService.data$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {

        // Store the data
        this.data = data;
    });

    this._branchesService.getData().subscribe();

    this._branchesService.branches.subscribe(
        // Success
        (branches) => {
            this.branches$ = branches;

            // Stop loading
            this.isLoading = false;
        },

        // Error
        (err) => {
          // Stop loading
          this.isLoading = false;
        },
    );
  }

  addBranch(): void { }

  editBranch(branch): void {
    this._router.navigate([`/apps/branches/edit/:${branch.title}`]);
  }

}
