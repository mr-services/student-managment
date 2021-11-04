// Angular Route
import { Route } from '@angular/router';

// Components
import { StudentsComponent } from './students.component';
import { StudentListComponent } from './list/student-list.component';
import { AddEditComponent } from './add-edit/add-edit.component';

export const studentRoutes: Route[] = [
    {
        path     : '',
        component: StudentListComponent,
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    },
    {
        path: 'add',
        component: AddEditComponent
    },
    {
        path: 'edit/:id',
        component: AddEditComponent
    }
];
