// Angular Core
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { BranchesService } from '../branches.service';

@Component({
    selector: 'app-add-edit-branches',
    templateUrl: './add-edit-branches.component.html',
})
export class AddEditBranchesComponent implements OnInit {
    public branchForm: FormGroup;
    public breadScrumb: string = 'Create';
    public title: string = 'Create new branch';
    public isLoading: boolean = false;

    private instituteId: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _branchesService: BranchesService,
        private activeRoute: ActivatedRoute,
        private route: Router
    ) {
        this.branchForm = this._formBuilder.group({
            id: [''],
            title: ['', [Validators.required, Validators.minLength(3)]],
            manager: ['', [Validators.required]],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            address: ['', [Validators.required, Validators.minLength(4)]],
            createdOn: [''],
            updatedOn: ['']
        });
    }

    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe((params) => {
            if (params && Object.keys(params).length > 0) {
                this.breadScrumb = 'Edit';
                this.title = `Edit ${params.title}`;
                this.instituteId = params.instituteId;
                this.branchForm.setValue({
                    id: params.id,
                    title: params.title,
                    manager: params.manager,
                    phoneNumber: params.phoneNumber,
                    address: params.address,
                    instituteId: params.instituteId,
                    createdOn: params.createdOn,
                    updatedOn: params.updatedOn,
                });
            }
        });
    }

    addBranch(addBranch: FormGroup): void {
        this.isLoading = true;
        this.branchForm.disable();
        const { title, manager, phoneNumber, address } = addBranch.value;
        if (this.breadScrumb === 'Create') {
            this._branchesService.addBranch({
                title,
                manager,
                phoneNumber,
                address,
                createdOn: new Date(),
                updatedOn: new Date()
            })
            .then(() => {
                this.branchForm.reset();
                this.route.navigate(['/apps/branches']);
            })
            .finally(() => {
                this.isLoading = false;
            });
        } else {
            this._branchesService.updateBranch({
                id: addBranch.value.id,
                title,
                manager,
                phoneNumber,
                address,
                instituteId: this.instituteId,
                updatedOn: new Date()
            })
            .then(() => {
                this.branchForm.reset();
                this.route.navigate(['/apps/branches']);
            })
            .catch(error => console.log('error updating branch ', error))
            .finally(() => {
                this.isLoading = false;
            });
        }
    }
}
