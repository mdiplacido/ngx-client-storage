import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StorageInputComponent } from "./storage-input.component";

describe("StorageInputComponent", () => {
  let component: StorageInputComponent;
  let fixture: ComponentFixture<StorageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
