import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly api: string = "/assets/mock/db.json";
  // private readonly api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.api);
  }
  
  getProductById(id: number | string): Observable<Product>{
    return this.http.get<Product>(`${this.api}/${id}`)
  }

  private setPurchaseDate(): Date{
    const now = new Date();
    return now;
  }


  AddProduct(product: Product):Observable<Product>{
    product.purchaseDate = this.setPurchaseDate().toLocaleString('pt-BR'); 
    return this.http.post<Product>(`${this.api}/new-product`, product);
    
  }
}
