import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebglBlockedComponent } from './webgl-blocked.component';

describe('WebglBlockedComponent', () => {
  let component: WebglBlockedComponent;
  let fixture: ComponentFixture<WebglBlockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebglBlockedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebglBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
