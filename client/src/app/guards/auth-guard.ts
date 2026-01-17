import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const as=inject(AuthService);
  const router=inject(Router);

  if (as.isLoggedIn()){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }

};
