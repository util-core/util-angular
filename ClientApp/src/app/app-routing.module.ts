import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from "./welcome/welcome.component"
import { ApplicationListComponent } from "./application/application-list.component"
import { ClaimListComponent } from './claim/claim-list.component';
import { ModuleListComponent } from "./module/module-list.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/welcome' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'application', component: ApplicationListComponent },
    { path: 'claim', component: ClaimListComponent },
    { path: 'module', component: ModuleListComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
