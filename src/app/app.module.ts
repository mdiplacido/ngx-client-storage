import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ClientStorageModule, StorageScope, StorageType } from "./services/client-storage.service";
import { WINDOW_SERVICE } from "./services/window.service";
import { LoggingService } from "./services/logging.service";
import { AuthService } from "./services/auth.service";
import { StorageInputComponent } from "./storage-input/storage-input.component";
import { AppRoutingModule } from "./app-routing.module";
import { RootTestComponentComponent } from './root-test-component/root-test-component.component';
import { RouterModule } from "@angular/router";

export function getWindow() { return window; }

@NgModule({
  declarations: [
    AppComponent,
    StorageInputComponent,
    RootTestComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClientStorageModule.forRoot(),
    ClientStorageModule.forFeature("rootFeature", StorageType.Session, StorageScope.User),
    ClientStorageModule.forFeature("rootFeature2", StorageType.Local, StorageScope.User),
    ClientStorageModule.forFeature("testFeature", StorageType.Local, StorageScope.User),
    AppRoutingModule
  ],
  providers: [
    LoggingService,
    AuthService,
    { provide: WINDOW_SERVICE, useFactory: getWindow },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
