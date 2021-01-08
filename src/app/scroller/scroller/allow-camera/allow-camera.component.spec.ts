import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowCameraComponent } from './allow-camera.component';

describe('AllowCameraComponent', () => {
  let component: AllowCameraComponent;
  let fixture: ComponentFixture<AllowCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
