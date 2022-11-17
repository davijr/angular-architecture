import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessControlComponent } from "./pages/access-control/access-control.component";
import { AuthGuard } from "../authentication/guards/auth.guard";

const authorizationRoutes: Routes = [
    { path: 'authorization/access-control', component: AccessControlComponent, canActivate: [AuthGuard]},
]

@NgModule({
    imports: [RouterModule.forChild(authorizationRoutes)],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule {}