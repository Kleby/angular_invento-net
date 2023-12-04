import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { dateBeforeTodayValidator } from 'src/app/validators/dateBeforeToday.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  formRegister!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService){}

  ngOnInit(): void {
      this.formRegister = this.fb.group({
        name: ['', Validators['required']],
        code: ['', Validators['required']],
        price: ['', Validators['required']],
        expirationDate: ['', [Validators.required, dateBeforeTodayValidator()]],
        stock: ['', Validators['required']]
      })
  }

  onChangeDate(date: string): void{      
    this.formRegister.value.expirationDate = date;        
  }

  onSubmit(){
    const formValues = this.formRegister.value;
       
    this.productService.AddProduct(formValues).subscribe({
      next: res => alert(`Produto ${res.name} Cadastrado `),
      error: err => console.error(`Erro no Envio do produto ${err}`)
      
    })
    
  }

}
