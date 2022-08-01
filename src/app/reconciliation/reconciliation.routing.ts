import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReconciliationDimensionGroupComponent } from "./pages/reconciliation-dimension-group/reconciliation-dimension-group.component";
import { ReconciliationToolComponent } from "./pages/reconciliation-tool/reconciliation-tool.component";
import { AuthGuard } from "../authentication/guards/auth.guard";

const reconciliationRoutes: Routes = [
    { path: 'reconciliation/account', component: ReconciliationToolComponent/*, canActivate: [AuthGuard]*/},
    { path: 'reconciliation', component: ReconciliationDimensionGroupComponent, canActivate: [AuthGuard]},
]

@NgModule({
    imports: [RouterModule.forChild(reconciliationRoutes)],
    exports: [RouterModule]
})
export class ReconciliationRoutingModule {}