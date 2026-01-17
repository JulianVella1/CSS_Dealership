import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private http=inject(HttpClient);
  private baseUrl='http://localhost:5000/api';

  getCars(){
    return this.http.get<any[]>(`${this.baseUrl}/cars`)
  }
  getCar(id:string){
    return this.http.get<any>(`${this.baseUrl}/cars/${id}`);
  }
  getHeaders(){
    const tk=localStorage.getItem('token');
    return{headers:{'Authorization':`Bearer ${tk}`}}
  }
  addCar(carData: any){
    return this.http.post(`${this.baseUrl}/cars`, carData, this.getHeaders());
  }
  updateCar(id:string, carData: any){
    return this.http.put(`${this.baseUrl}/cars/${id}`, carData, this.getHeaders());
  }
  updateCarStatus(id:string, status: 'Available' | 'Sold'){
    return this.http.put(`${this.baseUrl}/cars/${id}`, { status }, this.getHeaders());
  }
  deleteCar(id:string){
    return this.http.delete(`${this.baseUrl}/cars/${id}`, this.getHeaders());
  }



}
