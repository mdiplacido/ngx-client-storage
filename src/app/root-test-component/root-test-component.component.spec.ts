import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RootTestComponentComponent } from "./root-test-component.component";

describe("RootTestComponentComponent", () => {
  let component: RootTestComponentComponent;
  let fixture: ComponentFixture<RootTestComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RootTestComponentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootTestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
