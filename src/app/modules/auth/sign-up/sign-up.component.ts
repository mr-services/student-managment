import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _afA: AngularFireAuth,
        private _afS: AngularFirestore
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                company   : [''],
                agreements: ['', Validators.requiredTrue]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    async signUp(): Promise<void>
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        // this._authService.signUp(this.signUpForm.value)
        //     .subscribe(
        //         (response) => {

        //             // Navigate to the confirmation required page
        //             this._router.navigateByUrl('/confirmation-required');
        //         },
        //         (response) => {

        //             // Re-enable the form
        //             this.signUpForm.enable();

        //             // Reset the form
        //             this.signUpNgForm.resetForm();

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Something went wrong, please try again.'
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         }
        //     );

        try {
            await this._afA.createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password)
                .then((userInfo) => {
                    this._afS.collection('institutes').doc(this.signUpForm.value.company).set({
                        name: this.signUpForm.value.company,
                    })
                        .then(() => {
                            this._afS.collection(`institutes/${this.signUpForm.value.company}/users`).doc(userInfo.user.uid).set({
                                fName: this.signUpForm.value.name,
                                lName: this.signUpForm.value.name,
                                instituteId: this.signUpForm.value.company,
                                email: this.signUpForm.value.email,
                                password: this.signUpForm.value.password
                            });
                        });
                });

            // this._afS.collection('institutes').doc(this.signUpForm.value.company).valueChanges().subscribe((data) => {
            //     console.log(data);
            // });


            // this._afS.collection('users').doc(newUser.user.uid).set({
            //     fName: this.signUpForm.value.name,
            //     lName: this.signUpForm.value.name,
            //     email: this.signUpForm.value.email,
            //     instituteId: this.signUpForm.value.company
            // });

            // if institute id is unique
            // if (true) {
            //     await this._afS
            //         .collection('institutes')
            //         .doc(this.signUpForm.value.company)
            //         .collection('users')
            //         .doc(newUser.user.uid)
            //         .set({
            //             userID: newUser.user.uid,
            //             name: this.signUpForm.value.name,
            //             email: this.signUpForm.value.email,
            //             role: 'admin',
            //             subscriptionType: 'annual',
            //             instituteID: this.signUpForm.value.company,
            //         });

            await this._router.navigateByUrl('/confirmation-required');

        } catch (error) {
            // Re-enable the form
            this.signUpForm.enable();

            // Reset the form
            this.signUpNgForm.resetForm();

            // Set the alert
            this.alert = {
                type   : 'error',
                message: 'Something went wrong, please try again.'
            };

            // Show the alert
            this.showAlert = true;
        }
    }
}
