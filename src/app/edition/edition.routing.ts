import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditionPanelComponent } from "./edition-panel/edition-panel.component";


const editionRoutes: Routes = [
    { path: 'edition/:editionModel', component: EditionPanelComponent},
]

@NgModule({
    imports: [RouterModule.forChild(editionRoutes)],
    exports: [RouterModule]
})
export class EditionRoutingModule {}