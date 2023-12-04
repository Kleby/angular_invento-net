import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, title: 'Home', pathMatch: 'prefix'
  },
  {
    path: 'register', component: RegisterComponent, title: 'Cadastra Produtos'
  },
  {
    path: 'contact', component: ContactComponent, title: 'Contato'
  },
  {
    path: '**', component: NotFoundComponent, title: 'Page not found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
