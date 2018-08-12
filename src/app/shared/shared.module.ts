import { StorageInputComponent } from "./storage-input/storage-input.component";
import { ModuleWithProviders, NgModule } from "@angular/core";

import { AuthService } from "./services/auth.service";
import { LoggingService } from "./services/logging.service";
import { WINDOW_SERVICE } from "./services/window.service";
import { FormsModule } from "@angular/forms";

export function getWindow() { return window; }

@NgModule({
  imports: [FormsModule],
  declarations: [StorageInputComponent],
  exports: [StorageInputComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        LoggingService,
        AuthService,
        { provide: WINDOW_SERVICE, useFactory: getWindow },
      ]
    };
  }
}
