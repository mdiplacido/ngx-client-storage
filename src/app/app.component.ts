import { Component } from "@angular/core";

import { ClientStore, IClientStorage } from "./services/client-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  keyMyFeature: string;
  valueMyFeature: string;

  keyMyFeature2: string;
  valueMyFeature2: string;

  private readonly myFeatureClientStore: IClientStorage;
  private readonly myFeatureClientStore2: IClientStorage;

  constructor(clientStorage: ClientStore) {
    this.myFeatureClientStore = clientStorage.forFeature("myFeature");
    this.myFeatureClientStore2 = clientStorage.forFeature("myFeature2");
  }

  saveMyFeature(): void {
    this.myFeatureClientStore.setItem(this.keyMyFeature, this.valueMyFeature);
  }

  clearMyFeature(): void {
    this.myFeatureClientStore.clear();
  }

  allMyFeature() {
    return this.myFeatureClientStore.getAll();
  }

  saveMyFeature2(): void {
    this.myFeatureClientStore2.setItem(this.keyMyFeature2, this.valueMyFeature2);
  }

  clearMyFeature2(): void {
    this.myFeatureClientStore2.clear();
  }

  allMyFeature2() {
    return this.myFeatureClientStore2.getAll();
  }
}
