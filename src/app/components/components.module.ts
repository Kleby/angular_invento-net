import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnIconComponent } from './btn-icon/btn-icon.component';
import { ButtonComponent } from './button/button.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { InputComponent } from './input/input.component';
import { EditDeleteComponent } from './edit-delete/edit-delete.component';
import { TaskComponent } from './task/task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemComponent } from './item/item.component';
import { ConvertToBrPipe } from '../pipes/convert-to-br.pipe';
import { AddZeroPipe } from '../pipes/add-zero.pipe';
import { AppRoutingModule } from '../app-routing.module';


const importComponents = [
  BtnIconComponent,
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  EditDeleteComponent,
  TaskComponent,
  ItemComponent,
  
  ConvertToBrPipe,
  AddZeroPipe,
]

@NgModule({
  declarations: importComponents,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  exports: importComponents
})
export class ComponentsModule { }
