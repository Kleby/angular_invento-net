import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteComponent } from './edit-delete.component';

describe('EditDeleteComponent', () => {
  let component: EditDeleteComponent;
  let fixture: ComponentFixture<EditDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteComponent]
    });
    fixture = TestBed.createComponent(EditDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
