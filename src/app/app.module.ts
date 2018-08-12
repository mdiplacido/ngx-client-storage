import { SharedModule } from "./shared/shared.module";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RootTestComponentComponent } from "./root-test-component/root-test-component.component";
import { ClientStorageModule, StorageType, StorageScope } from "./shared/services/client-storage.service";

@NgModule({
  declarations: [
    AppComponent,
    RootTestComponentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule.forRoot(),
    ClientStorageModule.forRoot(),
    ClientStorageModule.forFeature("rootFeature", StorageType.Session, StorageScope.User),
    ClientStorageModule.forFeature("rootFeature2", StorageType.Local, StorageScope.User),
    ClientStorageModule.forFeature("testFeature", StorageType.Local, StorageScope.User),
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
