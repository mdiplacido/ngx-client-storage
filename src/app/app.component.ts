import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ClientStore, IClientStorage } from "./shared/services/client-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  clients: () => IClientStorage[];

  constructor(private readonly clientStorage: ClientStore) {
    this.clients = () => this.clientStorage.clients();
  }
}
