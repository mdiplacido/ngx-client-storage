import { ClientStorageModule, StorageType, StorageScope } from "./../shared/services/client-storage.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LazyRoutingModule } from "./lazy-routing.module";
import { LazyPageComponent } from "./lazy-page/lazy-page.component";
import { LazyComponent } from "./lazy.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LazyRoutingModule,
    ClientStorageModule.forFeature("lazyFeature", StorageType.Session, StorageScope.Tenant)
  ],
  declarations: [LazyComponent, LazyPageComponent]
})
export class LazyModule { }
