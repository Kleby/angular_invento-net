import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.interface';
// import { environmentDev } from '../../environments/environment.development';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiMock: string = "/assets/mock/db.json";
  // private readonly apiDev: string = `${environmentDev.apiUrl}`;
  private readonly apiUrl: string = `${environment.apiUrl}/product`

  constructor(private http: HttpClient) { }

  getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }
  
  getProductById(id: number | string): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  private setPurchaseDate(): Date{
    const now = new Date();
    return now;
  }


  AddProduct(product: Product):Observable<Product>{
    product.purchaseDate = this.setPurchaseDate().toLocaleString('pt-BR'); 
    return this.http.post<Product>(`${this.apiUrl}`, product);
    
  }
}
