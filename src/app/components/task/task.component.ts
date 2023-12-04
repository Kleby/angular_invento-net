import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit{
  product!: Product;
  products: Product[] = [];

  constructor(private productSevice: ProductService){}

  ngOnInit(): void {
      this.getAllProducts();      
  }

  getAllProducts(){
    this.productSevice.getAllProducts().subscribe({
      next: res => res.map(p => this.products.push(p)),
      error: err => console.error(`Erro ao fazer a requisição: ${err}`)
    })
  }

}
