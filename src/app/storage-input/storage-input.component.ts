import { Component, Input, OnInit } from "@angular/core";

import { ClientStore } from "./../services/client-storage.service";

@Component({
  selector: "app-storage-input",
  templateUrl: "./storage-input.component.html",
  styleUrls: ["./storage-input.component.css"]
})
export class StorageInputComponent implements OnInit {
  @Input() feature: string;

  key: string;
  value: string;

  constructor(private readonly storage: ClientStore) { }

  ngOnInit() {
  }

  save(): void {
    this.storage.forFeature(this.feature).setItem(this.key, this.value);
  }

  clear(): void {
    this.storage.forFeature(this.feature).clear();
  }
}
