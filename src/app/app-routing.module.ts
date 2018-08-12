import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RootTestComponentComponent } from "./root-test-component/root-test-component.component";

const routes: Routes = [
  { path: "test", component: RootTestComponentComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
