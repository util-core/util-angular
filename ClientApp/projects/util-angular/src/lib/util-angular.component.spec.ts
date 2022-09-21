import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilAngularComponent } from './util-angular.component';

describe('UtilAngularComponent', () => {
  let component: UtilAngularComponent;
  let fixture: ComponentFixture<UtilAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
