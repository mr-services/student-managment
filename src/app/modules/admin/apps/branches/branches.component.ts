// Angular Core
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

// Fuse Core
import { FuseConfirmationService } from '@fuse/services/confirmation';

// RXJS
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
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
                grid-template-columns: 48px 112px 112px 112px auto 112px 112px 96px;
            }

            @screen lg {
                grid-template-columns: 48px 112px 112px 112px auto 112px 112px 96px;
            }
        }
    `
  ],
})
export class BranchesComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  public data: any;
  public isLoading: boolean = true;
  public searchInputControl: FormControl = new FormControl();
  public branches$: Observable<any[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _branchesService: BranchesService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this._branchesService.brancheList().subscribe(
        // Success
        (branches) => {
            this.branches$ = branches;

            // Stop loading
            this.isLoading = false;
        },

        // Error
        (err) => {},

        // Finally
        () => {
          // Stop loading
          this.isLoading = false;
        }
    );
  }

  addBranch(): void { }

  editBranch(branch: any): void {
    this._router.navigate([`/apps/branches/edit/:${branch.id}`], { relativeTo: this._activeRoute, queryParams: branch });
  }

  deleteBranch(branch): void {
    const dialogRef = this._fuseConfirmationService.open();
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'confirmed') {
        this.isLoading = true;
        await this._branchesService.deleteBranch(branch.id)
          .then(() => console.log('branch deleted ✅'))
          .catch(() => console.log('failed to delete branch ❌'))
          .finally(() => this.isLoading = false);
      }
    });
  }

}
