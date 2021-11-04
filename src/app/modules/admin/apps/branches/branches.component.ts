// Angular Core
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { QuerySnapshot } from '@firebase/firestore';

// Fuse Core
import { FuseConfirmationService } from '@fuse/services/confirmation';

// RXJS
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';

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
export class BranchesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  public data: any;
  public isLoading: boolean = true;

  public searchInputControl: FormControl = new FormControl();
  public searchTypeControl: FormControl = new FormControl();

  public branches$: any[];
  public branchCount: number = 0;
  pagination: any;

  // save first document in snapshot of items received
  public firstInResponse: any = [];

  // save last document in snapshot of items received
  lastInResponse: any = [];

  // keep the array of first document of previous pages
  prevStrtAt: any = [];

  // maintain the count of clicks on Next Prev button
  paginationClickedCount = 0;

  // two buttons will be needed by which next data or prev data will be loaded
  // disable next and prev buttons
  disableNext: boolean = false;
  disablePrev: boolean = true;

  private searchInput: string = '';
  private searchType: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _branchesService: BranchesService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._branchesService.branches
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
          // Success
          (branches) => {

            if (branches && branches.length > 0) {
              // this.branches$ = branches;

              this.firstInResponse = branches[0];
              this.lastInResponse = branches[branches.length - 1]['id'];

              this.branches$ = [];
              for (const branch of branches) {
                this.branches$.push(branch);
              }

              // initilize values
              this.prevStrtAt = [];
              this.paginationClickedCount = 0;
              this.disableNext = false;
              this.disablePrev = false;

              // push first item to use for Previous action
              this.pushPrevStartAt(this.firstInResponse);

              // Stop Loading
              this.isLoading = false;

            } else {
              this.branches$ = [];
            }
          },

          // Error
          (err) => {},

          () => {
            this.isLoading = false;
          },
      );

    this._branchesService.branchSize()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((snap: QuerySnapshot) => {
          this.branchCount = snap.size;
        });

    this._branchesService.brancheList()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe();

    this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            // debounceTime(400)
        )
        .subscribe((changes: string) => {
          this.searchInput = changes;
        });

    this.searchTypeControl.valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((changes: string) => {
          this.searchType = changes;
        });
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
          id          : 'title',
          start       : 'asc',
          disableClear: true
      });

      // Mark for check
      // this._changeDetectorRef.markForCheck();

      // Get products if sort or page changes
      merge(this._sort.sortChange, this._paginator.page, this.searchInputControl.valueChanges).pipe(
        debounceTime(400),
        switchMap(() => {
          this.isLoading = true;
          return this._branchesService.brancheList(
            this._paginator.pageIndex, this._paginator.pageSize, this._sort.active,
            this._sort.direction, this.searchInput, this.lastInResponse
          );
        }),
        map(() => {
            this.isLoading = false;
        })
      ).pipe(takeUntil(this._unsubscribeAll)).subscribe();

      // Get the pagination
      this._branchesService.pagination$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((pagination) => {

              if (!!pagination) {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Stop loading
                this.isLoading = false;
              }

          });
    }
  }

  // add a document
  pushPrevStartAt(prevFirstDoc): void {
      this.prevStrtAt.push(prevFirstDoc);
  }

  // remove non required document
  popPrevStartAt(prevFirstDoc): void {
    this.prevStrtAt.forEach((element: any) => {
      if (prevFirstDoc.id === element.id) {
        element = null;
      }
    });
  }

  // return the Doc rem where previous page will startAt
  getPrevStartAt(): void {
      if (this.prevStrtAt.length > (this.paginationClickedCount + 1)) {
        this.prevStrtAt.splice(this.prevStrtAt.length - 2, this.prevStrtAt.length - 1);
      }
      return this.prevStrtAt[this.paginationClickedCount - 1];
  }

  addBranch(): void { }

  editBranch(branch: any): void {
    this._router.navigate([`/apps/branches/edit/:${branch.id}`], { relativeTo: this._activeRoute, queryParams: branch });
  }

  deleteBranch(branch): void {
      const dialogRef = this._fuseConfirmationService.open();
      dialogRef.afterClosed()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(async (result) => {
              if (result === 'confirmed') {
                this.isLoading = true;
                await this._branchesService.deleteBranch(branch.id)
                  .then(() => console.log('branch deleted ✅'))
                  .catch(() => console.log('failed to delete branch ❌'))
                  .finally(() => this.isLoading = false);
              }
          }
      );
  }

}
