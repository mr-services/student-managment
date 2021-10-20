import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesComponent } from './branches.component';
import { RouterModule } from '@angular/router';
import { branchesRoutes } from './branches.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditBranchesComponent } from './add-edit-branches/add-edit-branches.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    BranchesComponent,
    AddEditBranchesComponent
  ],
  imports: [
    RouterModule.forChild(branchesRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule
  ]
})
export class BranchesModule { }
