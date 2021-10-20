import { Route } from '@angular/router';
import { AddEditBranchesComponent } from './add-edit-branches/add-edit-branches.component';
import { BranchesComponent } from './branches.component';
import { BranchesResolver } from './branches.resolvers';

export const branchesRoutes: Route[] = [
    {
        path     : '',
        component: BranchesComponent,
        resolve  : {
            data: BranchesResolver
        },
        // children : [
        //     {
        //         path     : '',
        //         pathMatch: 'full',
        //         component: BranchesComponent,
        //         resolve  : {
        //             courses: BranchesResolver
        //         }
        //     },
        //     {
        //         path    : 'add',
        //         component: AddEditBranchesComponent,
        //         pathMatch: 'full',
        //         resolve  : {
        //             courses: BranchesResolver
        //         }
        //     },
        //     {
        //         path    : 'edit/:id',
        //         component: AddEditBranchesComponent,
        //         resolve  : {
        //             courses: BranchesResolver
        //         }
        //     }
        // ]
    },
    {
        path    : 'add',
        component: AddEditBranchesComponent,
        resolve  : {
            courses: BranchesResolver
        }
    },
    {
        path    : 'edit/:id',
        component: AddEditBranchesComponent,
        resolve : {
            courses: BranchesResolver
        }
    }
];
