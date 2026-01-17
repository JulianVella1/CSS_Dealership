import { Enquiry } from './../../models/enquiry';
import { CarService } from './../../services/car';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnquiryService } from '../../services/enquiry';

@Component({
  selector: 'app-car-details',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './car-details.html',
  styleUrl: './car-details.css',
})
export class CarDetails implements OnInit{

  route=inject(ActivatedRoute);
  carServ=inject(CarService);
  enqServ=inject(EnquiryService);
  fb=inject(FormBuilder);

  car:any=null;
  enquiryForm!: FormGroup;
  successMsg='';

  ngOnInit(): void {
    this.initForm();
    const carId=this.route.snapshot.paramMap.get('id');

    if(carId){
      this.carServ.getCar(carId).subscribe({
        next:(data)=>this.car=data,
        error:(err)=>console.error('Errors: ',err)
      })
    }
  }

  initForm() {
    this.enquiryForm = this.fb.group({
      guestName: ['', [Validators.required]],
      guestEmail: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });
  }

  onSubmit(){
    if(!this.car._id || !this.enquiryForm.valid) return;

    const enqData: Enquiry={
      carId:this.car._id,
      guestName: this.enquiryForm.get('guestName')?.value,
      guestEmail: this.enquiryForm.get('guestEmail')?.value,
      message: this.enquiryForm.get('message')?.value,
      status: 'New'
    };

    this.enqServ.sendEnq(enqData).subscribe({
      next:()=>{
        this.successMsg="Message sent!We will reply back soon";
        this.enquiryForm.reset();
      },
      error:(err)=>alert('Failed to send message')
    })
  }

}
