import { Component } from "@angular/core";

import { ClientStore, IClientStorage } from "./services/client-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  constructor(private readonly clientStorage: ClientStore) {
  }

  clients() {
    return this.clientStorage.clients();
  }
}
