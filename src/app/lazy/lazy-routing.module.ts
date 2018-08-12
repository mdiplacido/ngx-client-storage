import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LazyPageComponent } from "./lazy-page/lazy-page.component";
import { LazyComponent } from "./lazy.component";

const routes: Routes = [
  {
    path: "",
    component: LazyComponent,
    children: [
      {
        path: "page1",
        component: LazyPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyRoutingModule { }
