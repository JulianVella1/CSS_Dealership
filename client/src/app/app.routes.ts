import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Gallery } from './components/gallery/gallery';
import { CarDetails } from './components/car-details/car-details';
import { About } from './components/about/about';
import { Inventory } from './components/inventory/inventory';
import { Enquiries } from './components/enquiries/enquiries';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path:'', component: Home },
  { path:'login', component: Login },
  { path:'gallery', component: Gallery },
  { path:'cars/:id', component: CarDetails },
  { path:'about', component: About },
  {path: 'admin/inventory',component: Inventory,canActivate: [authGuard]},
  {path: 'admin/enquiries',component: Enquiries,canActivate: [authGuard]},
  { path: '**', redirectTo: '' }
];
