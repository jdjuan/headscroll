import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedCameraComponent } from './blocked-camera.component';

describe('BlockedCameraComponent', () => {
  let component: BlockedCameraComponent;
  let fixture: ComponentFixture<BlockedCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockedCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
