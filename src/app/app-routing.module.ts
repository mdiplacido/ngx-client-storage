import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RootTestComponentComponent } from "./root-test-component/root-test-component.component";

const routes: Routes = [
  { path: "test", component: RootTestComponentComponent },
  { path: "lazy", loadChildren: "./lazy/lazy.module#LazyModule" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
