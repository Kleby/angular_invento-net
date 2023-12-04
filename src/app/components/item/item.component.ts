import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/Product.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {

  @Input() product!:Product;
  @Input() itemId: string|number = '';

}
