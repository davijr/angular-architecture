import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./authentication/login/login.component";

const appRoutes: Routes = [
    { path: '', pathMatch: 'full', component: AppComponent },
    { path: 'login', component: LoginComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}