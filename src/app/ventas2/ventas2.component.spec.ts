import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ventas2Component } from './ventas2.component';

describe('Ventas2Component', () => {
  let component: Ventas2Component;
  let fixture: ComponentFixture<Ventas2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ventas2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ventas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
