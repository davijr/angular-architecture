import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./authentication/guards/auth.guard";
import { LoginComponent } from "./authentication/pages/login/login.component";
import { HomeComponent } from "./core/pages/home/home.component";
import { AuditComponent } from "./core/pages/audit/audit.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'audit', component: AuditComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}