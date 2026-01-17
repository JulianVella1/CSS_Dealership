import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Enquiry } from '../models/enquiry';

@Injectable({
  providedIn: 'root',
})
export class EnquiryService {
  private http=inject(HttpClient);
  private baseUrl='http://localhost:5000/api';

  private getHeaders(){
    const tk=localStorage.getItem('token');
    return{headers:{'Authorization':`Bearer ${tk}`}}
  }
  sendEnq(enq:Enquiry){
    return this.http.post(`${this.baseUrl}/enquire`, enq);
  }
  getEnq(){
    return this.http.get<Enquiry[]>(`${this.baseUrl}/enquiries`, this.getHeaders());
  }
  reply(enqId:string,msg:string){
    return this.http.post(`${this.baseUrl}/admin/reply`,{enquiryId: enqId, replyMessage: msg},this.getHeaders())
  }
}
