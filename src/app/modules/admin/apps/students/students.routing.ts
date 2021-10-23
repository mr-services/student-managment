// Angular Route
import { Route } from '@angular/router';

// Components
import { StudentsComponent } from './students.component';
import { StudentListComponent } from './list/student-list.component';

export const studentRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'students'
    },
    {
        path     : 'students',
        component: StudentsComponent,
        children : [
            {
                path     : '',
                component: StudentListComponent
            }
        ]
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
    }
];
