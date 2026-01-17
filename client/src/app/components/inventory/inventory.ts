import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../models/car';
import { CarService } from '../../services/car';

@Component({
  selector: 'app-inventory',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {

  carServ=inject(CarService);
  fb=inject(FormBuilder);
  cars:Car[]=[];
  isEditing=false;
  editingCarId: string | null = null;
  carForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadCars();
  }

  initForm() {
    const currentYear = new Date().getFullYear();
    this.carForm = this.fb.group({
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [currentYear, [Validators.required, (control: { value: any; }) => {
        const year = control.value;
        return year > currentYear ? { futureYear: true } : null;
      }]],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.min(0)]],
      image: [''],
      description: [''],
      condition: ['Used', [Validators.required]],
      status: ['Available']
    });
  }

  loadCars(){
    this.carServ.getCars().subscribe({
      next:(data)=>{this.cars=data;},
      error:(err)=>console.error('Error loading cars ->',err)
    })
  }

  resetForm() {
    const currentYear = new Date().getFullYear();
    this.carForm.reset({
      year: currentYear,
      price: 0,
      mileage: 0,
      condition: 'Used',
      status: 'Available'
    });
    this.isEditing = false;
    this.editingCarId = null;
  }

  addCar(){
    if (!this.carForm.valid) {
      alert('Please fill all required fields correctly');
      return;
    }
    this.carServ.addCar(this.carForm.value).subscribe({
      next:()=>{
        alert('Car added successfully');
        this.loadCars();
        this.resetForm();
      },
      error: (err) =>alert('Error adding car ' + err.message)
    })
  }

  startEdit(car: Car){
    this.isEditing = true;
    this.editingCarId = car._id || null;
    this.carForm.patchValue(car);
  }

  updateCar(){
    if(!this.editingCarId || !this.carForm.valid) return;
    this.carServ.updateCar(this.editingCarId, this.carForm.value).subscribe({
      next:()=>{
        alert('Car updated successfully');
        this.loadCars();
        this.resetForm();
      },
      error: (err) =>alert('Error updating car ' + err.message)
    })
  }

  cancelEdit(){
    this.resetForm();
  }

  updateCarStatus(id: string | undefined, newStatus: 'Available' | 'Sold'){
    if(!id) return;
    this.carServ.updateCarStatus(id, newStatus).subscribe({
      next:()=>{
        alert(`Car status updated to ${newStatus}`);
        this.loadCars();
      },
      error: (err) =>alert('Error updating status ' + err.message)
    })
  }

  deleteCar(id?:string){
    if(!id) return;
    if(confirm('Are you sure?')) {
      this.carServ.deleteCar(id).subscribe({
        next: () => this.loadCars(),
        error: (err) => alert('Error deleting: ' + err.message)
      });
    }
  }

}
