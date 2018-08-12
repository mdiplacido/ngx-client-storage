import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ClientStorageModule, StorageScope, StorageType } from "./services/client-storage.service";
import { WINDOW_SERVICE } from "./services/window.service";
import { LoggingService } from "./services/logging.service";
import { AuthService } from "./services/auth.service";
import { StorageInputComponent } from "./storage-input/storage-input.component";

export function getWindow() { return window; }

@NgModule({
  declarations: [
    AppComponent,
    StorageInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClientStorageModule.forRoot(),
    ClientStorageModule.forFeature("myFeature", StorageType.Session, StorageScope.User),
    ClientStorageModule.forFeature("myFeature2", StorageType.Local, StorageScope.User)
  ],
  providers: [
    LoggingService,
    AuthService,
    { provide: WINDOW_SERVICE, useFactory: getWindow },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
