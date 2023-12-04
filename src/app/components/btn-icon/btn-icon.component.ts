import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-icon',
  templateUrl: './btn-icon.component.html',
  styleUrls: ['./btn-icon.component.css']
})
export class BtnIconComponent {
  @Input() iconName: string = '';
  @Input() iconTitle: string = '';
  @Input() labelText: string = '';
  @Input() iconId: string| number = '';
}
