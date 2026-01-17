import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http=inject(HttpClient);
  private router=inject(Router);
  private baseUrl='https://css-dealership.onrender.com';

  login(cred:any){
    return this.http.post(`${this.baseUrl}/api/login`,cred);
  }

  saveToken(tk:string){
    localStorage.setItem('token',tk)
  }
  getToken(){
    return localStorage.getItem('token')
  }
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
  isLoggedIn(){
    return !!this.getToken();
  }
  getRole(): string | null {
    const tk = this.getToken();
    if (!tk) return null;
    try {
      const payload = JSON.parse(atob(tk.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  }

}
