import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BranchesService } from '../branches.service';

@Component({
    selector: 'app-add-edit-branches',
    templateUrl: './add-edit-branches.component.html',
})
export class AddEditBranchesComponent implements OnInit {
    public branchForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _branchesService: BranchesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {

        this.route.queryParams.subscribe((params) => {
            console.log('params,,,', params);
        });

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
        });
    }

    addBranch(addBranch: FormGroup): void {
        const { title, manager, phoneNumber, address } = addBranch.value;
        this._branchesService.addBranch({
            title,
            manager,
            phoneNumber,
            address,
        });
    }
}
